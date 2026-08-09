import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const categories = [
  {
    id: 'architecture',
    title: 'Architectural Design',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    items: [
      'High rise buildings/Apartments',
      'Residential Architecture',
      'Commercial Architecture',
      'Villa & Luxury Home Design',
      'Building Planning & Approval drawing',
      'Renovation & Remodeling'
    ]
  },
  {
    id: 'interior',
    title: 'Interior Design',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    items: [
      'Home Interiors',
      'Office Interiors',
      'Retail & Commercial Interiors',
      'Space Planning',
      'Custom Furniture Design'
    ]
  },
  {
    id: 'documentation',
    title: 'Design & Documentation',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    items: [
      '2D Floor Plans',
      'Working Drawings',
      'Electrical & Plumbing Layouts',
      'BOQ (Bill of Quantities)',
      'Construction Documentation'
    ]
  },
  {
    id: 'visualization',
    title: 'Visualization',
    image: '/src/assets/images/person_in_vr_visualisation_1786283784621.jpg',
    items: [
      'Photorealistic 3D Renders',
      'Walkthrough Animations',
      'Virtual Design Presentations'
    ]
  },
  {
    id: 'support',
    title: 'Project Support',
    image: '/src/assets/images/project_support_architecture_1786283800995.jpg',
    items: [
      'Site Consultation',
      'Material Selection',
      'Design Coordination',
      'Execution Guidance',
      'Turnkey Project Consultation'
    ]
  }
];

export function ServicesVisual() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const currentData = categories.find(c => c.id === activeCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-5 flex flex-col gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`text-left p-6 rounded-2xl transition-all duration-300 border ${
              activeCategory === category.id 
                ? 'bg-white border-[#3b5c36]/20 shadow-xl shadow-[#3b5c36]/5' 
                : 'bg-transparent border-transparent hover:bg-slate-50'
            }`}
          >
            <h3 className={`font-serif-display text-lg md:text-xl transition-colors ${
              activeCategory === category.id ? 'text-[#3b5c36]' : 'text-slate-500'
            }`}>
              {category.title}
            </h3>
          </button>
        ))}
      </div>

      <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          {currentData && (
            <motion.div
              key={currentData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="w-full h-64 rounded-xl overflow-hidden mb-8 relative">
                <img 
                  src={currentData.image} 
                  alt={currentData.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentData.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#3b5c36] shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-sans-body text-xs leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
