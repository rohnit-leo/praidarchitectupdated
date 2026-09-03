import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Phone, Mail, MapPin, Instagram, Linkedin, Facebook, Building2, Eye, Compass, Home, CheckCircle2, Lock } from 'lucide-react';
import { CustomCursor } from './components/CustomCursor';
import { SEOHead } from './components/SEOHead';
import { VRViewer } from './components/VRViewer';
import { ServicesVisual } from './components/ServicesVisual';
import { StatsCounter } from './components/StatsCounter';
import { EnquiryModal } from './components/EnquiryModal';
import { HeroCarousel } from './components/HeroCarousel';
import { StudioCareers } from './components/StudioCareers';
import { AdminPortal } from './components/AdminPortal';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { subscribeToProjects } from './lib/firebase';
import { Project } from './types';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  // Routing helper for dedicated /admin URL (supports path, query param, and hash routing)
  const checkIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path === '/admin' || 
      path === '/admin/' || 
      path.startsWith('/admin') ||
      path.includes('admin.html') ||
      search.includes('admin=true') ||
      search.includes('page=admin') ||
      search.includes('view=admin') ||
      hash === '#admin' ||
      hash === '#/admin' ||
      hash.includes('admin')
    );
  };

  // Routing state - initialized from direct URL
  const [activePage, setActivePage] = useState<'home' | 'project-detail' | 'admin'>(() => {
    if (checkIsAdminRoute()) return 'admin';
    return 'home';
  });
  const [selectedProjectData, setSelectedProjectData] = useState<Project | null>(null);

  // Real-time Firestore projects
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subscribe in real-time to Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToProjects((updatedProjects) => {
      setProjectsList(updatedProjects);
      setLoadingProjects(false);
      // Keep active detailed page synchronized if open
      if (selectedProjectData) {
        const found = updatedProjects.find((p) => p.id === selectedProjectData.id);
        if (found) {
          setSelectedProjectData(found);
        }
      }
    });

    return () => unsubscribe();
  }, [selectedProjectData?.id]);

  // Deep-linking support for SEO & direct URL indexing (/admin and ?project=<id>)
  useEffect(() => {
    const handleRouteSync = () => {
      if (checkIsAdminRoute()) {
        setActivePage('admin');
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('project');
      if (projectId && projectsList.length > 0) {
        const found = projectsList.find((p) => p.id === projectId);
        if (found) {
          setSelectedProjectData(found);
          setActivePage('project-detail');
          return;
        }
      }

      // Default home
      if (window.location.pathname === '/' && !projectId) {
        setActivePage('home');
        setSelectedProjectData(null);
      }
    };

    handleRouteSync();
    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, [projectsList]);

  const handleOpenProject = (project: Project) => {
    setSelectedProjectData(project);
    setActivePage('project-detail');
    window.history.pushState({}, '', `?project=${encodeURIComponent(project.id)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setActivePage('admin');
    window.history.pushState({}, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedProjectData(null);
    setActivePage('home');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = ['Home', 'Services', '360 VR', 'Projects', 'Studio', 'About'];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        let targetId = id.toLowerCase();
        if (id === '360 VR') targetId = 'vr';
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    let targetId = id.toLowerCase();
    if (id === '360 VR') targetId = 'vr';
    
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If viewing the Admin Portal
  if (activePage === 'admin') {
    return (
      <div className="bg-slate-950 min-h-screen text-slate-100 font-sans-body">
        <CustomCursor />
        <AdminPortal
          projects={projectsList}
          onNavigate={(route) => {
            if (route === 'home' || route === 'portfolio') {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (route === 'project-detail') {
              setActivePage('project-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onSelectProject={(proj) => setSelectedProjectData(proj)}
          onExitAdmin={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  // If viewing a Dedicated Project Detail Page
  if (activePage === 'project-detail' && selectedProjectData) {
    return (
      <div className="bg-white min-h-screen text-slate-900 font-sans-body">
        <CustomCursor />
        <SEOHead activeRoute="project-detail" project={selectedProjectData} />
        <ProjectDetailPage
          project={selectedProjectData}
          onBack={handleBackToHome}
          onOpenInquiry={() => setEnquiryOpen(true)}
        />
        <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#fafafa] text-slate-800 font-sans-body relative selection:bg-[#3b5c36] selection:text-white pb-16 md:pb-0">
        <CustomCursor />
      <SEOHead activeRoute="home" />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/assets/priad_logo.png"
                alt="PRIAD ARCHITECTS Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col items-start justify-center">
              <div className="font-serif-display text-base tracking-[0.15em] font-bold uppercase leading-none text-[#3b5c36]">
                PRIAD ARCHITECTS
              </div>
              <div className="text-[12px] font-cormorant italic text-[#1c356b] mt-1 leading-none">
                Building legacy.
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-xs font-montserrat uppercase tracking-widest hover:text-[#3b5c36] transition-colors cursor-pointer ${isScrolled ? 'text-slate-600' : 'text-slate-800'}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => setEnquiryOpen(true)}
              className="bg-[#3b5c36] hover:bg-[#2c4728] text-white font-montserrat text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors shadow-lg shadow-[#3b5c36]/20 cursor-pointer"
            >
              Get in Touch
            </button>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-800 p-2 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white pt-24 px-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-xl font-serif-display text-left text-slate-800 hover:text-[#3b5c36] cursor-pointer border-b border-slate-100 pb-4"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => { setEnquiryOpen(true); setMobileMenuOpen(false); }}
              className="text-xl font-serif-display text-left text-[#3b5c36] cursor-pointer pt-4"
            >
              Enquire Now
            </button>
          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <HeroCarousel onEnquire={() => setEnquiryOpen(true)} />

        {/* 360 VR Section */}
        <section id="vr" className="py-24 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-[#3b5c36] font-montserrat text-xs tracking-widest uppercase mb-4 block">Immersive Experience</span>
                <h2 className="font-serif-display text-xl md:text-3xl text-slate-900">360° Virtual Tours</h2>
              </div>
              <p className="text-slate-600 font-sans-body text-xs max-w-md">
                Step inside our designs before they are built. Use your mouse or touch to look around the virtual space and experience the architecture in true 360 degrees.
              </p>
            </div>
            
            <div className="w-full h-[60vh] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner relative">
              <VRViewer />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 bg-white border-y border-slate-100 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <StatsCounter end={2} suffix="+" />
              <div className="text-slate-500 font-montserrat text-[10px] uppercase tracking-widest font-bold">Years Experience</div>
            </div>
            <div>
              <StatsCounter end={10} suffix="+" />
              <div className="text-slate-500 font-montserrat text-[10px] uppercase tracking-widest font-bold">Projects Completed</div>
            </div>
            <div>
              <StatsCounter end={100} suffix="%" />
              <div className="text-slate-500 font-montserrat text-[10px] uppercase tracking-widest font-bold">Client Satisfaction</div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#3b5c36] font-montserrat text-xs tracking-widest uppercase mb-4 block">Our Expertise</span>
              <h2 className="font-serif-display text-xl md:text-3xl text-slate-900">Services</h2>
            </div>
            <ServicesVisual />
          </div>
        </section>

        {/* Projects / Portfolio Section with Real-Time Firebase Sync */}
        <section id="projects" className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#3b5c36] font-montserrat text-xs tracking-widest uppercase mb-4 block">Selected Works</span>
              <h2 className="font-serif-display text-xl md:text-3xl text-slate-900">Portfolio</h2>
              <p className="text-xs text-slate-500 font-sans-body max-w-md mx-auto mt-2">
                Curated portfolio managed live via secure Firebase database. Click any project to open its dedicated architectural showcase page.
              </p>
            </div>

            {loadingProjects ? (
              <div className="text-center py-16 text-slate-500 font-montserrat text-xs flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3b5c36] animate-ping" />
                <span>Loading live architectural portfolio...</span>
              </div>
            ) : projectsList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
                <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-serif-display text-slate-700">No projects currently published.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projectsList.map((project) => (
                  <button 
                    key={project.id}
                    onClick={() => handleOpenProject(project)}
                    className="group text-left cursor-pointer relative overflow-hidden rounded-2xl block w-full h-[400px] shadow-sm hover:shadow-xl transition-shadow duration-500 bg-white"
                  >
                    <img 
                      src={project.heroImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end p-6">
                      <div className="text-[10px] font-montserrat uppercase tracking-wider text-[#a8d3a0] mb-1 font-bold">
                        {project.category} • {project.year}
                      </div>
                      <h3 className="font-serif-display text-xl text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-1 mb-3">
                        {project.location} {project.areaSqFt ? `• ${project.areaSqFt.toLocaleString()} SQ FT` : ''}
                      </p>
                      <div className="flex items-center gap-2 text-[#a8d3a0] opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="font-montserrat text-[10px] uppercase tracking-wider font-bold">Inspect Showcase Page</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Studio Section */}
        <StudioCareers />

        {/* Why Choose Us */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#3b5c36] font-montserrat text-xs tracking-widest uppercase mb-4 block">Advantage</span>
              <h2 className="font-serif-display text-xl md:text-3xl text-slate-900">Why Choose Us</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Creative & Customized Design', desc: 'Every project is uniquely designed to reflect your lifestyle, brand, and aspirations.' },
                { title: 'End-to-End Solutions', desc: 'From concept development and planning to detailed drawings and execution support, we provide comprehensive design services under one roof.' },
                { title: 'Quality & Precision', desc: 'We focus on accuracy, quality materials, and practical solutions that ensure long-lasting value.' },
                { title: 'Transparent Communication', desc: 'We maintain clear communication throughout every stage of the project, ensuring confidence and peace of mind.' },
                { title: 'Modern Technology', desc: 'Using advanced design tools and realistic 3D visualization, we help clients experience their spaces before construction begins.' },
                { title: 'Client-First Approach', desc: 'Your vision is at the heart of every decision we make, resulting in spaces that are both functional and inspiring.' }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b5c36]/10 flex items-center justify-center text-[#3b5c36]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-display text-sm text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 font-sans-body text-xs leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About / Vision / Mission */}
        <section id="about" className="py-32 px-6 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#3b5c36] font-montserrat text-xs tracking-widest uppercase mb-4 block">About Us</span>
              <h2 className="font-serif-display text-xl md:text-3xl text-slate-900">Designing Spaces.<br/>Building Trust.<br/>Creating Timeless Experiences.</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 mt-20">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="font-serif-display text-xl text-[#1c356b] mb-6 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-[#3b5c36]" />
                  Vision
                </h3>
                <p className="text-slate-700 font-sans-body leading-relaxed text-xs">
                  To become a trusted and innovative architectural and interior design firm, recognized for creating timeless spaces that enrich lives, inspire communities, and set new standards in design excellence.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="font-serif-display text-xl text-[#1c356b] mb-6 flex items-center gap-3">
                  <Compass className="w-6 h-6 text-[#3b5c36]" />
                  Mission
                </h3>
                <p className="text-slate-700 font-sans-body leading-relaxed text-xs">
                  At Priad Architects, our mission is to transform ideas into thoughtfully designed spaces through creativity, technical expertise, and meticulous attention to detail. We are committed to delivering high-quality architectural and interior design solutions that balance aesthetics, functionality, sustainability, and value. By building strong relationships with our clients, we strive to exceed expectations on every project.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - ONLY place with the Admin Panel link as requested */}
      <footer className="bg-slate-900 pt-24 pb-32 md:pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Brand & Intro */}
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center">
                  <img
                    src="/assets/priad_logo.png"
                    alt="PRIAD ARCHITECTS Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <div className="font-serif-display text-xl tracking-[0.15em] font-bold text-white uppercase leading-none">
                    PRIAD ARCHITECTS
                  </div>
                  <div className="text-[14px] font-cormorant italic text-[#a8d3a0] mt-1 leading-none">
                    Building legacy.
                  </div>
                </div>
              </div>
              <p className="text-slate-400 font-sans-body text-xs leading-relaxed mb-6">
                Delivering innovative, sustainable, and timeless spaces that redefine modern living and enrich communities.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/priad_architects?utm_source=qr" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-[#3b5c36] hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/share/1DX6CBpDsi/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-[#3b5c36] hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/in/priad-architects-a5b5b1351/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-[#3b5c36] hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-montserrat text-xs tracking-widest uppercase text-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'Services', 'Projects', 'Studio', 'About'].map((item) => (
                  <li key={item}>
                    <button onClick={() => scrollToSection(item)} className="text-slate-400 hover:text-white text-xs transition-colors cursor-pointer">
                      {item}
                    </button>
                  </li>
                ))}
                <li className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setActivePage('admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-white text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Password-protected admin portal"
                  >
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Admin Panel</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-montserrat text-xs tracking-widest uppercase text-white mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-400 text-xs">
                  <MapPin className="w-5 h-5 text-[#a8d3a0] shrink-0 mt-0.5" />
                  <span>PRIAD ARCHITECTS<br/>Chinthamani Nagar, Kuppakonam Pudur<br/>Coimbatore, Tamil Nadu 641038</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-xs">
                  <Phone className="w-5 h-5 text-[#a8d3a0] shrink-0" />
                  <span>+91 90437 21008</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-xs">
                  <Mail className="w-5 h-5 text-[#a8d3a0] shrink-0" />
                  <span>priad2728@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Map Integration */}
            <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-800 relative group border border-white/10">
              <iframe 
                src="https://maps.google.com/maps?q=PRIAD+ARCHITECTS,+Chinthamani+Nagar,+Kuppakonam+Pudur,+Coimbatore,+Tamil+Nadu+641038&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-80 group-hover:opacity-100 transition-opacity"
              ></iframe>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 font-sans-body text-xs text-center md:text-left">
              © {new Date().getFullYear()} PRIAD ARCHITECTS. All rights reserved.
            </div>
            <div className="text-slate-500 font-sans-body text-xs flex items-center gap-3">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>|</span>
              <button
                onClick={handleOpenAdmin}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-montserrat tracking-wider uppercase text-[10px]"
                title="Dedicated Administrator Portal (/admin)"
              >
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Admin Login (/admin)</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>

    {/* Sticky Bottom Call to Action for Mobile */}
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden flex bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-20px_40px_rgba(0,0,0,0.15)] border-t border-slate-200">
      <a href="tel:+919043721008" className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white hover:bg-slate-800 transition-colors active:bg-slate-700 border-r border-slate-200">
        <Phone className="w-4 h-4 text-white" />
        <span className="text-[11px] font-montserrat uppercase tracking-widest font-bold">Call Us</span>
      </a>
      <a href="https://wa.me/919043721008" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors active:bg-[#0c6b5f]">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span className="text-[11px] font-montserrat uppercase tracking-widest font-bold">WhatsApp</span>
      </a>
    </div>

      {/* Floating Action Buttons for Desktop */}
      <div className="hidden md:flex fixed bottom-8 right-8 z-50 flex-col gap-4">
        <a href="https://wa.me/919043721008" target="_blank" rel="noreferrer" className="w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 cursor-pointer">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </div>

      {/* Enquiry Form Modal */}
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
