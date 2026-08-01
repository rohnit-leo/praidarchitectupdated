import React, { useEffect, useRef } from 'react';
import { PageRoute } from '../types';
import { ChevronRight, Cpu, MapPin, Activity } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onNavigate: (route: PageRoute) => void;
  onOpenInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenInquiry }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro entrance timeline
      const tl = gsap.timeline();
      tl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.7'
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          metricsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        );

      // ScrollTrigger Parallax Effect
      if (heroRef.current && bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to(titleRef.current, {
          yPercent: -15,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen bg-white flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none border-b border-slate-200">
      {/* Parallax Background Media Layer */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-85">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90"
            alt="PRIAD Monolith Villa Architectural Hero"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-white/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
        </div>
      </div>

      {/* Hero Header Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-10">
        <div className="max-w-4xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 shadow-md border border-slate-200 text-blue-900 font-mono-tech text-[11px] uppercase tracking-[0.25em] mb-6 font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Award-Winning Architectural Practice</span>
          </div>

          {/* Huge Immersive Display Title */}
          <h1 ref={titleRef} className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.92] mb-8">
            SCULPTING <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-700">
              SPACE.
            </span>{' '}
            DEFINING <br />
            <span className="font-cormorant italic text-slate-600 font-light">
              ERAS.
            </span>
          </h1>

          <p ref={subtitleRef} className="text-sm sm:text-base md:text-lg text-slate-700 font-sans-body max-w-2xl leading-relaxed mb-10 font-normal">
            PRIAD ARCHITECTS merges structural daring, parametric engineering, and luxury interior craftsmanship to create timeless architectural landmarks across the globe.
          </p>

          {/* Action CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('portfolio')}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-blue-900/20 hover:scale-105 flex items-center gap-3 cursor-pointer"
              data-cursor="View Projects"
            >
              <span>Explore Selected Works</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('3d-viewer')}
              className="bg-white/90 hover:bg-white text-slate-900 font-mono-tech text-xs font-bold uppercase tracking-[0.2em] px-6 py-4 rounded-full border border-slate-300 shadow-sm flex items-center gap-2.5 cursor-pointer transition-all hover:border-blue-900"
              data-cursor="3D Model"
            >
              <Cpu className="w-4 h-4 text-blue-900" />
              <span>Launch 3D Building Inspector</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Presence & Key Metrics */}
      <div ref={metricsRef} className="relative z-10 max-w-7xl mx-auto w-full pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Active Global Projects Element */}
          <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 shadow-sm w-full max-w-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <span className="text-blue-900 font-mono-tech text-[10px] uppercase font-bold tracking-widest block mb-0.5">
                Current Studio Status
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-sans-body">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>12 Projects in active development</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left w-full md:w-auto">
            <div>
              <div className="font-serif-display text-xl sm:text-2xl font-bold text-blue-900">140+</div>
              <div className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest font-semibold">Delivered Landmark Projects</div>
            </div>
            <div>
              <div className="font-serif-display text-xl sm:text-2xl font-bold text-slate-900">4.2M+</div>
              <div className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest font-semibold">Sq Ft Designed & Built</div>
            </div>
            <div>
              <div className="font-serif-display text-xl sm:text-2xl font-bold text-blue-900">28</div>
              <div className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest font-semibold">Global Architecture Awards</div>
            </div>
            <div>
              <div className="font-serif-display text-xl sm:text-2xl font-bold text-slate-900">100%</div>
              <div className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest font-semibold">LEED / MEP Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
