import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <section id="home" className="relative h-screen w-full overflow-hidden bg-slate-900">
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
            alt="Hero Architectural" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <img 
          src="https://kwrv4maomvrojc0c.public.blob.vercel-storage.com/project/IMG_3188.PNG" 
          alt="Kalash Icon" 
          className="w-12 h-12 object-contain mb-6 opacity-90 invert brightness-0"
          referrerPolicy="no-referrer"
        />
        
        <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-medium tracking-wide leading-tight">
          Building legacy.<br/>
          <span className="text-[#a8d3a0] italic font-light">PRIAD ARCHITECTS</span>
        </h1>
        <p className="text-slate-200 font-sans-body max-w-xl mx-auto text-xs mb-10 leading-relaxed font-light">
          Award-winning architecture and interior design studio crafting timeless spaces that enrich lives and inspire communities.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#3b5c36] text-white hover:bg-[#2c4728] font-montserrat text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 cursor-pointer shadow-xl shadow-[#3b5c36]/20"
          >
            View Our Work
          </button>
          <button 
            onClick={onEnquire}
            className="bg-transparent border border-white/50 text-white hover:border-white hover:bg-white/10 font-montserrat text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 cursor-pointer"
          >
            Start a Project
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-between items-center px-10 md:px-20 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'bg-[#a8d3a0] w-6' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
