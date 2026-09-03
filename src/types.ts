export type PageRoute = 
  | 'home'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'project-detail'
  | 'admin'
  | 'process'
  | 'floorplan'
  | 'before-after'
  | 'materials'
  | '3d-viewer'
  | 'calculator'
  | 'manifesto'
  | 'blog'
  | 'faq'
  | 'contact'
  | 'seo-hub';

export interface ProjectHotspot {
  x: number;
  y: number;
  roomName: string;
  size: string;
  description: string;
  imageUrl: string;
}

export interface FloorPlanLevel {
  levelName: string;
  blueprintUrl: string;
  hotspots: ProjectHotspot[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Villa & Residence' | 'Commercial Tower' | 'Institutional' | 'Interior Makeover' | 'Facade Renovation' | 'Master Plan' | string;
  location: string;
  areaSqFt: number;
  year: number;
  status: 'Completed' | 'Under Construction' | 'Concept Stage' | string;
  heroImage: string;
  galleryImages: string[];
  beforeImage?: string;
  afterImage?: string;
  blueprintImage: string;
  conceptDescription: string;
  keyMaterials: string[];
  architecturalStyle: string;
  structuralEngineer: string;
  awards?: string[];
  floorPlanLevels?: FloorPlanLevel[];
  client?: string;
  vrTourUrl?: string;
  featured?: boolean;
  order?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface ServiceItem {
  id: string;
  category: 'Architecture' | 'Interior Design' | '3D Visualization' | 'Engineering & Technical' | 'Project Support' | 'Renovation';
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  deliverables: string[];
  technicalSpecs: string[];
  sampleImage: string;
  faqs: { question: string; answer: string }[];
}

export interface Material {
  id: string;
  name: string;
  type: 'Stone & Marble' | 'Concrete & Cement' | 'Wood & Timber' | 'Glass & Metals' | 'Plaster & Finishes';
  textureUrl: string;
  description: string;
  origin: string;
  sustainabilityGrade: 'A+' | 'A' | 'B+';
  recommendedUse: string;
  accentColor: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Architectural Philosophy' | 'MEP & Engineering' | 'Materiality' | 'Sustainable Design';
  author: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  featuredImage: string;
  tags: string[];
}

export interface ConsultationFormData {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  areaSqFt: string;
  budgetRange: string;
  preferredStyle: string;
  message: string;
  siteVisitRequested: boolean;
}

export interface AIAnalysisResult {
  conceptTitle: string;
  designPhilosophy: string;
  recommendedMaterials: string[];
  spatialHighlights: string[];
  sustainabilityFeatures: string[];
  estimatedTimelineMonths: string | number;
  keyArchitecturalInsight: string;
}
