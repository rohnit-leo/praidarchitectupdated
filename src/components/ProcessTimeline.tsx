import React, { useState } from 'react';
import { Compass, Map, Layers, Eye, Cpu, FileSpreadsheet, HardHat, CheckCircle2, ChevronRight } from 'lucide-react';

export const ProcessTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Discovery & Consultation',
      icon: Compass,
      duration: '1 - 2 Weeks',
      tagline: 'Uncovering architectural intent, spatial programming, budget boundaries, and site constraints.',
      deliverables: [
        'Client Intent & Architectural Brief Formulation',
        'Initial Zoning & Local By-Law Assessment',
        'Spatial Relationship Diagramming'
      ]
    },
    {
      number: '02',
      title: 'Site Visit & Topography Mapping',
      icon: Map,
      duration: '1 - 2 Weeks',
      tagline: 'Laser scanning topography, solar radiation tracking, wind tunnel analysis, and soil load studies.',
      deliverables: [
        '3D Point-Cloud Laser Terrain Scanning',
        'Microclimate, Shadow & Wind Flow Diagrams',
        'Soil Bearing Capacity & Structural Foundation Report'
      ]
    },
    {
      number: '03',
      title: 'Concept Design & Volumetric Massing',
      icon: Layers,
      duration: '3 - 5 Weeks',
      tagline: 'Translating spatial programs into bold sculptural forms, cantilever geometry, and structural axes.',
      deliverables: [
        'Conceptual 3D Volumetric Massing Options',
        'Initial Floor Plans & Building Elevations',
        'Pre-Approval Municipal Planning Sets'
      ]
    },
    {
      number: '04',
      title: '3D Photorealistic Visualization & VR',
      icon: Eye,
      duration: '2 - 3 Weeks',
      tagline: 'Generating 8K physically based renders, day/night lighting simulation, and 360° virtual tours.',
      deliverables: [
        '8K Exterior & Interior Photorealistic Renders',
        'Cinematic 4K Walkthrough Video',
        'Interactive VR Spatial Tour'
      ]
    },
    {
      number: '05',
      title: 'Detailed Working & MEP Drawings',
      icon: Cpu,
      duration: '4 - 6 Weeks',
      tagline: 'Complete technical blueprints, structural rebar details, HVAC ducting, and electrical single-lines.',
      deliverables: [
        'BIM Level 2 Integrated Working Drawing Sets',
        'HVAC, Electrical, Plumbing & Ceiling Layouts',
        '3D BIM Clash Detection Audit'
      ]
    },
    {
      number: '06',
      title: 'BOQ, Estimation & Material Selection',
      icon: FileSpreadsheet,
      duration: '2 - 3 Weeks',
      tagline: 'Itemized Bills of Quantities (BOQ), material sample sign-offs, and contractor tender bidding.',
      deliverables: [
        'Itemized Cost Bill of Quantities (+/- 3% Precision)',
        'Physical Material Swatch Boards',
        'Contractor Tender Evaluation Matrix'
      ]
    },
    {
      number: '07',
      title: 'On-Site Execution Support & Sign-Off',
      icon: HardHat,
      duration: 'Ongoing Construction Phase',
      tagline: 'Periodic architectural site audits, structural steel verification, and quality snag-list inspections.',
      deliverables: [
        'Periodic On-Site Architectural Verification',
        'Material Sample Quality Auditing',
        'Final As-Built Drawing Set Sign-Off'
      ]
    }
  ];

  const CurrentIcon = steps[activeStep].icon;

  return (
    <section className="py-24 bg-white text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold">Structured Methodology</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-slate-900 mt-2">7-Step Architectural Execution Journey</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-sans-body mt-4 md:mt-0 leading-relaxed">
            A seamless, transparent architectural roadmap from raw land discovery to completed structural hand-over.
          </p>
        </div>

        {/* Horizontal Process Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-12">
          {steps.map((st, idx) => {
            const IconComp = st.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={st.number}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl text-left font-mono-tech transition-all cursor-pointer flex flex-col justify-between border ${
                  isActive
                    ? 'bg-blue-900 text-white font-bold border-blue-900 shadow-xl shadow-blue-900/15 scale-105 z-10'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold opacity-90">{st.number}</span>
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[11px] leading-tight block truncate font-semibold">{st.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Card */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-serif-display font-bold text-xl shadow-md">
                {steps[activeStep].number}
              </div>
              <div>
                <span className="text-blue-900 font-mono-tech text-xs tracking-widest font-bold uppercase block">
                  Phase {activeStep + 1} • {steps[activeStep].duration}
                </span>
                <h3 className="font-serif-display text-2xl sm:text-3xl text-slate-900">
                  {steps[activeStep].title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-700 font-sans-body leading-relaxed">
              {steps[activeStep].tagline}
            </p>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono-tech text-blue-900 font-bold uppercase tracking-widest block">Key Deliverables</span>
              <ul className="space-y-2">
                {steps[activeStep].deliverables.map((del, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-sans-body">
                    <CheckCircle2 className="w-4 h-4 text-blue-900 shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-center shadow-md">
            <CurrentIcon className="w-16 h-16 text-blue-900 mx-auto animate-pulse" />
            <h4 className="font-serif-display text-lg text-slate-900 font-bold">Guaranteed Structural Precision</h4>
            <p className="text-xs text-slate-600 font-sans-body leading-relaxed">
              Every phase is backed by PRIAD's BIM Level 2 protocols and zero-tolerance quality control standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
