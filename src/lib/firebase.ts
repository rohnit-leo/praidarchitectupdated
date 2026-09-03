import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
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
 * Real-time subscription to projects collection.
 * Calls onUpdate whenever Firestore changes.
 */
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const projectsCol = collection(db, COLLECTION_NAME);

    const unsubscribe = onSnapshot(
      projectsCol,
      (snapshot) => {
        if (snapshot.empty) {
          // If empty in Firestore, trigger seeding in background
          seedProjectsIfEmpty().catch(console.error);
          onUpdate(PROJECTS_DATA);
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

        onUpdate(projects);
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err);
        if (onError) onError(err);
        // Fallback to local default data if snapshot errors out
        onUpdate(PROJECTS_DATA);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to setup Firestore listener:', err);
    onUpdate(PROJECTS_DATA);
    return () => {};
  }
}

/**
 * Save or update a project in Firestore
 */
export async function saveProject(project: Project): Promise<void> {
  if (!project.id) {
    throw new Error('Project must have an ID');
  }

  const docRef = doc(db, COLLECTION_NAME, project.id);
  const now = Date.now();

  const payload: Project = {
    ...project,
    updatedAt: now,
    createdAt: project.createdAt || now
  };

  const sanitized = sanitizeForFirestore(payload);
  await setDoc(docRef, sanitized, { merge: true });
}

/**
 * Delete a project from Firestore
 */
export async function deleteProject(projectId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, projectId);
  await deleteDoc(docRef);
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
 * Reset Firestore to default starter projects
 */
export async function resetProjectsToDefault(): Promise<void> {
  const projectsCol = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(projectsCol);

  // Delete all current docs
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }

  // Seed default data
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
}
