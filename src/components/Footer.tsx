import React from 'react';
import { PageRoute } from '../types';
import { Compass, Phone, Mail, MapPin, ExternalLink, Shield, ArrowUpRight, CheckCircle, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  onOpenInquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenInquiry }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 font-sans-body border-t border-slate-800 relative overflow-hidden">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      {/* Top Banner CTA */}
      <div className="border-b border-slate-800 py-16 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-blue-300 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold">Commence Your Legacy Project</span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-white mt-2">Ready to transform vision into architectural reality?</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenInquiry()}
              className="bg-white hover:bg-slate-100 text-blue-950 font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-xl cursor-pointer"
            >
              Request Design Consultation
            </button>
            <a
              href="https://wa.me/919876543210?text=Hello%20PRIAD%20Architects%2C%20I%20would%20like%20to%20discuss%20a%20new%20architectural%20project."
              target="_blank"
              rel="noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-white font-mono-tech text-xs uppercase tracking-widest px-6 py-4 rounded-full border border-slate-700 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Instant WhatsApp Chat</span>
              <ArrowUpRight className="w-4 h-4 text-blue-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Col 1: Studio Identity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border border-slate-700 bg-white/10 p-1.5 flex items-center justify-center shadow-sm">
              <img
                src="/assets/priad_logo.png"
                alt="PRIAD ARCHITECTS Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-serif-display text-2xl tracking-[0.25em] font-extrabold text-white">PRIAD</div>
              <div className="text-[10px] font-mono-tech tracking-[0.35em] text-slate-400 uppercase">ARCHITECTS</div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans-body pr-6">
            PRIAD ARCHITECTS is an international luxury architectural and interior design studio dedicated to monolithic structural minimalism, biophilic innovation, high-density master planning, and engineering precision.
          </p>

          <div className="space-y-3 text-xs font-mono-tech text-slate-300">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>PRIAD Design Tower, Suite 800, Financial District Plaza</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>+91 98765 43210 / +1 (800) 774-2300</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>contact@priadarchitects.com</span>
            </div>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono-tech text-blue-300 uppercase tracking-widest font-bold">Architecture Practice</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">Studio Home</button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">Firm History & Leadership</button>
            </li>
            <li>
              <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors cursor-pointer">Full Services Directory</button>
            </li>
            <li>
              <button onClick={() => onNavigate('portfolio')} className="hover:text-white transition-colors cursor-pointer">Selected Works & Projects</button>
            </li>
            <li>
              <button onClick={() => onNavigate('process')} className="hover:text-white transition-colors cursor-pointer">7-Step Design Process</button>
            </li>
            <li>
              <button onClick={() => onNavigate('manifesto')} className="hover:text-white transition-colors cursor-pointer">Design Philosophy Manifesto</button>
            </li>
          </ul>
        </div>

        {/* Col 3: Interactive Experiences */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono-tech text-blue-300 uppercase tracking-widest font-bold">Interactive Labs</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <button onClick={() => onNavigate('floorplan')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span>Vector Floorplan Explorer</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('3d-viewer')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span>3D Building Layers Model</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('before-after')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span>Before vs After Renovation</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('materials')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span>Material Moodboard Studio</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span>AI Architectural Estimator</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: SEO & Technical Resources */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono-tech text-blue-300 uppercase tracking-widest font-bold">SEO & Portal</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <button onClick={() => onNavigate('seo-hub')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <span>Technical SEO & Schema</span>
              </button>
            </li>
            <li>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <span>XML Sitemap</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <span>Robots.txt</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors cursor-pointer">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors cursor-pointer">
                Architectural Whitepapers
              </button>
            </li>
            <li className="pt-2 border-t border-slate-800/80">
              <button 
                onClick={() => onNavigate('admin')} 
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-mono-tech text-xs cursor-pointer group"
                title="Restricted Administrator Portal"
              >
                <Lock className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <span>Admin Portal</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ELEVATED NEXTUREX DEVELOPED CREDIT BANNER (MANDATORY REQUIREMENT) */}
      <div className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono-tech">
            <span>© {new Date().getFullYear()} PRIAD ARCHITECTS. All rights reserved.</span>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
            </button>
          </div>

          {/* Prominently Featured NextureX Credit */}
          <div className="flex items-center gap-3 bg-blue-900/30 px-5 py-2.5 rounded-full border border-blue-800/50">
            <span className="text-xs font-mono-tech text-slate-300">Digital Experience Engineered &</span>
            <a
              href="https://nexturex.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-1.5 font-serif-display font-bold text-blue-300 hover:text-white transition-colors cursor-pointer text-sm"
            >
              <span>Developed by NextureX</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-300 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
