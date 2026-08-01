import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/projects';
import { Sparkles, ArrowLeftRight, TrendingUp, Sun, ShieldCheck } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const project = PROJECTS_DATA[0]; // Monolith Villa

  return (
    <section className="py-24 bg-slate-50 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold">Building Transformation</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-slate-900 mt-2">Before vs After Renovation Slider</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-sans-body mt-4 md:mt-0 leading-relaxed">
            Drag the divider to experience how PRIAD transforms aging structural bones into ultra-luxury modern architectural landmarks.
          </p>
        </div>

        {/* Interactive Comparison Slider Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 relative h-[480px] sm:h-[540px] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-2xl select-none">
            {/* After Image (Background) */}
            <img
              src={project.afterImage}
              alt="After Architecture Transformation"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 right-6 bg-blue-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-blue-700 text-white font-mono-tech text-xs uppercase tracking-wider font-bold shadow">
              After: PRIAD Redesign
            </div>

            {/* Before Image (Clipped Foreground) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={project.beforeImage}
                alt="Before Renovation"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-300 text-slate-900 font-mono-tech text-xs uppercase tracking-wider font-bold shadow">
                Before: Legacy Structure
              </div>
            </div>

            {/* Drag Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-blue-900 cursor-ew-resize z-20 flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white border-2 border-white flex items-center justify-center shadow-2xl scale-110">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
            </div>

            {/* Invisible Range Input Slider overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>

          {/* Right Metrics Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
              <span className="text-blue-900 font-mono-tech text-[10px] uppercase tracking-widest font-bold block">
                Impact Performance Metrics
              </span>
              <h3 className="font-serif-display text-2xl text-slate-900">
                Architectural Upgrade Metrics
              </h3>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/10 text-blue-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-serif-display text-xl text-blue-900 font-bold">+280%</div>
                    <div className="text-[11px] font-mono-tech text-slate-600 uppercase font-semibold">Natural Daylight Autonomy</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/10 text-blue-900 flex items-center justify-center shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-serif-display text-xl text-blue-900 font-bold">-45%</div>
                    <div className="text-[11px] font-mono-tech text-slate-600 uppercase font-semibold">HVAC Thermal Gain Load</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/10 text-blue-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-serif-display text-xl text-blue-900 font-bold">+1,850 SQ FT</div>
                    <div className="text-[11px] font-mono-tech text-slate-600 uppercase font-semibold">Usable Cantilever Floor Space</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
