import React, { useEffect } from 'react';
import { PageRoute } from '../types';

interface SEOHeadProps {
  activeRoute: PageRoute;
  customTitle?: string;
  customDescription?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ activeRoute, customTitle, customDescription }) => {
  useEffect(() => {
    const titles: Record<PageRoute, string> = {
      home: 'PRIAD ARCHITECTS | Global Architectural & Interior Design Studio',
      about: 'About Us | PRIAD ARCHITECTS - Visionary Architectural Leadership',
      services: 'Architecture & Engineering Services | PRIAD ARCHITECTS',
      portfolio: 'Interactive Project Portfolio | PRIAD ARCHITECTS',
      process: '7-Step Architectural Execution Journey | PRIAD ARCHITECTS',
      floorplan: 'Interactive Vector Floor Plan Explorer | PRIAD ARCHITECTS',
      'before-after': 'Architectural Transformations & Facade Remodeling | PRIAD ARCHITECTS',
      materials: 'Material Inspiration Library & Moodboard Studio | PRIAD ARCHITECTS',
      '3d-viewer': 'Interactive 3D Architectural Layers Viewer | PRIAD ARCHITECTS',
      calculator: 'AI Architectural Design Estimator & Analysis | PRIAD ARCHITECTS',
      manifesto: 'Architectural Philosophy & Design Manifesto | PRIAD ARCHITECTS',
      blog: 'Architectural Knowledge Hub & Whitepapers | PRIAD ARCHITECTS',
      faq: 'Frequently Asked Architectural & MEP Questions | PRIAD ARCHITECTS',
      contact: 'Book Architectural Consultation & Contact | PRIAD ARCHITECTS',
      'seo-hub': 'Technical SEO & Structured Schema Portal | PRIAD ARCHITECTS'
    };

    document.title = customTitle || titles[activeRoute] || 'PRIAD ARCHITECTS';

    // Inject JSON-LD Schema dynamically
    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ArchitectureFirm',
          '@id': 'https://priadarchitects.com/#organization',
          name: 'PRIAD ARCHITECTS',
          url: 'https://priadarchitects.com',
          logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
          description: 'Award-winning international architectural firm specializing in ultra-luxury residential villas, commercial high-rises, 3D photorealistic rendering, and MEP engineering.',
          telephone: '+919876543210',
          priceRange: '$$$$',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'PRIAD Architectural Design Tower, Suite 800, Financial District',
            addressLocality: 'Metropolis City',
            postalCode: '400001',
            addressCountry: 'IN'
          },
          hasMap: 'https://maps.app.goo.gl/8dQPVHgUNWEwGPKs7?g_st=iwb',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '09:00',
              closes: '19:00'
            }
          ]
        },
        {
          '@type': 'WebSite',
          '@id': 'https://priadarchitects.com/#website',
          url: 'https://priadarchitects.com',
          name: 'PRIAD ARCHITECTS Digital Experience',
          publisher: {
            '@id': 'https://priadarchitects.com/#organization'
          }
        }
      ]
    };

    let scriptTag = document.getElementById('json-ld-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData);
  }, [activeRoute, customTitle, customDescription]);

  return null;
};
