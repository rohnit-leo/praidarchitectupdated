import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Compass, Menu, X, Search, Phone, Layers, Sparkles, FileText, ChevronRight, Calculator, Grid, Cpu, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onOpenInquiry: (projectType?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeRoute, onNavigate, onOpenInquiry }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; route: PageRoute }[] = [
    { label: 'Studio', route: 'home' },
    { label: 'About', route: 'about' },
    { label: 'Services', route: 'services' },
    { label: 'Portfolio', route: 'portfolio' },
    { label: 'Process', route: 'process' },
    { label: 'Journal', route: 'blog' },
    { label: 'Contact', route: 'contact' },
  ];

  const studioExperiences: { label: string; route: PageRoute; icon: any; desc: string }[] = [
    { label: 'Interactive Floorplan Explorer', route: 'floorplan', icon: Grid, desc: 'Vector blueprint viewer with room hotspots' },
    { label: '3D Building Layers Inspector', route: '3d-viewer', icon: Cpu, desc: 'Interactive 3D structural model analysis' },
    { label: 'Before vs After Slider', route: 'before-after', icon: Sparkles, desc: 'Drag-to-compare renovation transformations' },
    { label: 'Material Inspiration Library', route: 'materials', icon: Layers, desc: 'Tactile physical specs & moodboard builder' },
    { label: 'AI Design & Cost Estimator', route: 'calculator', icon: Calculator, desc: 'Gemini-powered architectural assessment' },
    { label: 'Design Philosophy Manifesto', route: 'manifesto', icon: FileText, desc: 'Editorial vision & structural tenets' },
    { label: 'Technical SEO Portal', route: 'seo-hub', icon: Compass, desc: 'Schema markup, Sitemap & Crawlability' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 py-3 shadow-sm'
            : 'bg-gradient-to-b from-white via-white/90 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Mark with Logo Image */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 group text-left cursor-pointer"
            data-cursor="PRIAD Home"
          >
            <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center bg-white shadow-sm group-hover:border-blue-900 group-hover:scale-105 transition-all duration-300 overflow-hidden p-1">
              <img
                src="https://kwrv4maomvrojc0c.public.blob.vercel-storage.com/IMG_3159.PNG"
                alt="PRIAD ARCHITECTS Logo Symbol"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-serif-display text-xl tracking-[0.2em] font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors">
                PRIAD
              </div>
              <div className="text-[9px] font-mono-tech tracking-[0.35em] text-slate-500 uppercase">
                ARCHITECTS
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`text-xs font-mono-tech uppercase tracking-[0.18em] transition-all duration-300 py-1 border-b-2 cursor-pointer ${
                  activeRoute === item.route
                    ? 'border-blue-900 text-blue-900 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mega Menu Toggle */}
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`flex items-center gap-1.5 text-xs font-mono-tech uppercase tracking-[0.18em] px-3.5 py-1.5 border rounded-full transition-all cursor-pointer ${
                megaMenuOpen
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-900 hover:text-blue-900'
              }`}
              data-cursor="Studio Tools"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Studio Labs</span>
            </button>
          </nav>

          {/* Right Action Group */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-600 hover:text-blue-900 transition-colors border border-slate-200 hover:border-blue-900 rounded-full bg-slate-100/80 cursor-pointer shadow-sm"
              title="Search Portfolio & Insights"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Book Consultation CTA */}
            <button
              onClick={() => onOpenInquiry()}
              className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-blue-900/15 hover:scale-105 cursor-pointer"
              data-cursor="Inquire Now"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Book Consultation</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-md bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mega Menu Overlay */}
      {megaMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-2xl pt-24 pb-12 overflow-y-auto border-b border-slate-200 transition-all animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/95 rounded-3xl p-8 border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-center pb-6 border-b border-slate-200 mb-8">
              <div>
                <span className="text-blue-900 font-mono-tech text-xs tracking-widest uppercase font-bold">Interactive Studio Suite</span>
                <h3 className="font-serif-display text-2xl text-slate-900 mt-1">Specialized Architectural Tools</h3>
              </div>
              <button
                onClick={() => setMegaMenuOpen(false)}
                className="text-slate-500 hover:text-slate-900 p-2 border border-slate-200 rounded-full cursor-pointer hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studioExperiences.map((exp) => {
                const IconComponent = exp.icon;
                return (
                  <button
                    key={exp.route}
                    onClick={() => {
                      onNavigate(exp.route);
                      setMegaMenuOpen(false);
                    }}
                    className="p-6 rounded-2xl bg-slate-50 hover:bg-white group text-left transition-all duration-300 border border-slate-200/80 hover:border-blue-900 hover:shadow-lg flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-900/10 text-blue-900 flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif-display text-lg text-slate-900 group-hover:text-blue-900 transition-colors mb-2">
                        {exp.label}
                      </h4>
                      <p className="text-xs text-slate-600 font-sans-body leading-relaxed">
                        {exp.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-center text-xs font-mono-tech text-blue-900 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Launch Experience</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xl flex items-start justify-center pt-24 px-4 animate-fadeIn">
          <div className="max-w-2xl w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono-tech text-blue-900 uppercase tracking-widest font-bold">Global Studio Search</span>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative mb-6">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search villas, commercial towers, materials, or articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-blue-900 font-sans-body"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-wider">Quick Suggestions:</span>
              <div className="flex flex-wrap gap-2 pt-2">
                {['The Monolith Villa', 'Cantilever Engineering', '3D Floor Plan', 'Titanium Travertine', 'MEP Coordination'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      onNavigate('portfolio');
                      setSearchOpen(false);
                    }}
                    className="text-xs font-mono-tech bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white pt-24 px-6 pb-8 overflow-y-auto lg:hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[10px] font-mono-tech uppercase tracking-[0.3em] text-blue-900 font-bold mb-2">Navigation Menu</div>
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => {
                  onNavigate(item.route);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-serif-display text-2xl py-2 border-b border-slate-100 cursor-pointer ${
                  activeRoute === item.route ? 'text-blue-900 font-bold' : 'text-slate-800 hover:text-blue-900'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-6">
              <div className="text-[10px] font-mono-tech uppercase tracking-[0.3em] text-blue-900 font-bold mb-4">Interactive Tools</div>
              <div className="grid grid-cols-1 gap-2">
                {studioExperiences.slice(0, 4).map((exp) => (
                  <button
                    key={exp.route}
                    onClick={() => {
                      onNavigate(exp.route);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-800 text-xs font-mono-tech border border-slate-200 cursor-pointer"
                  >
                    <span>{exp.label}</span>
                    <ChevronRight className="w-4 h-4 text-blue-900" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 space-y-3">
            <button
              onClick={() => {
                onOpenInquiry();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl cursor-pointer shadow-md"
            >
              Book Architectural Consultation
            </button>
          </div>
        </div>
      )}
    </>
  );
};
