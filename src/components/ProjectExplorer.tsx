import React, { useState } from 'react';
import { Project, PageRoute } from '../types';
import { ArrowUpRight, X, Layers, MapPin, Calendar, Maximize2, Award, Download, CheckCircle, Eye } from 'lucide-react';

interface ProjectExplorerProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigate: (route: PageRoute) => void;
}

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({
  projects,
  onSelectProject,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = [
    'All',
    ...Array.from(new Set(projects.map((p) => p.category)))
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const handleOpenDossier = (proj: Project) => {
    onSelectProject(proj);
    onNavigate('project-detail');
  };

  return (
    <section className="py-24 bg-white text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold">Monolithic Portfolio</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-slate-900 mt-2">Interactive Project Explorer</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-sans-body mt-4 md:mt-0 leading-relaxed">
            Discover selected global works engineered by PRIAD ARCHITECTS across luxury residential, commercial, and institutional domains.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono-tech uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white font-bold shadow-md shadow-blue-900/15'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setActiveProject(proj)}
              className="group bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden hover:border-blue-900/50 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
              data-cursor="Inspect Project"
            >
              <div>
                {/* Hero Photo Box */}
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  <img
                    src={proj.heroImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 text-[10px] font-mono-tech text-blue-900 uppercase font-bold tracking-widest shadow-sm">
                    {proj.category}
                  </div>

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-mono-tech text-slate-800 font-semibold flex items-center gap-1.5 shadow-sm">
                    <MapPin className="w-3 h-3 text-blue-900" />
                    <span>{proj.location}</span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-blue-200 font-mono-tech text-[10px] uppercase tracking-widest font-bold block mb-1">
                      {proj.year} • {proj.areaSqFt.toLocaleString()} SQ FT
                    </span>
                    <h3 className="font-serif-display text-2xl sm:text-3xl text-white group-hover:text-blue-200 transition-colors">
                      {proj.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-600 font-sans-body leading-relaxed line-clamp-2">
                    {proj.conceptDescription}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {proj.keyMaterials.slice(0, 3).map((mat, i) => (
                      <span key={i} className="text-[10px] font-mono-tech bg-white text-slate-700 font-medium px-3 py-1 rounded-full border border-slate-200">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs font-mono-tech text-blue-900 font-bold group-hover:text-blue-700">
                <span>View Full Architectural Dossier</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 relative my-8 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
            {/* Close Button */}
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="mb-8 pr-12">
              <span className="text-blue-900 font-mono-tech text-xs tracking-widest font-bold uppercase block mb-1">
                {activeProject.category} • {activeProject.year}
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-slate-900">{activeProject.title}</h2>
              <p className="text-xs text-slate-600 font-mono-tech mt-1">{activeProject.subtitle}</p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {activeProject.galleryImages.map((img, i) => (
                <div key={i} className="h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={img} alt="Gallery view" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>

            {/* Concept Description & Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-200">
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-xs font-mono-tech text-blue-900 font-bold uppercase tracking-widest">Architectural Concept</h4>
                <p className="text-xs text-slate-700 font-sans-body leading-relaxed">
                  {activeProject.conceptDescription}
                </p>

                {activeProject.awards && activeProject.awards.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-mono-tech text-blue-900 font-bold uppercase tracking-wider block mb-2">Accolades & Recognition</span>
                    <ul className="space-y-1 text-xs text-slate-700 font-sans-body">
                      {activeProject.awards.map((awd, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                          <span>{awd}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-4 text-xs font-mono-tech text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-slate-500 block text-[10px]">TOTAL FOOTPRINT:</span>
                  <span className="text-blue-900 text-sm font-bold">{activeProject.areaSqFt.toLocaleString()} SQ FT</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-slate-500 block text-[10px]">ARCHITECTURAL STYLE:</span>
                  <span className="text-slate-900 font-semibold">{activeProject.architecturalStyle}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-slate-500 block text-[10px]">STRUCTURAL ENGINEER:</span>
                  <span className="text-slate-900 font-semibold">{activeProject.structuralEngineer}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const proj = activeProject;
                    setActiveProject(null);
                    handleOpenDossier(proj);
                  }}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full cursor-pointer transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Dedicated Project Page</span>
                </button>

                <a
                  href={`https://wa.me/919150073342?text=Hello%20PRIAD%20Architects%2C%20I%20am%20interested%20in%20a%20project%20similar%20to%20${encodeURIComponent(activeProject.title)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-full cursor-pointer transition-all"
                >
                  Inquire
                </a>
              </div>

              <button
                onClick={() => alert(`Architectural Dossier PDF for ${activeProject.title} requested.`)}
                className="bg-slate-100 text-blue-900 text-xs font-mono-tech font-bold px-5 py-3 rounded-full border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Dossier PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
