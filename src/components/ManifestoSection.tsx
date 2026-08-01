import React from 'react';
import { Award, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Title Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold block mb-2">
            Design Philosophy & Manifesto
          </span>
          <h2 className="font-serif-display text-4xl sm:text-6xl text-slate-900 tracking-tight leading-[1.05]">
            "Architecture is not applied decoration. It is structural truth made visible."
          </h2>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              num: '01',
              title: 'Monolithic Purity',
              desc: 'We reject frivolous surface ornamentation in favor of clean structural masses, bold cantilever projections, and honest board-formed concrete.'
            },
            {
              num: '02',
              title: 'Passive Climate Truth',
              desc: 'Every building form is sculpted by site topography, solar radiation trajectories, and natural wind chimneys to minimize reliance on artificial HVAC.'
            },
            {
              num: '03',
              title: 'Tactile Materiality',
              desc: 'We curate materials that age with dignity—vein-cut travertine, charred Japanese cedar, and brushed bronze that gain patinated character across generations.'
            },
            {
              num: '04',
              title: 'Parametric Engineering',
              desc: 'Precision computation and 3D BIM Level 2 clash detection guarantee that complex geometries execute flawlessly on site with zero structural compromise.'
            }
          ].map((item) => (
            <div key={item.num} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg flex flex-col justify-between hover:border-blue-900/40 hover:shadow-xl transition-all">
              <div>
                <span className="font-serif-display text-3xl text-blue-900 font-bold block mb-4">{item.num}</span>
                <h3 className="font-serif-display text-xl text-slate-900 mb-3">{item.title}</h3>
                <p className="text-xs text-slate-600 font-sans-body leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Global Awards Wall */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
            <div>
              <span className="text-blue-900 font-mono-tech text-xs tracking-widest font-bold uppercase">Global Distinction</span>
              <h3 className="font-serif-display text-2xl text-slate-900 mt-1">International Design Accolades</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { award: 'International Architecture Award 2025', category: 'Best Luxury Private Residence', project: 'The Monolith Cantilever Villa' },
              { award: 'World Architecture Festival Winner', category: 'Commercial High-Rise of the Year', project: 'NEXUS Corporate Tower' },
              { award: 'RIBA International Award for Excellence', category: 'Civic Architecture & Acoustics', project: 'Solstice Cultural Center' },
              { award: 'Elle Decor Grand Prix Winner', category: 'Luxury Interior Architecture', project: 'Zenith Penthouse Observatory' },
              { award: 'BREEAM Outstanding Certification', category: 'Net-Zero Commercial Master Plan', project: 'NEXUS Innovation Plaza' },
              { award: 'LEED Platinum Residential Honor', category: 'Biophilic Passive Solar Villa', project: 'Malibu Cliffside Residence' }
            ].map((accolade, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Award className="w-5 h-5 text-blue-900 shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif-display text-sm text-slate-900 font-semibold">{accolade.award}</h4>
                  <span className="text-[10px] font-mono-tech text-blue-900 font-bold uppercase block mt-0.5">{accolade.category}</span>
                  <span className="text-[10px] text-slate-500 font-sans-body block mt-1">Project: {accolade.project}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
