import React, { useState } from 'react';
import { Project, PageRoute } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Layers, 
  Award, 
  CheckCircle, 
  Compass, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Edit3,
  Sliders
} from 'lucide-react';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onNavigate: (route: PageRoute) => void;
  onOpenInquiry: (projectName?: string) => void;
  isAdmin?: boolean;
  onEditInAdmin?: (project: Project) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  onBack,
  onNavigate,
  onOpenInquiry,
  isAdmin = false,
  onEditInAdmin
}) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [activeFloorLevel, setActiveFloorLevel] = useState<number>(0);

  // Combine hero and gallery images for lightbox view
  const allImages = [
    project.heroImage,
    ...(project.galleryImages || [])
  ].filter(Boolean);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - container.left;
    const percentage = Math.max(0, Math.min(100, (offset / container.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center gap-3">
          {isAdmin && onEditInAdmin && (
            <button
              onClick={() => onEditInAdmin(project)}
              className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-3.5 py-1.5 rounded-full hover:bg-amber-900/50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit In Admin</span>
            </button>
          )}

          <span className="text-[11px] font-mono-tech text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded-full border border-blue-900">
            {project.status}
          </span>
        </div>
      </div>

      {/* Hero Visual Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="relative h-[55vh] sm:h-[65vh] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Hero text overlay */}
          <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-mono-tech tracking-[0.25em] text-blue-300 uppercase font-bold bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md border border-slate-700">
                  {project.category}
                </span>
                <span className="text-xs font-mono-tech text-slate-300 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md border border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {project.location}
                </span>
                <span className="text-xs font-mono-tech text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md border border-slate-700">
                  {project.year}
                </span>
              </div>
              <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl text-white font-medium tracking-tight leading-tight">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-sm sm:text-base text-slate-300 font-sans-body mt-2 font-light max-w-2xl">
                  {project.subtitle}
                </p>
              )}
            </div>

            <button
              onClick={() => setActiveLightboxIndex(0)}
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-slate-950 px-5 py-3 rounded-full text-xs font-mono-tech uppercase tracking-widest font-bold shadow-xl backdrop-blur-md transition-all cursor-pointer self-start md:self-auto"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Full Screen View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        {/* Left 2 Cols: Architectural Narrative & Materials */}
        <div className="lg:col-span-2 space-y-12">
          {/* Architectural Concept */}
          <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl">
            <h2 className="text-xs font-mono-tech text-blue-400 uppercase tracking-[0.25em] font-bold mb-4">
              Architectural Concept & Spatial Philosophy
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 font-sans-body text-sm sm:text-base leading-relaxed space-y-4">
              <p>{project.conceptDescription}</p>
            </div>

            {/* Key Materials Palette */}
            {project.keyMaterials && project.keyMaterials.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-800">
                <h3 className="text-xs font-mono-tech text-slate-400 uppercase tracking-widest mb-3">
                  Materiality & Structural Tectonic Elements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.keyMaterials.map((mat, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono-tech text-slate-200 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Before & After Interactive Comparison (if available) */}
          {project.beforeImage && project.afterImage && (
            <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono-tech text-blue-400 uppercase tracking-[0.25em] font-bold">
                  Site Metamorphosis (Before vs After)
                </h2>
                <span className="text-[11px] font-mono-tech text-slate-400">
                  Drag slider to examine structural transformation
                </span>
              </div>

              <div
                className="relative h-80 sm:h-96 rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-800"
                onMouseMove={(e) => isDraggingSlider && handleSliderMove(e)}
                onTouchMove={(e) => handleSliderMove(e)}
                onMouseDown={() => setIsDraggingSlider(true)}
                onMouseUp={() => setIsDraggingSlider(false)}
                onMouseLeave={() => setIsDraggingSlider(false)}
              >
                {/* After Image (Full background) */}
                <img
                  src={project.afterImage}
                  alt="Completed Architecture"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded text-[10px] font-mono-tech uppercase font-bold text-blue-300 border border-slate-700">
                  Completed / Post-Build
                </span>

                {/* Before Image (Clipped layer) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={project.beforeImage}
                    alt="Original Site Condition"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded text-[10px] font-mono-tech uppercase font-bold text-amber-300 border border-slate-700">
                    Pre-Renovation State
                  </span>
                </div>

                {/* Divider bar */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center pointer-events-none"
                  style={{ left: `calc(${sliderPosition}% - 2px)` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl">
                    <Sliders className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Architectural Blueprint & Drawings */}
          {project.blueprintImage && (
            <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono-tech text-blue-400 uppercase tracking-[0.25em] font-bold">
                  Technical Schematic & Blueprint Plan
                </h2>
                <span className="text-[11px] font-mono-tech text-slate-400">
                  Architectural Drafting Dossier
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black/50 p-2">
                <img
                  src={project.blueprintImage}
                  alt="Architectural Blueprint"
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floor Plan Level Hotspots if any */}
              {project.floorPlanLevels && project.floorPlanLevels.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="flex gap-2 mb-4">
                    {project.floorPlanLevels.map((lvl, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveFloorLevel(i)}
                        className={`text-xs font-mono-tech px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                          activeFloorLevel === i
                            ? 'bg-blue-900 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl.levelName}
                      </button>
                    ))}
                  </div>

                  {project.floorPlanLevels[activeFloorLevel]?.hotspots?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {project.floorPlanLevels[activeFloorLevel].hotspots.map((spot, idx) => (
                        <div key={idx} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs font-sans-body">
                          <div className="font-mono-tech font-bold text-blue-300">{spot.roomName} ({spot.size})</div>
                          <div className="text-slate-400 text-[11px] mt-1">{spot.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Virtual VR Tour (if available) */}
          {project.vrTourUrl && (
            <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl">
              <h2 className="text-xs font-mono-tech text-blue-400 uppercase tracking-[0.25em] font-bold mb-4">
                Interactive Spatial VR Experience
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800">
                <iframe
                  src={project.vrTourUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="xr-spatial-tracking"
                  title="Matterport / Spatial VR Tour"
                />
              </div>
            </section>
          )}
        </div>

        {/* Right Col: Specifications Card & Quick Inquiry */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 sticky top-28 shadow-2xl">
            <h3 className="text-xs font-mono-tech text-blue-400 uppercase tracking-[0.25em] font-bold mb-6 pb-4 border-b border-slate-800">
              Technical Specifications
            </h3>

            <div className="space-y-4 text-xs font-mono-tech">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-slate-400">TOTAL FOOTPRINT</span>
                <span className="text-white font-bold text-sm">{project.areaSqFt ? project.areaSqFt.toLocaleString() : 'N/A'} SQ FT</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-slate-400">COMPLETION YEAR</span>
                <span className="text-white font-semibold">{project.year || '2025'}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-slate-400">DISCIPLINE CATEGORY</span>
                <span className="text-white font-semibold text-right">{project.category}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-slate-400">ARCHITECTURAL STYLE</span>
                <span className="text-white font-semibold text-right">{project.architecturalStyle || 'Monolithic Contemporary'}</span>
              </div>

              {project.structuralEngineer && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">STRUCTURAL LAB</span>
                  <span className="text-white font-semibold text-right">{project.structuralEngineer}</span>
                </div>
              )}

              {project.client && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">CLIENT / COMMISSION</span>
                  <span className="text-white font-semibold text-right">{project.client}</span>
                </div>
              )}
            </div>

            {/* Accolades & Awards */}
            {project.awards && project.awards.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <span className="text-[11px] font-mono-tech text-blue-300 uppercase tracking-wider font-bold block mb-3">
                  Distinctions & Accolades
                </span>
                <ul className="space-y-2">
                  {project.awards.map((award, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans-body">
                      <Award className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Direct Inquiry CTA */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <button
                onClick={() => onOpenInquiry(project.title)}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-mono-tech text-xs uppercase tracking-[0.18em] font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-950 cursor-pointer text-center block"
              >
                Inquire About Similar Project
              </button>

              <a
                href={`https://wa.me/919150073342?text=Hello%20PRIAD%20Architects%2C%20I%20would%20like%20to%20discuss%20a%20project%20similar%20to%20${encodeURIComponent(project.title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-tech text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors cursor-pointer text-center block border border-slate-700"
              >
                WhatsApp Architectural Lead
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono-tech text-blue-400 uppercase tracking-[0.25em] font-bold block">
                Visual Documentation
              </span>
              <h2 className="font-serif-display text-2xl sm:text-4xl text-white mt-1">
                Project Gallery & Photography
              </h2>
            </div>
            <span className="text-xs font-mono-tech text-slate-400">
              {project.galleryImages.length} Photographs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxIndex(idx + 1)}
                className="group relative h-72 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer shadow-lg hover:border-blue-900/60 transition-all duration-300"
              >
                <img
                  src={imgUrl}
                  alt={`${project.title} gallery photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-slate-900/90 text-white p-3 rounded-full border border-slate-700">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-800/80 text-white hover:bg-white hover:text-black transition-colors cursor-pointer border border-slate-700 z-10"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next controls */}
          <button
            onClick={() => setActiveLightboxIndex((prev) => (prev! - 1 + allImages.length) % allImages.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-white hover:text-black transition-colors cursor-pointer border border-slate-700 z-10"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveLightboxIndex((prev) => (prev! + 1) % allImages.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-white hover:text-black transition-colors cursor-pointer border border-slate-700 z-10"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-6xl max-h-[85vh] flex flex-col items-center">
            <img
              src={allImages[activeLightboxIndex]}
              alt={`Full view ${activeLightboxIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-xl border border-slate-800 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs font-mono-tech text-slate-400 mt-4">
              Image {activeLightboxIndex + 1} of {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
