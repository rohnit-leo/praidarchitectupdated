import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/projects';
import { Grid, Eye, Maximize2, CheckCircle2, ChevronRight, Info, Layers } from 'lucide-react';

export const FloorplanViewer: React.FC = () => {
  const project = PROJECTS_DATA[0]; // Monolith Villa
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);
  const activeLevel = project.floorPlanLevels[selectedLevelIndex] || project.floorPlanLevels[0];
  const [activeHotspot, setActiveHotspot] = useState<any>(activeLevel.hotspots[0]);

  return (
    <section className="py-24 bg-white text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold">Architectural Precision</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-slate-900 mt-2">Interactive Floor Plan Explorer</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-sans-body mt-4 md:mt-0 leading-relaxed">
            Examine vector blueprint layouts, room dimensions, spatial flows, and click hotspots to reveal interior renders.
          </p>
        </div>

        {/* Floor Plan Explorer Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Blueprint Display */}
          <div className="lg:col-span-2 bg-slate-50 rounded-3xl border border-slate-200 p-6 relative bg-blueprint-grid min-h-[500px] flex flex-col justify-between overflow-hidden shadow-lg">
            {/* Top Bar Level Selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-blue-900" />
                <span className="text-xs font-mono-tech text-blue-900 uppercase tracking-wider font-bold">{activeLevel.levelName}</span>
              </div>

              <div className="flex items-center gap-2">
                {project.floorPlanLevels.map((lvl, idx) => (
                  <button
                    key={lvl.levelName}
                    onClick={() => {
                      setSelectedLevelIndex(idx);
                      setActiveHotspot(lvl.hotspots[0]);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-tech transition-all cursor-pointer ${
                      selectedLevelIndex === idx
                        ? 'bg-blue-900 text-white font-bold shadow-md'
                        : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {idx === 0 ? 'L01' : 'L02'}
                  </button>
                ))}
              </div>
            </div>

            {/* Blueprint Vector Graphic Area with Hotspots */}
            <div className="relative my-6 w-full h-[380px] bg-slate-100 rounded-2xl border border-blue-900/20 overflow-hidden flex items-center justify-center">
              <img
                src={activeLevel.blueprintUrl}
                alt={activeLevel.levelName}
                className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                referrerPolicy="no-referrer"
              />

              {/* Vector Blueprint Lines */}
              <div className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center">
                <div className="w-full h-full border-2 border-dashed border-blue-900/30 rounded-xl flex items-center justify-center relative">
                  <span className="text-[10px] font-mono-tech text-blue-900/70 font-bold uppercase absolute top-2 left-2">N 0°00'00" E</span>
                  <span className="text-[10px] font-mono-tech text-blue-900/70 font-bold uppercase absolute bottom-2 right-2">SCALE 1:100 METRIC</span>
                </div>
              </div>

              {/* Interactive Hotspot Buttons */}
              {activeLevel.hotspots.map((hs) => (
                <button
                  key={hs.roomName}
                  onClick={() => setActiveHotspot(hs)}
                  style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeHotspot?.roomName === hs.roomName
                      ? 'bg-blue-900 text-white scale-125 ring-4 ring-blue-900/30 shadow-xl'
                      : 'bg-white text-blue-900 border border-slate-300 hover:bg-blue-900 hover:text-white hover:scale-110 shadow-md'
                  }`}
                  title={`Click to view ${hs.roomName}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Bottom Status */}
            <div className="flex justify-between items-center text-[10px] font-mono-tech text-slate-600 font-semibold pt-3 border-t border-slate-200">
              <span>CLICK MAP HOTSPOTS TO INSPECT INTERIOR RENDERS</span>
              <span>TOTAL LEVEL AREA: 6,850 SQ FT</span>
            </div>
          </div>

          {/* Right Hotspot Room Detail Card */}
          <div className="lg:col-span-1 bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-6 shadow-md">
            <div>
              <span className="text-blue-900 font-mono-tech text-[10px] uppercase tracking-widest font-bold block mb-1">
                Room Inspector
              </span>
              <h3 className="font-serif-display text-2xl text-slate-900">
                {activeHotspot?.roomName || 'Select a Room'}
              </h3>
              <div className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-900 font-semibold border border-blue-200 rounded-full text-xs font-mono-tech">
                Area: {activeHotspot?.size}
              </div>
            </div>

            {/* Room Render Image */}
            {activeHotspot?.imageUrl && (
              <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={activeHotspot.imageUrl}
                  alt={activeHotspot.roomName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono-tech text-slate-800 uppercase bg-white/90 backdrop-blur-md px-2 py-0.5 rounded shadow border border-slate-200 font-bold">
                  Photorealistic Render
                </span>
              </div>
            )}

            <p className="text-xs text-slate-600 font-sans-body leading-relaxed">
              {activeHotspot?.description}
            </p>

            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs font-mono-tech text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Ceiling Clearance:</span>
                <span className="font-semibold">24 FT Clear Height</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Glass Enclosure:</span>
                <span className="font-semibold">Triple Glazed Low-E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Flooring Specification:</span>
                <span className="font-semibold">Volakas White Marble</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
