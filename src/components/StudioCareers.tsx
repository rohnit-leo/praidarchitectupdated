import React, { useState } from 'react';
import { ArrowRight, Send } from 'lucide-react';

export function StudioCareers() {
  const [formOpen, setFormOpen] = useState<string | null>(null);

  const roles = [
    {
      id: 'architect',
      title: 'Senior Architect',
      type: 'Full-time',
      location: 'Coimbatore, TN',
      description: 'Looking for an experienced architect to lead luxury residential and commercial projects. Must have strong conceptual design and project management skills.'
    },
    {
      id: 'visualization',
      title: '3D Visualization Artist',
      type: 'Full-time',
      location: 'Coimbatore, TN',
      description: 'Seeking a talented 3D artist specializing in photorealistic architectural renderings and VR walkthroughs using 3ds Max, V-Ray, and Unreal Engine.'
    }
  ];

  return (
    <section id="studio" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#3b5c36] font-montserrat text-[10px] tracking-widest uppercase mb-4 block">Join Our Team</span>
          <h2 className="font-serif-display text-3xl md:text-4xl text-slate-900">Careers at PRIAD</h2>
          <p className="text-slate-600 font-sans-body text-sm max-w-2xl mx-auto mt-4">
            We are always looking for passionate architects, designers, and visionaries to join our growing studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {roles.map(role => (
            <div key={role.id} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-serif-display text-xl text-slate-900 mb-2">{role.title}</h3>
                  <div className="flex gap-3 text-xs font-montserrat text-slate-500 uppercase tracking-wider">
                    <span>{role.type}</span>
                    <span>&bull;</span>
                    <span>{role.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 font-sans-body text-sm mb-8 leading-relaxed">
                {role.description}
              </p>
              <button 
                onClick={() => setFormOpen(role.id)}
                className="flex items-center gap-2 text-[#3b5c36] hover:text-[#2c4728] font-montserrat text-[10px] uppercase tracking-widest font-bold transition-colors"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {formOpen && (
          <div className="max-w-2xl mx-auto bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h3 className="font-serif-display text-2xl text-slate-900 mb-6">Apply for {roles.find(r => r.id === formOpen)?.title}</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Application submitted successfully!'); setFormOpen(null); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                  <input type="text" required className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                  <input type="email" required className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-slate-500 mb-2">Portfolio URL (Behance, Issuu, etc.)</label>
                <input type="url" required className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-slate-500 mb-2">Cover Letter</label>
                <textarea rows={4} required className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] transition-colors resize-none"></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setFormOpen(null)} className="px-6 py-3 text-slate-500 font-montserrat text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-[#3b5c36] text-white px-8 py-3 rounded-lg font-montserrat text-[10px] uppercase tracking-widest hover:bg-[#2c4728] transition-colors flex items-center gap-2">
                  Submit Application <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
