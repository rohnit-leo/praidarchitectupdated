import React, { useState } from 'react';
import { X, Send, Phone, CheckCircle, ArrowRight } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectType?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, defaultProjectType }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: defaultProjectType || 'Ultra-Luxury Residence / Villa',
    location: '',
    areaSqFt: '',
    budgetRange: 'Flexible / Ultra-Premium Tier',
    notes: '',
    siteVisitRequested: false
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }
    } catch (err) {
      // Fallback direct WhatsApp redirect
      const formattedMsg = `*PRIAD ARCHITECTS - PROJECT CONSULTATION REQUEST*
----------------------------------------
👤 *Client Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
✉️ *Email:* ${formData.email}
🏛️ *Project Type:* ${formData.projectType}
📍 *Location:* ${formData.location}
📐 *Approx Footprint:* ${formData.areaSqFt} Sq Ft
💰 *Budget:* ${formData.budgetRange}
📝 *Notes:* ${formData.notes}
----------------------------------------`;

      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(formattedMsg)}`;
      window.open(whatsappUrl, '_blank');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 relative my-8 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-10">
          <span className="text-blue-900 font-mono-tech text-xs tracking-widest font-bold uppercase block mb-1">
            Private Architectural Booking
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl text-slate-900">
            Schedule Project Consultation
          </h2>
          <p className="text-xs text-slate-600 font-sans-body mt-1 leading-relaxed">
            Submitting this form prepares your consultation dossier and opens a direct pre-filled WhatsApp thread with our Principal Architects.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-blue-900 font-mono-tech font-bold uppercase block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Ar. Rajesh Priad"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="text-blue-900 font-mono-tech font-bold uppercase block mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-blue-900 font-mono-tech font-bold uppercase block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@domain.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="text-blue-900 font-mono-tech font-bold uppercase block mb-1">Project Category</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-900 font-mono-tech"
              >
                <option value="Ultra-Luxury Residence / Villa">Ultra-Luxury Residence / Villa</option>
                <option value="Commercial High-Rise / HQ">Commercial High-Rise / HQ</option>
                <option value="Institutional & Cultural Landmark">Institutional & Cultural Landmark</option>
                <option value="Penthouse Interior Makeover">Penthouse Interior Makeover</option>
                <option value="Facade & Building Renovation">Facade & Building Renovation</option>
                <option value="Vendor / Partner Registration">Vendor / Partner Registration</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-blue-900 font-mono-tech font-bold uppercase block mb-1">Site Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Coastal, or Terrain details"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="text-blue-900 font-mono-tech font-bold uppercase block mb-1">Approx Footprint (Sq Ft)</label>
              <input
                type="text"
                value={formData.areaSqFt}
                onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                placeholder="e.g., 8,500 Sq Ft"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="text-blue-900 font-mono-tech font-bold uppercase block mb-1">Project Vision & Requirements</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe site terrain, preferred materials, cantilever desires, or specific timeline goals..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-[0.2em] py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
          >
            <Phone className="w-4 h-4" />
            <span>{loading ? 'Formatting Message...' : 'Submit & Open WhatsApp Thread'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
