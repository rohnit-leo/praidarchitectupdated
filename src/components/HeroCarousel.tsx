import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Mail, Facebook, Linkedin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const slides = [
  {
    id: 1,
    image: '/src/assets/images/hero_villa_twilight_1786284430616.jpg',
  },
  {
    id: 2,
    image: '/src/assets/images/hero_commercial_building_1786284450247.jpg',
  },
  {
    id: 3,
    image: '/src/assets/images/hero_luxury_interior_1786284466223.jpg',
  }
];

export function HeroCarousel({ onEnquire }: { onEnquire: () => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-start">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img 
            src={slides[current].image} 
            alt="PRIAD Architectural Design" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Overlay gradient for high contrast readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Left Aligned Content Overlay */}
      <div className="relative z-10 text-left px-6 sm:px-12 md:px-20 pt-28 pb-16 max-w-3xl">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl text-white font-bold tracking-wider uppercase">
            PRIAD ARCHITECTS
          </h1>
        </div>

        {/* Disciplines */}
        <div className="text-slate-200 font-montserrat text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2">
          ARCHITECTURE | INTERIOR | VISUALIZATION
        </div>

        {/* Location */}
        <div className="text-slate-300 font-montserrat text-[11px] font-bold tracking-[0.3em] uppercase mb-8">
          COIMBATORE
        </div>

        {/* Accolades / Highlights */}
        <div className="space-y-3 mb-10 text-slate-200 font-sans-body text-xs sm:text-sm leading-relaxed max-w-xl">
          <p className="italic">
            <strong className="text-white font-semibold not-italic">Recognized In India's Top 50 Under 40 Architects</strong> By IGEN 2022
          </p>
          <p className="italic">
            <strong className="text-white font-semibold not-italic">Winners Of Young Designers Awards</strong> 2018 By IA&B
          </p>
          <p className="italic">
            The <strong className="text-white font-semibold not-italic">Most Promising Architecture Firm Award</strong> In The Commercial Category
          </p>
          <p className="italic">
            <strong className="text-white font-semibold not-italic">Winners Of Young Architect's Award</strong> By 28th JK AYA For "A House Of Small Talks"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-md">
          <button 
            onClick={onEnquire}
            className="w-full sm:w-auto bg-slate-100/90 hover:bg-white text-slate-900 font-montserrat text-xs uppercase tracking-[0.18em] font-bold px-8 py-4 rounded-md transition-all duration-300 shadow-xl cursor-pointer text-center"
          >
            NEW PROJECTS ENQUIRY
          </button>
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto bg-slate-100/80 hover:bg-white text-slate-900 font-montserrat text-xs uppercase tracking-[0.18em] font-bold px-8 py-4 rounded-md transition-all duration-300 cursor-pointer text-center"
          >
            SEE OUR WORK
          </button>
        </div>

        {/* Social Link Badges */}
        <div className="flex items-center gap-3">
          <a 
            href="mailto:priad2728@gmail.com" 
            className="w-10 h-10 rounded-full border border-white/30 bg-black/30 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
            title="Email Us"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a 
            href="https://www.facebook.com/share/1DX6CBpDsi/?mibextid=wwXIfr" 
            target="_blank" 
            rel="noreferrer" 
            className="w-10 h-10 rounded-full border border-white/30 bg-black/30 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
            title="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a 
            href="https://www.linkedin.com/in/priad-architects-a5b5b1351/" 
            target="_blank" 
            rel="noreferrer" 
            className="w-10 h-10 rounded-full border border-white/30 bg-black/30 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a 
            href="https://www.instagram.com/priad_architects?utm_source=qr" 
            target="_blank" 
            rel="noreferrer" 
            className="w-10 h-10 rounded-full border border-white/30 bg-black/30 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Carousel Controls (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
        <div className="flex gap-2">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-white/30 bg-black/40 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors backdrop-blur-md cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full border border-white/30 bg-black/40 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors backdrop-blur-md cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${current === idx ? 'bg-[#a8d3a0] w-6' : 'bg-white/40 w-2 hover:bg-white'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

