import React from 'react';
import { MapPin, ExternalLink, Navigation, Clock, Phone, Mail } from 'lucide-react';

export const GoogleMapSection: React.FC = () => {
  const mapProfileUrl = "https://maps.app.goo.gl/8dQPVHgUNWEwGPKs7?g_st=iwb";

  return (
    <section className="py-24 bg-white text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold block">
              Global Studio Location
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-slate-900">
              PRIAD Design Tower & Headquarters
            </h2>
            <p className="text-xs text-slate-600 font-sans-body leading-relaxed">
              Our flagship architectural studio is located in the Financial District Plaza, featuring material sample vaults, 3D VR simulation suites, and structural model exhibition galleries.
            </p>

            <div className="space-y-4 pt-2 text-xs font-mono-tech text-slate-700">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <MapPin className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Studio Address:</span>
                  <span>PRIAD Architectural Design Tower, Suite 800, Financial District, Metropolis City - 400001</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <Clock className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Consultation Hours:</span>
                  <span>Monday - Saturday: 09:00 AM - 07:00 PM (By Appointment Only)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <Phone className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Private Direct Line:</span>
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={mapProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-900/20"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Map Preview Box */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-2 border border-slate-200 shadow-xl relative h-[450px] overflow-hidden flex flex-col justify-between">
            <iframe
              title="PRIAD ARCHITECTS Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8021!2d72.8258!3d18.96!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU3JzM2LjAiTiA3MsKwNDknMzIuOSJF!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              className="w-full h-full rounded-2xl border-0"
              allowFullScreen
              loading="lazy"
            />

            {/* Map Overlay Badge */}
            <a
              href={mapProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 text-xs font-mono-tech text-slate-900 flex items-center gap-3 cursor-pointer hover:border-blue-900 transition-all shadow-lg"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
                P
              </div>
              <div>
                <span className="text-blue-900 font-bold block">PRIAD ARCHITECTS Studio</span>
                <span className="text-[10px] text-slate-500">Click to view official Google Business profile</span>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-900 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
