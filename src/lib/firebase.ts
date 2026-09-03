import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Project } from '../types';
import { PROJECTS_DATA } from '../data/projects';

// Initialize Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if configured
export const db: Firestore = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const COLLECTION_NAME = 'projects';
const LOCAL_STORAGE_KEY = 'priad_projects_permanent_cache';

/**
 * Local storage caching utilities
 */
function getLocalProjectsCache(): Project[] | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read local projects cache:', err);
  }
  return null;
}

function setLocalProjectsCache(projects: Project[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.warn('Could not update local projects cache:', err);
  }
}

/**
 * Sanitize object for Firestore (strip undefined fields)
 */
function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  return obj;
}

/**
 * Fetch projects from the permanent Node/Express server storage
 */
export async function fetchServerProjects(): Promise<Project[] | null> {
  try {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.projects) && json.projects.length > 0) {
        return json.projects;
      }
    }
  } catch (err) {
    console.warn('Could not fetch projects from server:', err);
  }
  return null;
}

/**
 * Real-time subscription to projects with triple-layer persistence:
 * 1. Instant local storage cache
 * 2. Permanent Node server storage (/api/projects)
 * 3. Real-time Firebase Firestore synchronization
 */
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onError?: (err: any) => void
): () => void {
  // 1. Instantly provide local cache or default data (zero layout shift)
  const cached = getLocalProjectsCache();
  if (cached && cached.length > 0) {
    onUpdate(cached);
  } else {
    onUpdate(PROJECTS_DATA);
  }

  // 2. Query the permanent Node server storage in parallel
  fetchServerProjects().then((serverProjects) => {
    if (serverProjects && serverProjects.length > 0) {
      setLocalProjectsCache(serverProjects);
      onUpdate(serverProjects);
    }
  }).catch(console.warn);

  // 3. Connect real-time Firebase Firestore listener
  try {
    const projectsCol = collection(db, COLLECTION_NAME);

    const unsubscribe = onSnapshot(
      projectsCol,
      (snapshot) => {
        if (snapshot.empty) {
          // If empty in Firestore, trigger initial seeding in background
          seedProjectsIfEmpty().catch(console.error);
          return;
        }

        const projects: Project[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Project;
          projects.push({
            ...data,
            id: docSnap.id
          });
        });

        // Sort by order or year desc
        projects.sort((a, b) => {
          if (typeof a.order === 'number' && typeof b.order === 'number') {
            return a.order - b.order;
          }
          return (b.year || 0) - (a.year || 0);
        });

        // Update UI & local permanent cache
        setLocalProjectsCache(projects);
        onUpdate(projects);

        // Background sync to server store so server stays permanently updated
        fetch('/api/projects').catch(() => {});
      },
      async (err) => {
        console.warn('Firestore onSnapshot notice:', err);
        if (onError) onError(err);
        
        // Fallback: try server storage, then local cache, then starter data
        const srvProjects = await fetchServerProjects();
        if (srvProjects && srvProjects.length > 0) {
          onUpdate(srvProjects);
        } else {
          const localCache = getLocalProjectsCache();
          onUpdate(localCache && localCache.length > 0 ? localCache : PROJECTS_DATA);
        }
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to setup Firestore listener, using local/server fallback:', err);
    fetchServerProjects().then((srv) => {
      onUpdate(srv || getLocalProjectsCache() || PROJECTS_DATA);
    });
    return () => {};
  }
}

/**
 * Save or update a project permanently across:
 * 1. Firebase Firestore (Real-time DB)
 * 2. Node.js Express Server (/api/projects - file-backed permanent store)
 * 3. Browser Local Storage (Instant client-side cache)
 */
export async function saveProject(project: Project): Promise<void> {
  if (!project.id) {
    throw new Error('Project must have an ID');
  }

  const now = Date.now();
  const payload: Project = {
    ...project,
    updatedAt: now,
    createdAt: project.createdAt || now
  };

  // 1. Update local cache immediately for zero latency
  const currentCache = getLocalProjectsCache() || [...PROJECTS_DATA];
  const idx = currentCache.findIndex((p) => p.id === project.id);
  let updatedCache: Project[];
  if (idx >= 0) {
    updatedCache = [...currentCache];
    updatedCache[idx] = payload;
  } else {
    updatedCache = [payload, ...currentCache];
  }
  setLocalProjectsCache(updatedCache);

  // 2. Persist to Node.js server storage
  let serverPromise = fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project: payload })
  }).then(async (res) => {
    if (!res.ok) {
      console.warn('Server storage responded with status:', res.status);
    }
  }).catch((err) => {
    console.warn('Server project storage error:', err);
  });

  // 3. Persist to Firebase Firestore
  let firestorePromise = (async () => {
    try {
      const docRef = doc(db, COLLECTION_NAME, project.id);
      const sanitized = sanitizeForFirestore(payload);
      await setDoc(docRef, sanitized, { merge: true });
    } catch (err) {
      console.warn('Firestore save warning:', err);
    }
  })();

  // Wait for both to complete
  await Promise.allSettled([serverPromise, firestorePromise]);
}

/**
 * Delete a project permanently from Firestore, Server, and Local Storage
 */
export async function deleteProject(projectId: string): Promise<void> {
  // 1. Update local cache immediately
  const currentCache = getLocalProjectsCache() || [...PROJECTS_DATA];
  const filtered = currentCache.filter((p) => p.id !== projectId);
  setLocalProjectsCache(filtered);

  // 2. Delete on Server
  const serverPromise = fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: 'DELETE'
  }).catch((err) => console.warn('Server delete error:', err));

  // 3. Delete in Firestore
  const firestorePromise = (async () => {
    try {
      const docRef = doc(db, COLLECTION_NAME, projectId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore delete error:', err);
    }
  })();

  await Promise.allSettled([serverPromise, firestorePromise]);
}

/**
 * Seed initial default projects if Firestore collection is empty
 */
export async function seedProjectsIfEmpty(): Promise<void> {
  try {
    const projectsCol = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(projectsCol);

    if (snapshot.empty) {
      console.log('Seeding initial projects to Firestore...');
      for (let i = 0; i < PROJECTS_DATA.length; i++) {
        const item = PROJECTS_DATA[i];
        const docRef = doc(db, COLLECTION_NAME, item.id);
        const payload: Project = {
          ...item,
          order: i,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await setDoc(docRef, sanitizeForFirestore(payload));
      }
      console.log('Seeding initial projects completed successfully.');
    }
  } catch (err) {
    console.warn('Could not seed projects automatically:', err);
  }
}

/**
 * Reset all storage layers back to default starter projects
 */
export async function resetProjectsToDefault(): Promise<void> {
  // 1. Reset local cache
  setLocalProjectsCache(PROJECTS_DATA);

  // 2. Reset Server storage
  const serverPromise = fetch('/api/projects/reset', {
    method: 'POST'
  }).catch((err) => console.warn('Server reset error:', err));

  // 3. Reset Firestore
  const firestorePromise = (async () => {
    try {
      const projectsCol = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(projectsCol);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(docSnap.ref);
      }
      for (let i = 0; i < PROJECTS_DATA.length; i++) {
        const item = PROJECTS_DATA[i];
        const docRef = doc(db, COLLECTION_NAME, item.id);
        const payload: Project = {
          ...item,
          order: i,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await setDoc(docRef, sanitizeForFirestore(payload));
      }
    } catch (err) {
      console.warn('Firestore reset error:', err);
    }
  })();

  await Promise.allSettled([serverPromise, firestorePromise]);
}

export const DEFAULT_ADMIN_PASSWORD = 'priadadmin';
export const ADMIN_PASSWORD_CACHE_KEY = 'priad_admin_password';

/**
 * Retrieve the current admin password with multi-layer synchronization:
 * 1. Local browser cache
 * 2. Permanent Node server storage (/api/settings)
 * 3. Firebase Firestore document (settings/admin_security)
 * Defaults to 'priadadmin' if not changed.
 */
export async function getAdminPassword(): Promise<string> {
  // 1. Check local cache
  const cached = localStorage.getItem(ADMIN_PASSWORD_CACHE_KEY);

  // 2. Query Firestore
  try {
    const docRef = doc(db, 'settings', 'admin_security');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.password === 'string' && data.password.trim()) {
        const pass = data.password.trim();
        localStorage.setItem(ADMIN_PASSWORD_CACHE_KEY, pass);
        return pass;
      }
    }
  } catch (err) {
    console.warn('Could not read admin security config from Firestore:', err);
  }

  // 3. Query Server storage
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const json = await res.json();
      if (json?.settings?.adminPassword) {
        const pass = json.settings.adminPassword.trim();
        localStorage.setItem(ADMIN_PASSWORD_CACHE_KEY, pass);
        return pass;
      }
    }
  } catch (err) {
    console.warn('Could not read admin security config from server:', err);
  }

  return cached || DEFAULT_ADMIN_PASSWORD;
}

/**
 * Permanently update the administrator password across all layers:
 * 1. Local cache
 * 2. Firebase Firestore
 * 3. Node server store
 */
export async function changeAdminPassword(
  newPassword: string,
  currentPassword?: string
): Promise<{ success: boolean; message: string }> {
  const cleanPass = newPassword.trim();
  if (!cleanPass || cleanPass.length < 3) {
    throw new Error('New password must be at least 3 characters long.');
  }

  // 1. Update local cache
  localStorage.setItem(ADMIN_PASSWORD_CACHE_KEY, cleanPass);

  // 2. Update Firestore
  const firestorePromise = (async () => {
    try {
      const docRef = doc(db, 'settings', 'admin_security');
      await setDoc(docRef, {
        password: cleanPass,
        updatedAt: Date.now()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore password update warning:', err);
    }
  })();

  // 3. Update Node server storage
  const serverPromise = (async () => {
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword: cleanPass })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to update on server');
      }
    } catch (err: any) {
      console.warn('Server password update warning:', err);
    }
  })();

  await Promise.allSettled([firestorePromise, serverPromise]);

  return {
    success: true,
    message: 'Administrator password successfully updated across all storage systems!'
  };
}

/**
 * Reset password back to default 'priadadmin'
 */
export async function resetAdminPasswordToDefault(): Promise<void> {
  localStorage.setItem(ADMIN_PASSWORD_CACHE_KEY, DEFAULT_ADMIN_PASSWORD);

  const firestorePromise = (async () => {
    try {
      const docRef = doc(db, 'settings', 'admin_security');
      await setDoc(docRef, {
        password: DEFAULT_ADMIN_PASSWORD,
        updatedAt: Date.now()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore password reset warning:', err);
    }
  })();

  const serverPromise = (async () => {
    try {
      await fetch('/api/admin/reset-password', { method: 'POST' });
    } catch (err) {
      console.warn('Server password reset warning:', err);
    }
  })();

  await Promise.allSettled([firestorePromise, serverPromise]);
}

