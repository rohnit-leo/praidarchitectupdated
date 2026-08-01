import React from 'react';
import { X, Send } from 'lucide-react';

export function EnquiryModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-image-zoom overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-8">
          <h2 className="font-serif-display text-3xl text-slate-900 mb-2">Start a Project</h2>
          <p className="text-slate-500 font-sans-body text-sm">Fill out the form below and our team will get back to you to discuss your architectural vision.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono-tech uppercase tracking-wider text-slate-500">First Name</label>
              <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] focus:ring-1 focus:ring-[#3b5c36]" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono-tech uppercase tracking-wider text-slate-500">Last Name</label>
              <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] focus:ring-1 focus:ring-[#3b5c36]" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-mono-tech uppercase tracking-wider text-slate-500">Email Address</label>
            <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] focus:ring-1 focus:ring-[#3b5c36]" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono-tech uppercase tracking-wider text-slate-500">Phone Number</label>
            <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] focus:ring-1 focus:ring-[#3b5c36]" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono-tech uppercase tracking-wider text-slate-500">Service Needed</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] focus:ring-1 focus:ring-[#3b5c36]">
              <option>Architectural Design</option>
              <option>Interior Design</option>
              <option>Turnkey Project</option>
              <option>Renovation & Remodeling</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono-tech uppercase tracking-wider text-slate-500">Message</label>
            <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3b5c36] focus:ring-1 focus:ring-[#3b5c36]"></textarea>
          </div>

          <button type="submit" className="w-full bg-[#3b5c36] hover:bg-[#2c4728] text-white font-mono-tech uppercase tracking-widest text-xs py-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-6">
            <span>Send Inquiry</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
