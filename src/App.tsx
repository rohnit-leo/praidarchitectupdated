import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Instagram, Linkedin, Building2, Users, Trophy } from 'lucide-react';
import { CustomCursor } from './components/CustomCursor';
import { SEOHead } from './components/SEOHead';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const navItems = ['Home', 'About', 'Services', 'Process', 'Projects'];

  const services = [
    'Architecture',
    'Interior Design',
    '3D Visualization',
    'Working Drawings',
    'Renovation & Remodeling',
  ];

  const processSteps = [
    { title: 'Consultation', desc: 'Initial vision alignment and requirements gathering.' },
    { title: 'Site Visit', desc: 'Context analysis and spatial constraint evaluation.' },
    { title: 'Concept Design', desc: 'Architectural form, spatial planning, and flow.' },
    { title: 'Design Development', desc: 'Refined material selection and detailed styling.' },
    { title: '3D Visualization', desc: 'Photorealistic architectural previews.' },
    { title: 'Working Drawings', desc: 'Comprehensive technical blueprints for execution.' },
    { title: 'Execution Support', desc: 'On-site supervision and quality assurance.' },
  ];

  const projects = [
    {
      id: 'proj-1',
      title: 'Modern Villa',
      image: 'https://kwrv4maomvrojc0c.public.blob.vercel-storage.com/project/WhatsApp%20Image%202026-07-31%20at%208.54.37%20PM.jpeg',
      description: 'A luxurious modern villa blending contemporary aesthetics with functional living spaces, featuring open floor plans and expansive glass facades.',
    },
    {
      id: 'proj-2',
      title: 'Monolith Residence',
      image: 'https://kwrv4maomvrojc0c.public.blob.vercel-storage.com/project/WhatsApp%20Image%202026-07-31%20at%208.55.57%20PM.jpeg',
      description: 'An architectural masterpiece utilizing raw concrete and bold geometric forms, offering a dramatic yet harmonious sanctuary.',
    },
    {
      id: 'proj-3',
      title: 'Urban Oasis',
      image: 'https://kwrv4maomvrojc0c.public.blob.vercel-storage.com/project/WhatsApp%20Image%202026-07-31%20at%208.56.05%20PM.jpeg',
      description: 'Seamlessly integrating indoor and outdoor environments, this residence features lush landscaping and natural material palettes.',
    }
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans-body relative selection:bg-[#3b5c36] selection:text-white">
      <CustomCursor />
      <SEOHead activeRoute="home" />

      {/* Kalash Image (Small) */}
      <img 
        src="https://kwrv4maomvrojc0c.public.blob.vercel-storage.com/project/IMG_3188.PNG" 
        alt="Kalash Icon" 
        className="fixed top-24 left-4 w-6 h-6 opacity-30 z-50 pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="https://kwrv4maomvrojc0c.public.blob.vercel-storage.com/IMG_3159.PNG"
                alt="PRIAD ARCHITECTS Logo Symbol"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col items-start justify-center">
              <div className="font-serif-display text-lg tracking-[0.15em] font-bold text-[#4a7a42] uppercase leading-none">
                Priad Architects
              </div>
              <div className="text-[14px] font-cormorant italic text-[#1c356b] mt-1 leading-none">
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
                className="text-xs font-mono-tech uppercase tracking-widest text-slate-400 hover:text-[#3b5c36] transition-colors cursor-pointer"
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 p-2 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#0a0a0a] pt-24 px-6">
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-2xl font-serif-display text-left text-slate-300 hover:text-[#3b5c36] cursor-pointer border-b border-white/10 pb-4"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <main>
        {/* Hero Carousel Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden group">
          <div className="absolute inset-0 z-0 bg-black">
            {heroImages.map((img, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-40' : 'opacity-0'}`}
              >
                <img 
                  src={img}
                  alt="Hero Architecture"
                  className={`w-full h-full object-cover ${idx === currentSlide ? 'animate-image-zoom' : ''}`}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a] z-10" />
          </div>
          
          <button onClick={prevSlide} className="absolute left-6 z-20 p-3 rounded-full bg-black/20 text-white/50 hover:bg-black/40 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-6 z-20 p-3 rounded-full bg-black/20 text-white/50 hover:bg-black/40 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
            <span className="text-[#3b5c36] font-mono-tech text-xs tracking-[0.3em] uppercase mb-6 block drop-shadow-md">Welcome to Priad Architects</span>
            <h1 className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 font-medium tracking-tight drop-shadow-2xl">
              Crafting <span className="text-[#3b5c36] italic font-light drop-shadow-md">Experiences,</span><br/>
              Shaping Lifestyles.
            </h1>
            <p className="text-slate-300 font-sans-body max-w-2xl mx-auto text-lg mb-10 drop-shadow-lg">
              We create landmarks that inspire generations.
            </p>
            <button 
              onClick={() => scrollToSection('projects')}
              className="bg-transparent border border-[#3b5c36] text-[#3b5c36] hover:bg-[#3b5c36] hover:text-[#0a0a0a] font-mono-tech text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 cursor-pointer"
            >
              View Our Work
            </button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 px-6 bg-[#0d0d0d]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#3b5c36] font-mono-tech text-xs tracking-widest uppercase mb-4 block">About Us</span>
              <h2 className="font-serif-display text-3xl md:text-5xl text-white">At Priad Architects, we don't simply design buildings—we craft experiences, shape lifestyles, and create landmarks that inspire generations.</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 mt-20">
              <div>
                <h3 className="font-serif-display text-2xl text-[#3b5c36] mb-6">Our Vision</h3>
                <p className="text-slate-400 font-sans-body leading-relaxed">
                  To be recognized as a leading architecture and interior design studio, delivering innovative, sustainable, and timeless spaces that redefine modern living and enrich communities.
                </p>
              </div>
              <div>
                <h3 className="font-serif-display text-2xl text-[#3b5c36] mb-6">Our Mission</h3>
                <ul className="text-slate-400 font-sans-body leading-relaxed space-y-4 list-disc pl-4 marker:text-[#3b5c36]">
                  <li>To create architecture that balances beauty, functionality, and sustainability.</li>
                  <li>To deliver exceptional design experiences through collaboration and innovation.</li>
                  <li>To uphold the highest standards of quality, professionalism, and technical excellence.</li>
                  <li>To build lasting relationships based on trust, transparency, and client satisfaction.</li>
                  <li>To transform ideas into inspiring spaces that create lasting value.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 px-6 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-[#3b5c36] font-mono-tech text-xs tracking-widest uppercase mb-4 block">Expertise</span>
              <h2 className="font-serif-display text-4xl md:text-5xl text-white">Services</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {services.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-4 border-b border-white/5">
                    <span className="text-[#3b5c36] font-mono-tech text-sm">0{idx + 1}</span>
                    <h3 className="font-serif-display text-xl text-slate-200">{service}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-32 px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-[#3b5c36] font-mono-tech text-xs tracking-widest uppercase mb-4 block">Methodology</span>
              <h2 className="font-serif-display text-4xl md:text-5xl text-white">Process</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-2xl overflow-hidden group">
                  <div className="text-6xl font-serif-display text-white/[0.03] absolute -top-2 -right-2 group-hover:text-[#3b5c36]/10 transition-colors font-bold">
                    0{idx + 1}
                  </div>
                  <div className="relative z-10 mt-8">
                    <h3 className="font-serif-display text-xl text-white mb-3">{step.title}</h3>
                    <p className="text-slate-400 font-sans-body text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-6 bg-[#3b5c36]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-serif-display text-white mb-2">15+</div>
              <div className="text-[#0a0a0a] font-mono-tech text-xs uppercase tracking-widest font-bold">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-serif-display text-white mb-2">120+</div>
              <div className="text-[#0a0a0a] font-mono-tech text-xs uppercase tracking-widest font-bold">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-serif-display text-white mb-2">25</div>
              <div className="text-[#0a0a0a] font-mono-tech text-xs uppercase tracking-widest font-bold">Design Awards</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-serif-display text-white mb-2">100%</div>
              <div className="text-[#0a0a0a] font-mono-tech text-xs uppercase tracking-widest font-bold">Client Satisfaction</div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 px-6 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-[#3b5c36] font-mono-tech text-xs tracking-widest uppercase mb-4 block">Selected Works</span>
                <h2 className="font-serif-display text-4xl md:text-5xl text-white">Portfolio</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <button 
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className="group text-left cursor-pointer relative overflow-hidden rounded-xl block w-full h-[500px]"
                >
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h3 className="font-serif-display text-2xl text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                    <div className="flex items-center gap-2 text-[#3b5c36] opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="font-mono-tech text-xs uppercase tracking-wider">View Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Brand & Intro */}
            <div className="col-span-1 lg:col-span-1">
              <div className="flex flex-col items-start mb-6">
                <div className="font-serif-display text-2xl tracking-[0.15em] font-bold text-[#4a7a42] uppercase leading-none">
                  Priad Architects
                </div>
                <div className="text-[16px] font-cormorant italic text-[#1c356b] mt-2 leading-none">
                  Building legacy.
                </div>
              </div>
              <p className="text-slate-400 font-sans-body text-sm leading-relaxed mb-6">
                Delivering innovative, sustainable, and timeless spaces that redefine modern living and enrich communities.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#3b5c36] hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#3b5c36] hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-mono-tech text-xs tracking-widest uppercase text-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'About Us', 'Services', 'Projects', 'Process'].map((item) => (
                  <li key={item}>
                    <button onClick={() => scrollToSection(item === 'About Us' ? 'about' : item)} className="text-slate-400 hover:text-[#3b5c36] text-sm transition-colors cursor-pointer">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-mono-tech text-xs tracking-widest uppercase text-white mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-400 text-sm">
                  <MapPin className="w-5 h-5 text-[#3b5c36] shrink-0" />
                  <span>PRIAD ARCHITECTS<br/>Chinthamani Nagar, Kuppakonam Pudur<br/>Coimbatore, Tamil Nadu 641038</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <Phone className="w-5 h-5 text-[#3b5c36] shrink-0" />
                  <span>+91 90437 21008</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <Mail className="w-5 h-5 text-[#3b5c36] shrink-0" />
                  <span>priadarchitects@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Map Integration */}
            <div className="w-full h-48 rounded-xl overflow-hidden bg-white/5 relative group">
              <iframe 
                src="https://maps.google.com/maps?q=PRIAD+ARCHITECTS,+Chinthamani+Nagar,+Kuppakonam+Pudur,+Coimbatore,+Tamil+Nadu+641038&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter invert-[90%] hue-rotate-180 contrast-80 opacity-80 group-hover:opacity-100 transition-opacity"
              ></iframe>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 font-sans-body text-xs text-center md:text-left">
              © {new Date().getFullYear()} PRIAD ARCHITECTS. All rights reserved.
            </div>
            <div className="text-slate-500 font-sans-body text-xs">
              <a href="#" className="hover:text-[#3b5c36] transition-colors">Privacy Policy</a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-[#3b5c36] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto pt-24 px-4 pb-24">
          <button 
            onClick={() => setSelectedProject(null)}
            className="fixed top-8 right-8 text-white hover:text-[#3b5c36] transition-colors z-50 bg-white/10 p-3 rounded-full cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          {projects.filter(p => p.id === selectedProject).map(project => (
            <div key={project.id} className="max-w-5xl mx-auto">
              <img 
                src={project.image}
                alt={project.title}
                className="w-full h-[60vh] object-cover rounded-2xl mb-12"
                referrerPolicy="no-referrer"
              />
              <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                  <h2 className="font-serif-display text-4xl text-white mb-6">{project.title}</h2>
                  <p className="text-slate-300 font-sans-body leading-relaxed text-lg">
                    {project.description}
                  </p>
                </div>
                <div>
                  <div className="border-t border-white/10 pt-6">
                    <span className="text-[#3b5c36] font-mono-tech text-xs uppercase tracking-wider block mb-2">Category</span>
                    <span className="text-white font-sans-body">Architecture / Interior Design</span>
                  </div>
                  <div className="border-t border-white/10 pt-6 mt-6">
                    <span className="text-[#3b5c36] font-mono-tech text-xs uppercase tracking-wider block mb-2">Status</span>
                    <span className="text-white font-sans-body">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
