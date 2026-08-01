import React, { useState } from 'react';
import { AIAnalysisResult } from '../types';
import { Sparkles, Calculator, Cpu, Clock, CheckCircle2, ArrowRight, RefreshCw, Layers } from 'lucide-react';

export const AIDesignAssistant: React.FC = () => {
  const [projectType, setProjectType] = useState('Ultra-Luxury Villa');
  const [areaSqFt, setAreaSqFt] = useState(6500);
  const [style, setStyle] = useState('Modern Brutalist Minimalism');
  const [budgetLevel, setBudgetLevel] = useState('Ultra-Luxury Tier');
  const [userPrompt, setUserPrompt] = useState('Looking for cantilevered structural concrete slabs, double-height glazing, and seamless infinity water integration.');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const handleGenerateAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/ai-design-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          areaSqFt,
          architecturalStyle: style,
          budgetLevel,
          userPrompt
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else if (data.fallback) {
        setAnalysis(data.fallback);
      }
    } catch (err) {
      console.error('AI Estimator call error:', err);
      // Fallback structured result
      setAnalysis({
        conceptTitle: 'Monolithic Cantilever Residence',
        designPhilosophy: 'Harmonizing raw structural concrete with double-height structural glass curtains to merge natural topography with refined minimalism.',
        recommendedMaterials: [
          'Board-formed architectural concrete with hydrophobic sealant',
          'Thermally broken triple-glazed low-E ultra-clear glass',
          'Charred Japanese Shou Sugi Ban Yakisugi cedar paneling',
          'Honed Volakas marble slabs with integrated brass reveals'
        ],
        spatialHighlights: [
          'Floating cantilevered upper storey with 14m column-free span',
          'Sunken amphitheater courtyard with infinity water reflection basin',
          'Subterranean climate-controlled subterranean gallery'
        ],
        sustainabilityFeatures: [
          'Passive solar orientation with deep roof overhangs',
          'Rainwater harvesting integrated into foundational retention vaults'
        ],
        estimatedTimelineMonths: '14 - 18 Months',
        keyArchitecturalInsight: 'By raising the primary living pavilion above the slope, we capture unblocked panoramic views while optimizing cross-ventilation flow.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-50 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-900 animate-pulse" />
              <span>Gemini AI Architectural Engine</span>
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-slate-900 mt-2">
              AI Concept Assessor & Estimator
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-sans-body mt-4 md:mt-0 leading-relaxed">
            Configure your project parameters to receive an instant bespoke architectural concept, material recommendations, structural insights, and timeline breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Panel */}
          <form
            onSubmit={handleGenerateAnalysis}
            className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6"
          >
            <div>
              <label className="text-xs font-mono-tech text-blue-900 uppercase tracking-wider font-bold block mb-2">
                Project Category
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono-tech text-slate-900 focus:outline-none focus:border-blue-900"
              >
                <option value="Ultra-Luxury Villa">Ultra-Luxury Villa / Estate</option>
                <option value="Commercial Tower & HQ">Commercial High-Rise & HQ</option>
                <option value="Penthouse Interior Makeover">Penthouse Interior Makeover</option>
                <option value="Institutional & Cultural Landmark">Institutional & Cultural Landmark</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono-tech text-blue-900 font-bold uppercase tracking-wider mb-2">
                <span>Footprint Area:</span>
                <span className="text-slate-900 font-bold">{areaSqFt.toLocaleString()} SQ FT</span>
              </div>
              <input
                type="range"
                min="1500"
                max="50000"
                step="500"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-mono-tech text-blue-900 uppercase tracking-wider font-bold block mb-2">
                Architectural Style Preference
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono-tech text-slate-900 focus:outline-none focus:border-blue-900"
              >
                <option value="Modern Brutalist Minimalism">Modern Brutalist Minimalism</option>
                <option value="Parametric High-Tech Organic">Parametric High-Tech Organic</option>
                <option value="Sculptural Luxury Zen">Sculptural Luxury Zen</option>
                <option value="Biophilic Glass Architecture">Biophilic Glass Architecture</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono-tech text-blue-900 uppercase tracking-wider font-bold block mb-2">
                Custom Vision Notes
              </label>
              <textarea
                rows={3}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Mention specific desires (e.g., cantilever pool, double-height atrium, green courtyard)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans-body text-slate-900 focus:outline-none focus:border-blue-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Concept...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Architectural Assessment</span>
                </>
              )}
            </button>
          </form>

          {/* Right AI Assessment Results Panel */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl min-h-[480px]">
            {analysis ? (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <span className="text-blue-900 font-mono-tech text-[10px] uppercase tracking-widest font-bold block mb-1">
                    PRIAD AI Studio Concept #8402
                  </span>
                  <h3 className="font-serif-display text-2xl sm:text-3xl text-slate-900">
                    {analysis.conceptTitle}
                  </h3>
                  <div className="mt-2 text-xs font-mono-tech text-blue-900 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 inline-flex items-center gap-2 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-blue-900" />
                    <span>Estimated Execution Timeline: <strong>{analysis.estimatedTimelineMonths}</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-mono-tech text-blue-900 uppercase tracking-widest font-bold block mb-1">
                    Design Strategy & Volumetric Philosophy
                  </span>
                  <p className="text-xs text-slate-700 font-sans-body leading-relaxed">
                    {analysis.designPhilosophy}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono-tech text-blue-900 uppercase tracking-wider font-bold block">
                      Recommended Material Palette
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-sans-body">
                      {analysis.recommendedMaterials?.map((m, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono-tech text-blue-900 uppercase tracking-wider font-bold block">
                      Spatial & Architectural Highlights
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-sans-body">
                      {analysis.spatialHighlights?.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-xs font-sans-body text-slate-700">
                  <span className="text-blue-900 font-mono-tech font-bold block mb-1">Principal Architectural Insight:</span>
                  <p className="italic text-blue-950 bg-blue-50 p-4 rounded-2xl border border-blue-200 leading-relaxed font-semibold">
                    "{analysis.keyArchitecturalInsight}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-500 space-y-4">
                <Cpu className="w-12 h-12 text-blue-900 animate-bounce" />
                <h4 className="font-serif-display text-xl text-slate-900">Configure Your Project Parameters</h4>
                <p className="text-xs max-w-sm font-sans-body">
                  Click 'Run Architectural Assessment' to generate an instant AI architectural concept report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
