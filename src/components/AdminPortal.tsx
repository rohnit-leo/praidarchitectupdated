import React, { useState, useRef } from 'react';
import { Project, PageRoute } from '../types';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Upload, 
  Check, 
  X, 
  AlertCircle, 
  ArrowLeft, 
  Search, 
  Layers, 
  Image as ImageIcon, 
  FileText, 
  Sliders, 
  RefreshCw, 
  Database,
  ExternalLink,
  MapPin,
  Sparkles,
  Award,
  CheckCircle2,
  Globe,
  Copy,
  ShieldCheck,
  FileCode
} from 'lucide-react';
import { saveProject, deleteProject, resetProjectsToDefault } from '../lib/firebase';
import { compressImageFile, compressMultipleImageFiles } from '../lib/imageUpload';
import { SEOAdminHub } from './SEOAdminHub';

interface AdminPortalProps {
  projects: Project[];
  onNavigate: (route: PageRoute) => void;
  onSelectProject: (project: Project) => void;
  onExitAdmin: () => void;
}

const CATEGORY_PRESETS = [
  'Villa & Residence',
  'Commercial Tower',
  'Institutional',
  'Interior Makeover',
  'Facade Renovation',
  'Master Plan',
  'Hospitality & Resort'
];

const STATUS_PRESETS = [
  'Completed',
  'Under Construction',
  'Concept Stage'
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  projects,
  onNavigate,
  onSelectProject,
  onExitAdmin
}) => {
  // Authentication state (password is 'priadadmin')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('priad_admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin high-level section: 'projects' | 'seo'
  const [adminSection, setAdminSection] = useState<'projects' | 'seo'>('projects');
  const [googleVerificationCode, setGoogleVerificationCode] = useState<string>(() => {
    return localStorage.getItem('priad_google_site_verification') || 'google5c5874fddee15bd4';
  });
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [verificationSaved, setVerificationSaved] = useState(false);

  // Sync settings with server on mount
  React.useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.googleVerificationCode) {
          setGoogleVerificationCode(data.settings.googleVerificationCode);
          localStorage.setItem('priad_google_site_verification', data.settings.googleVerificationCode);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = googleVerificationCode.trim();
    localStorage.setItem('priad_google_site_verification', cleanToken);
    
    // Update meta tag in document head immediately
    let metaTag = document.getElementById('google-site-verification-meta') as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.id = 'google-site-verification-meta';
      metaTag.name = 'google-site-verification';
      document.head.appendChild(metaTag);
    }
    metaTag.content = cleanToken;

    // Permanently save to server storage
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleVerificationCode: cleanToken })
      });
    } catch (err) {
      console.warn('Could not sync settings to server:', err);
    }
    
    setVerificationSaved(true);
    setTimeout(() => setVerificationSaved(false), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  // Search and filter in project list
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Active project being edited or created
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Modal active tab: 'basic' | 'content' | 'imagery' | 'blueprint'
  const [editorTab, setEditorTab] = useState<'basic' | 'content' | 'imagery' | 'blueprint'>('basic');

  // Saving state & feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [uploadingImageTarget, setUploadingImageTarget] = useState<string | null>(null);

  // Material & Award tag inputs
  const [newMaterialInput, setNewMaterialInput] = useState('');
  const [newAwardInput, setNewAwardInput] = useState('');
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');

  // File input refs for direct uploads
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);
  const blueprintFileInputRef = useRef<HTMLInputElement>(null);

  // Confirm delete modal
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'priadadmin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('priad_admin_authenticated', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid administrator credentials. Please re-enter.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('priad_admin_authenticated');
  };

  // Open Editor for new project
  const handleStartCreate = () => {
    const newId = `project-${Date.now()}`;
    setEditingProject({
      id: newId,
      title: '',
      subtitle: '',
      category: 'Villa & Residence',
      location: 'Coimbatore, Tamil Nadu',
      areaSqFt: 5000,
      year: new Date().getFullYear(),
      status: 'Completed',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      galleryImages: [],
      conceptDescription: '',
      keyMaterials: ['Architectural Concrete', 'Thermally Broken Glass', 'Natural Teak'],
      architecturalStyle: 'Modern Brutalist Minimalism',
      structuralEngineer: 'PRIAD Structural Engineering Lab',
      awards: [],
      blueprintImage: ''
    });
    setIsCreatingNew(true);
    setEditorTab('basic');
  };

  // Open Editor for existing project
  const handleStartEdit = (proj: Project) => {
    setEditingProject({ ...proj });
    setIsCreatingNew(false);
    setEditorTab('basic');
  };

  // Direct Image Upload Handler
  const handleDirectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'heroImage' | 'beforeImage' | 'afterImage' | 'blueprintImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setUploadingImageTarget(field);
    try {
      const dataUrl = await compressImageFile(file, {
        maxWidth: 1920,
        maxHeight: 1200,
        quality: 0.85
      });

      setEditingProject((prev) => prev ? ({
        ...prev,
        [field]: dataUrl
      }) : null);
    } catch (err: any) {
      alert(`Image processing failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploadingImageTarget(null);
      // Reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  // Direct Multiple Gallery Upload Handler
  const handleDirectGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProject) return;

    setUploadingImageTarget('gallery');
    try {
      const dataUrls = await compressMultipleImageFiles(files, {
        maxWidth: 1600,
        maxHeight: 1000,
        quality: 0.82
      });

      setEditingProject((prev) => prev ? ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...dataUrls]
      }) : null);
    } catch (err: any) {
      alert(`Gallery upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploadingImageTarget(null);
      e.target.value = '';
    }
  };

  // Remove gallery item
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      galleryImages: (editingProject.galleryImages || []).filter((_, i) => i !== indexToRemove)
    });
  };

  // Save project to Firestore and Server
  const handleSaveProject = async () => {
    if (!editingProject) return;

    if (!editingProject.title.trim()) {
      alert('Please enter a project title.');
      return;
    }

    setIsSaving(true);
    try {
      await saveProject(editingProject);
      setSaveSuccessMessage('Project successfully saved and permanently reflected on website & server!');
      setTimeout(() => {
        setSaveSuccessMessage(null);
        setEditingProject(null);
      }, 1500);
    } catch (err: any) {
      alert(`Failed to save project: ${err.message || 'Storage error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete project from Firestore and Server
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    } catch (err: any) {
      alert(`Failed to delete project: ${err.message || 'Error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset to default across Firestore and Server
  const handleResetDefaults = async () => {
    if (confirm('Are you sure you want to reset the portfolio back to the initial default projects? All custom edits will be replaced across the website and server.')) {
      try {
        await resetProjectsToDefault();
        alert('Portfolio reset to default architectural showcases across website & server.');
      } catch (err: any) {
        alert(`Reset failed: ${err.message || 'Error'}`);
      }
    }
  };

  // Filter projects list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // 1. Password Prompt Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle architectural grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl border border-slate-700 bg-white/10 p-2 flex items-center justify-center mb-4 shadow-lg">
              <img
                src="/assets/priad_logo.png"
                alt="PRIAD ARCHITECTS Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] font-mono-tech tracking-[0.35em] text-blue-400 uppercase font-bold">
              Restricted Administrator Access
            </span>
            <h1 className="font-serif-display text-2xl sm:text-3xl text-white font-bold mt-1 tracking-wide uppercase">
              PRIAD ARCHITECTS
            </h1>
            <p className="text-xs text-slate-400 font-sans-body mt-2">
              Enter administrator credentials to manage projects & site verification.
            </p>

            {/* Direct Admin URL Indicator */}
            <div className="mt-4 w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-mono-tech">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin URL:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 font-semibold">/admin</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}/admin` : 'https://www.priadarchitects.in/admin', 'login-admin-url')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Admin URL"
                >
                  {copiedItem === 'login-admin-url' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Password Form */}
          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-mono-tech uppercase tracking-widest text-slate-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password..."
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono-tech"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {authError && (
                <div className="flex items-center gap-2 text-rose-400 text-xs mt-2 font-mono-tech">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-mono-tech text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-950 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center relative z-10">
            <button
              onClick={onExitAdmin}
              className="text-xs font-mono-tech text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-20">
      {/* Top Admin Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-slate-700 bg-white/10 p-1.5 flex items-center justify-center shadow-sm">
              <img
                src="/assets/priad_logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-display text-lg font-bold text-white tracking-wide uppercase">
                  PRIAD ARCHITECTS
                </span>
                <span className="text-[10px] font-mono-tech bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-bold uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-tech text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Permanent Sync Active (Server Store + Firestore + Cache)</span>
              </div>
            </div>
          </div>

          {/* Dedicated Admin URL Badge & Header Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono-tech">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">URL:</span>
              <span className="text-slate-200 font-semibold">
                {typeof window !== 'undefined' ? `${window.location.host}/admin` : 'priadarchitects.in/admin'}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}/admin` : 'https://www.priadarchitects.in/admin', 'admin-header-url')}
                className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                title="Copy full admin URL"
              >
                {copiedItem === 'admin-header-url' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span className="text-[10px] text-slate-500">Copy</span>
              </button>
            </div>

            <button
              onClick={onExitAdmin}
              className="text-xs font-mono-tech uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-xs font-mono-tech uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-950/30 px-4 py-2 rounded-full border border-rose-900/50 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Top Section Navigation */}
        <div className="flex flex-wrap items-center gap-3 mb-8 border-b border-slate-800 pb-4">
          <button
            onClick={() => setAdminSection('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech text-xs uppercase tracking-wider cursor-pointer transition-all ${
              adminSection === 'projects'
                ? 'bg-blue-900 text-white font-bold shadow-lg border border-blue-700'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Portfolio Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setAdminSection('seo')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech text-xs uppercase tracking-wider cursor-pointer transition-all ${
              adminSection === 'seo'
                ? 'bg-[#1b3d22] text-emerald-200 font-bold shadow-lg border border-emerald-600'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Google Indexing & SEO Hub</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {adminSection === 'seo' ? (
          <SEOAdminHub projects={projects} />
        ) : (
          <>
            {/* Metric Cards & Controls Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-500 block mb-1">
              Active Portfolio Projects
            </span>
            <div className="text-3xl font-serif-display font-bold text-white">
              {projects.length}
            </div>
            <span className="text-xs font-sans-body text-slate-400 mt-1 block">
              Synced across cloud Firestore
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-500 block mb-1">
              Architecture & Residencies
            </span>
            <div className="text-3xl font-serif-display font-bold text-blue-300">
              {projects.filter(p => p.category.includes('Villa') || p.category.includes('Residence')).length}
            </div>
            <span className="text-xs font-sans-body text-slate-400 mt-1 block">
              Luxury residential scale
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-500 block mb-1">
              Commercial & Institutional
            </span>
            <div className="text-3xl font-serif-display font-bold text-emerald-300">
              {projects.filter(p => p.category.includes('Commercial') || p.category.includes('Institutional')).length}
            </div>
            <span className="text-xs font-sans-body text-slate-400 mt-1 block">
              Urban scale & master plans
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-500 block mb-1">
              Quick Admin Actions
            </span>
            <button
              onClick={handleStartCreate}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-mono-tech text-xs uppercase tracking-widest font-bold py-3 rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by title, location, or discipline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-[10px] font-mono-tech uppercase text-slate-500 tracking-wider">
              Category:
            </span>
            {['All', ...CATEGORY_PRESETS.slice(0, 4)].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs font-mono-tech px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? 'bg-blue-900 text-white font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono-tech text-slate-500 hover:text-slate-300 ml-auto md:ml-4 cursor-pointer underline"
              title="Reset Firestore projects to starter defaults"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Projects List Grid */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-serif-display text-lg text-slate-300">No projects match your search criteria</p>
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
                className="mt-3 text-xs font-mono-tech text-blue-400 hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg"
              >
                {/* Project Info & Thumbnail */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0 relative">
                    <img
                      src={proj.heroImage}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] font-mono-tech text-slate-300">
                      {proj.galleryImages?.length || 0} pics
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono-tech text-blue-400 font-bold uppercase tracking-wider bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900">
                        {proj.category}
                      </span>
                      <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                        {proj.status}
                      </span>
                      <span className="text-[10px] font-mono-tech text-slate-400">
                        {proj.year}
                      </span>
                    </div>

                    <h3 className="font-serif-display text-lg sm:text-xl text-white font-semibold truncate">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans-body truncate max-w-xl">
                      {proj.subtitle || proj.location}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-mono-tech text-slate-500 mt-1">
                      <span>{proj.areaSqFt ? proj.areaSqFt.toLocaleString() : 0} SQ FT</span>
                      <span>•</span>
                      <span>{proj.location}</span>
                    </div>
                  </div>
                </div>

                {/* Row Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* View Detailed Page */}
                  <button
                    onClick={() => {
                      onSelectProject(proj);
                      onNavigate('project-detail');
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                    title="View Full Project Page"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit Project */}
                  <button
                    onClick={() => handleStartEdit(proj)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900/40 hover:bg-blue-900 text-blue-200 hover:text-white border border-blue-800 transition-colors cursor-pointer text-xs font-mono-tech uppercase tracking-wider font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Project */}
                  <button
                    onClick={() => setProjectToDelete(proj)}
                    className="p-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-900/50 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
          </>
        )}
      </div>

      {/* 3. Project Editor Modal (Add or Edit) */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative my-8 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono-tech text-blue-400 uppercase tracking-[0.25em] font-bold">
                  {isCreatingNew ? 'Create New Showcase' : 'Edit Project Details'}
                </span>
                <h2 className="font-serif-display text-2xl sm:text-3xl text-white font-bold mt-1">
                  {editingProject.title || 'Untitled Architectural Project'}
                </h2>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 pt-4 pb-6 border-b border-slate-800">
              <button
                onClick={() => setEditorTab('basic')}
                className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase tracking-wider cursor-pointer transition-all ${
                  editorTab === 'basic'
                    ? 'bg-blue-900 text-white font-bold shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                1. Core Specifications
              </button>
              <button
                onClick={() => setEditorTab('content')}
                className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase tracking-wider cursor-pointer transition-all ${
                  editorTab === 'content'
                    ? 'bg-blue-900 text-white font-bold shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                2. Concept & Materials
              </button>
              <button
                onClick={() => setEditorTab('imagery')}
                className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${
                  editorTab === 'imagery'
                    ? 'bg-blue-900 text-white font-bold shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>3. Direct Imagery & Gallery</span>
              </button>
              <button
                onClick={() => setEditorTab('blueprint')}
                className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase tracking-wider cursor-pointer transition-all ${
                  editorTab === 'blueprint'
                    ? 'bg-blue-900 text-white font-bold shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                4. Renovation & Blueprints
              </button>
            </div>

            {/* Tab 1: Core Specifications */}
            {editorTab === 'basic' && (
              <div className="py-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. The Monolith Cantilever Villa"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                      Subtitle / Brief Descriptor
                    </label>
                    <input
                      type="text"
                      value={editingProject.subtitle || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                      placeholder="e.g. Private Ultra-Luxury Residence on Sloped Cliffside"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                      Category / Discipline
                    </label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {CATEGORY_PRESETS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                      Construction Status
                    </label>
                    <select
                      value={editingProject.status}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {STATUS_PRESETS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                      Completion Year
                    </label>
                    <input
                      type="number"
                      value={editingProject.year}
                      onChange={(e) => setEditingProject({ ...editingProject, year: parseInt(e.target.value) || 2025 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                      Geographical Location
                    </label>
                    <input
                      type="text"
                      value={editingProject.location}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      placeholder="e.g. Coimbatore, Tamil Nadu / Malibu Hills"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                      Total Footprint Area (SQ FT)
                    </label>
                    <input
                      type="number"
                      value={editingProject.areaSqFt}
                      onChange={(e) => setEditingProject({ ...editingProject, areaSqFt: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                      Architectural Style
                    </label>
                    <input
                      type="text"
                      value={editingProject.architecturalStyle || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, architecturalStyle: e.target.value })}
                      placeholder="e.g. Modern Brutalist Minimalism / Biophilic Luxury"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                      Structural Engineering Partner
                    </label>
                    <input
                      type="text"
                      value={editingProject.structuralEngineer || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, structuralEngineer: e.target.value })}
                      placeholder="e.g. PRIAD Structural Design Labs"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Concept & Materials */}
            {editorTab === 'content' && (
              <div className="py-6 space-y-6">
                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                    Architectural Concept & Philosophy *
                  </label>
                  <textarea
                    rows={6}
                    value={editingProject.conceptDescription}
                    onChange={(e) => setEditingProject({ ...editingProject, conceptDescription: e.target.value })}
                    placeholder="Describe the architectural concept, spatial choreography, environmental daylighting, and design methodology..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed font-sans-body"
                  />
                </div>

                {/* Key Materials Tags */}
                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                    Key Architectural Materials
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newMaterialInput}
                      onChange={(e) => setNewMaterialInput(e.target.value)}
                      placeholder="Add material (e.g. Board-Formed Concrete, Greek Volakas Marble)..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newMaterialInput.trim()) {
                            setEditingProject({
                              ...editingProject,
                              keyMaterials: [...(editingProject.keyMaterials || []), newMaterialInput.trim()]
                            });
                            setNewMaterialInput('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newMaterialInput.trim()) {
                          setEditingProject({
                            ...editingProject,
                            keyMaterials: [...(editingProject.keyMaterials || []), newMaterialInput.trim()]
                          });
                          setNewMaterialInput('');
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-mono-tech cursor-pointer"
                    >
                      Add Material
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editingProject.keyMaterials?.map((mat, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 text-xs px-3 py-1 rounded-full border border-slate-700"
                      >
                        <span>{mat}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject({
                              ...editingProject,
                              keyMaterials: editingProject.keyMaterials.filter((_, idx) => idx !== i)
                            });
                          }}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Awards & Distinctions */}
                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 uppercase mb-1">
                    Awards, Accolades & Certifications
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newAwardInput}
                      onChange={(e) => setNewAwardInput(e.target.value)}
                      placeholder="Add award (e.g. Winners Of Young Designers Awards 2018 By IA&B)..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newAwardInput.trim()) {
                            setEditingProject({
                              ...editingProject,
                              awards: [...(editingProject.awards || []), newAwardInput.trim()]
                            });
                            setNewAwardInput('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newAwardInput.trim()) {
                          setEditingProject({
                            ...editingProject,
                            awards: [...(editingProject.awards || []), newAwardInput.trim()]
                          });
                          setNewAwardInput('');
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-mono-tech cursor-pointer"
                    >
                      Add Award
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {editingProject.awards?.map((award, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 text-xs"
                      >
                        <div className="flex items-center gap-2 text-slate-300">
                          <Award className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>{award}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject({
                              ...editingProject,
                              awards: editingProject.awards?.filter((_, idx) => idx !== i)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: DIRECT IMAGE UPLOAD & GALLERY (KEY REQUIREMENT) */}
            {editorTab === 'imagery' && (
              <div className="py-6 space-y-8">
                {/* 1. Hero Cover Image */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-mono-tech text-blue-400 uppercase tracking-widest font-bold block">
                        Primary Cover Image *
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Shown on the portfolio grid and project header
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={heroFileInputRef}
                        accept="image/*"
                        onChange={(e) => handleDirectImageUpload(e, 'heroImage')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        disabled={uploadingImageTarget === 'heroImage'}
                        className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-mono-tech uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImageTarget === 'heroImage' ? 'Uploading...' : 'Direct Image Upload'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Preview Thumbnail */}
                  {editingProject.heroImage && (
                    <div className="relative h-56 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 mb-3">
                      <img
                        src={editingProject.heroImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-mono-tech text-slate-500 uppercase mb-1">
                      Or direct image URL / link:
                    </label>
                    <input
                      type="text"
                      value={editingProject.heroImage}
                      onChange={(e) => setEditingProject({ ...editingProject, heroImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 2. Project Gallery Photos (Direct Multiple Upload) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="text-xs font-mono-tech text-blue-400 uppercase tracking-widest font-bold block">
                        Project Photo Gallery
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Directly upload multiple photos from your computer/device
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={galleryFileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleDirectGalleryUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        disabled={uploadingImageTarget === 'gallery'}
                        className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-mono-tech uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImageTarget === 'gallery' ? 'Compressing & Uploading...' : 'Upload Photos (Multi-Select)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Add by URL input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newGalleryUrlInput}
                      onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                      placeholder="Or paste an image URL to append to gallery..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newGalleryUrlInput.trim()) {
                            setEditingProject({
                              ...editingProject,
                              galleryImages: [...(editingProject.galleryImages || []), newGalleryUrlInput.trim()]
                            });
                            setNewGalleryUrlInput('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newGalleryUrlInput.trim()) {
                          setEditingProject({
                            ...editingProject,
                            galleryImages: [...(editingProject.galleryImages || []), newGalleryUrlInput.trim()]
                          });
                          setNewGalleryUrlInput('');
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-mono-tech cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {editingProject.galleryImages?.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-md"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-900/90 text-white rounded-lg opacity-80 group-hover:opacity-100 hover:bg-rose-700 transition-opacity cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {(!editingProject.galleryImages || editingProject.galleryImages.length === 0) && (
                      <div className="col-span-2 sm:col-span-4 py-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs font-mono-tech">
                        No gallery photos yet. Click "Upload Photos" to add directly from your device.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Renovation & Blueprints */}
            {editorTab === 'blueprint' && (
              <div className="py-6 space-y-6">
                {/* Before and After Renovation Section */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
                  <span className="text-xs font-mono-tech text-blue-400 uppercase tracking-widest font-bold block mb-1">
                    Before vs After Renovation Slider
                  </span>
                  <p className="text-xs text-slate-400 mb-4">
                    For renovation and transformation projects, upload Before and After images to enable the interactive comparison slider.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Before Image */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono-tech text-slate-300 uppercase">
                          Before Image (Pre-Renovation)
                        </label>
                        <input
                          type="file"
                          ref={beforeFileInputRef}
                          accept="image/*"
                          onChange={(e) => handleDirectImageUpload(e, 'beforeImage')}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => beforeFileInputRef.current?.click()}
                          className="text-[11px] font-mono-tech text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Direct Upload</span>
                        </button>
                      </div>

                      {editingProject.beforeImage && (
                        <div className="h-32 rounded-xl overflow-hidden border border-slate-700 relative">
                          <img
                            src={editingProject.beforeImage}
                            alt="Before preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingProject({ ...editingProject, beforeImage: undefined })}
                            className="absolute top-1 right-1 p-1 bg-rose-900/90 text-white rounded cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <input
                        type="text"
                        value={editingProject.beforeImage || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, beforeImage: e.target.value })}
                        placeholder="Image URL..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* After Image */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono-tech text-slate-300 uppercase">
                          After Image (Completed Site)
                        </label>
                        <input
                          type="file"
                          ref={afterFileInputRef}
                          accept="image/*"
                          onChange={(e) => handleDirectImageUpload(e, 'afterImage')}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => afterFileInputRef.current?.click()}
                          className="text-[11px] font-mono-tech text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Direct Upload</span>
                        </button>
                      </div>

                      {editingProject.afterImage && (
                        <div className="h-32 rounded-xl overflow-hidden border border-slate-700 relative">
                          <img
                            src={editingProject.afterImage}
                            alt="After preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingProject({ ...editingProject, afterImage: undefined })}
                            className="absolute top-1 right-1 p-1 bg-rose-900/90 text-white rounded cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <input
                        type="text"
                        value={editingProject.afterImage || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, afterImage: e.target.value })}
                        placeholder="Image URL..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Blueprint / Technical Floorplan */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-mono-tech text-blue-400 uppercase tracking-widest font-bold block">
                        Architectural Blueprint / Schematic
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Upload drafting floorplan or site schematic drawing
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={blueprintFileInputRef}
                      accept="image/*"
                      onChange={(e) => handleDirectImageUpload(e, 'blueprintImage')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => blueprintFileInputRef.current?.click()}
                      className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-mono-tech uppercase px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Direct Upload Drawing</span>
                    </button>
                  </div>

                  {editingProject.blueprintImage && (
                    <div className="h-44 rounded-xl overflow-hidden border border-slate-700 relative bg-black/40 p-2 mb-3">
                      <img
                        src={editingProject.blueprintImage}
                        alt="Blueprint"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingProject({ ...editingProject, blueprintImage: '' })}
                        className="absolute top-2 right-2 p-1 bg-rose-900/90 text-white rounded cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    value={editingProject.blueprintImage || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, blueprintImage: e.target.value })}
                    placeholder="Or blueprint image URL..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Virtual Tour URL */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
                  <span className="text-xs font-mono-tech text-blue-400 uppercase tracking-widest font-bold block mb-1">
                    Matterport / 3D Virtual Tour Embed URL
                  </span>
                  <p className="text-xs text-slate-400 mb-3">
                    Optional Matterport VR or 3D tour link (e.g. https://my.matterport.com/show/?m=...)
                  </p>
                  <input
                    type="text"
                    value={editingProject.vrTourUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, vrTourUrl: e.target.value })}
                    placeholder="https://my.matterport.com/show/?m=..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              {saveSuccessMessage ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono-tech font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saveSuccessMessage}</span>
                </div>
              ) : (
                <span className="text-xs font-mono-tech text-slate-500">
                  Changes save directly into Firestore and update live immediately.
                </span>
              )}

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono-tech uppercase cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveProject}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-mono-tech uppercase tracking-widest font-bold shadow-xl shadow-blue-950 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save & Publish Live</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-rose-900/50 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-white mb-2">
              Confirm Project Removal
            </h3>
            <p className="text-xs text-slate-400 font-sans-body mb-6 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{projectToDelete.title}"</strong> from the portfolio? This will remove it from the live website in real time.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono-tech uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-mono-tech uppercase tracking-wider font-bold cursor-pointer transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
