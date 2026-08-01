import React, { useState, useEffect, useRef } from 'react';
import { SERVICES_DATA } from '../data/services';
import { ServiceItem } from '../types';
import { Compass, Layout, Eye, Cpu, CheckCircle2, Sparkles, HelpCircle, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onOpenInquiry: (serviceTitle?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenInquiry }) => {
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES_DATA[0].id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeService = SERVICES_DATA.find((s) => s.id === activeServiceId) || SERVICES_DATA[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header scroll trigger entrance
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Tabs parallax staggering
      if (tabsRef.current) {
        gsap.fromTo(
          tabsRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: tabsRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Panel parallax depth effect on scroll
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { y: 30, opacity: 0.8 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panelRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold">End-to-End Capabilities</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-slate-900 mt-2">Services & Engineering Directory</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-sans-body mt-4 md:mt-0 leading-relaxed">
            From concept master planning and 3D VR walkthroughs to complex MEP coordination and site supervision.
          </p>
        </div>

        {/* Services Navigation Tabs */}
        <div ref={tabsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {SERVICES_DATA.map((srv) => {
            const isActive = activeServiceId === srv.id;
            return (
              <button
                key={srv.id}
                onClick={() => {
                  setActiveServiceId(srv.id);
                  setOpenFaqIndex(0);
                }}
                className={`p-4 rounded-2xl text-left font-mono-tech transition-all cursor-pointer flex flex-col justify-between border ${
                  isActive
                    ? 'bg-blue-900 text-white font-bold border-blue-900 shadow-xl shadow-blue-900/20 scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200 shadow-sm'
                }`}
              >
                <span className={`text-[10px] uppercase tracking-widest block mb-1 ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>{srv.category}</span>
                <span className="text-xs font-semibold leading-tight line-clamp-2">{srv.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Service Detail Panel */}
        <div ref={panelRef} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          {/* Left Column info */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-blue-900 font-mono-tech text-xs uppercase tracking-widest font-bold block mb-1">
                {activeService.category} Practice
              </span>
              <h3 className="font-serif-display text-3xl text-slate-900">{activeService.title}</h3>
              <p className="text-xs text-blue-900 font-mono-tech mt-2 italic font-semibold">
                "{activeService.tagline}"
              </p>
            </div>

            <p className="text-xs text-slate-600 font-sans-body leading-relaxed">
              {activeService.description}
            </p>

            {/* Deliverables Checklist */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono-tech text-blue-900 font-bold uppercase tracking-widest block">
                Primary Deliverables
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800 font-sans-body">
                {activeService.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Specs */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono-tech text-blue-900 font-bold uppercase tracking-widest block">
                Engineering & BIM Benchmarks
              </span>
              <div className="flex flex-wrap gap-2">
                {activeService.technicalSpecs.map((spec, i) => (
                  <span key={i} className="text-[10px] font-mono-tech bg-blue-50 text-blue-900 font-semibold px-3 py-1 rounded-full border border-blue-200">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA button */}
            <div className="pt-4">
              <button
                onClick={() => onOpenInquiry(activeService.title)}
                className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
              >
                <Phone className="w-4 h-4" />
                <span>Inquire About {activeService.title}</span>
              </button>
            </div>
          </div>

          {/* Right Column Image & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <img
                src={activeService.sampleImage}
                alt={activeService.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Service FAQs Accordion */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-mono-tech text-blue-900 font-bold uppercase tracking-widest flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>Service Frequently Asked Questions</span>
              </h4>

              <div className="space-y-2 pt-2">
                {activeService.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-3 text-xs font-serif-display font-semibold text-slate-900 flex justify-between items-center cursor-pointer hover:text-blue-900"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-blue-900 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 text-[11px] text-slate-600 font-sans-body border-t border-slate-100 pt-2 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
