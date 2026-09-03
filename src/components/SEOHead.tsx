import React, { useEffect } from 'react';
import { PageRoute, Project } from '../types';

interface SEOHeadProps {
  activeRoute: PageRoute;
  customTitle?: string;
  customDescription?: string;
  project?: Project | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ activeRoute, customTitle, customDescription, project }) => {
  useEffect(() => {
    const titles: Record<PageRoute, string> = {
      home: 'PRIAD ARCHITECTS | Top Architecture & Interior Design Firm | Coimbatore, India',
      about: 'About Us | PRIAD ARCHITECTS - Visionary Architectural Leadership in Coimbatore',
      services: 'Architecture & Engineering Services | PRIAD ARCHITECTS',
      portfolio: 'Architectural Portfolio & Luxury Residences | PRIAD ARCHITECTS',
      process: 'Architectural Design Process & Construction Workflow | PRIAD ARCHITECTS',
      floorplan: 'Interactive Vector Floor Plan Explorer | PRIAD ARCHITECTS',
      'before-after': 'Architectural Transformations & Facade Remodeling | PRIAD ARCHITECTS',
      materials: 'Material Inspiration Library & Moodboard Studio | PRIAD ARCHITECTS',
      '3d-viewer': 'Interactive 3D Architectural Layers Viewer | PRIAD ARCHITECTS',
      calculator: 'Architectural Project Cost Estimator & Analysis | PRIAD ARCHITECTS',
      manifesto: 'Architectural Philosophy & Design Manifesto | PRIAD ARCHITECTS',
      blog: 'Architectural Insights & Design Articles | PRIAD ARCHITECTS',
      faq: 'Frequently Asked Architectural & MEP Questions | PRIAD ARCHITECTS',
      contact: 'Book Architectural Consultation | PRIAD ARCHITECTS Coimbatore',
      'seo-hub': 'SEO & Google Indexing Portal | PRIAD ARCHITECTS',
      admin: 'Admin Portal & Content Management | PRIAD ARCHITECTS',
      'project-detail': project ? `${project.title} | Architectural Showcase | PRIAD ARCHITECTS` : 'Architectural Project Showcase | PRIAD ARCHITECTS'
    };

    const finalTitle = customTitle || titles[activeRoute] || 'PRIAD ARCHITECTS | Architecture & Interior Design Firm';
    document.title = finalTitle;

    // Check & apply saved Google Site Verification from localStorage if available
    const savedVerification = localStorage.getItem('priad_google_site_verification');
    if (savedVerification) {
      let metaVerification = document.getElementById('google-site-verification-meta') as HTMLMetaElement;
      if (!metaVerification) {
        metaVerification = document.createElement('meta');
        metaVerification.id = 'google-site-verification-meta';
        metaVerification.name = 'google-site-verification';
        document.head.appendChild(metaVerification);
      }
      metaVerification.content = savedVerification;
    }

    // Dynamic Canonical URL
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    
    if (activeRoute === 'project-detail' && project?.id) {
      canonicalLink.href = `https://www.priadarchitects.in/?project=${encodeURIComponent(project.id)}`;
    } else {
      canonicalLink.href = 'https://www.priadarchitects.in/';
    }

    // Dynamic Meta Description
    let metaDesc = document.querySelector("meta[name='description']") as HTMLMetaElement;
    if (metaDesc) {
      if (customDescription) {
        metaDesc.content = customDescription;
      } else if (activeRoute === 'project-detail' && project?.conceptDescription) {
        metaDesc.content = `${project.title}: ${project.conceptDescription.slice(0, 155)}... Designed by PRIAD ARCHITECTS, Coimbatore.`;
      } else {
        metaDesc.content = 'PRIAD ARCHITECTS is an award-winning luxury architecture & interior design firm based in Coimbatore, Tamil Nadu, India. Specializing in bespoke villas, modern residences, commercial towers, 360 VR virtual tours, and turnkey construction planning.';
      }
    }

    // Dynamic OpenGraph Title
    const ogTitle = document.querySelector("meta[property='og:title']") as HTMLMetaElement;
    if (ogTitle) ogTitle.content = finalTitle;

    // Dynamic OpenGraph URL
    const ogUrl = document.querySelector("meta[property='og:url']") as HTMLMetaElement;
    if (ogUrl) ogUrl.content = canonicalLink.href;

    // Inject Rich JSON-LD Schema dynamically for Google Search
    const baseOrganization = {
      '@type': ['ArchitecturalFirm', 'LocalBusiness', 'ProfessionalService'],
      '@id': 'https://www.priadarchitects.in/#organization',
      name: 'PRIAD ARCHITECTS',
      legalName: 'PRIAD ARCHITECTS',
      alternateName: ['Priad Architects Coimbatore', 'Priad Architectural Studio'],
      url: 'https://www.priadarchitects.in/',
      logo: 'https://www.priadarchitects.in/assets/priad_logo.png',
      image: project?.heroImage || 'https://www.priadarchitects.in/assets/priad_logo.png',
      description: 'Award-winning architectural and luxury interior design firm specializing in concept master planning, ultra-luxury villas, residential architecture, commercial projects, and interactive 360 VR walkthroughs.',
      telephone: '+919150073342',
      email: 'priad2728@gmail.com',
      priceRange: '$$$$',
      currenciesAccepted: 'INR, USD',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chinthamani Nagar, Kuppakonam Pudur',
        addressLocality: 'Coimbatore',
        addressRegion: 'Tamil Nadu',
        postalCode: '641038',
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 11.0168,
        longitude: 76.9558
      },
      hasMap: 'https://maps.google.com/maps?q=PRIAD+ARCHITECTS,+Chinthamani+Nagar,+Kuppakonam+Pudur,+Coimbatore,+Tamil+Nadu+641038',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00'
        }
      ],
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Coimbatore' },
        { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
        { '@type': 'Country', name: 'India' }
      ],
      sameAs: [
        'https://www.instagram.com/priad_architects/',
        'https://www.linkedin.com/in/priad-architects-a5b5b1351/',
        'https://wa.me/919150073342'
      ]
    };

    const graphItems: any[] = [
      baseOrganization,
      {
        '@type': 'WebSite',
        '@id': 'https://www.priadarchitects.in/#website',
        url: 'https://www.priadarchitects.in/',
        name: 'PRIAD ARCHITECTS Official Website',
        publisher: {
          '@id': 'https://www.priadarchitects.in/#organization'
        },
        inLanguage: 'en-IN'
      }
    ];

    // If on a project page, add CreativeWork / VisualArtwork schema for Google Image & Knowledge Graph
    if (activeRoute === 'project-detail' && project) {
      graphItems.push({
        '@type': 'CreativeWork',
        '@id': `https://www.priadarchitects.in/?project=${project.id}#project`,
        name: project.title,
        headline: `${project.title} - Architectural Design by PRIAD ARCHITECTS`,
        description: project.conceptDescription,
        image: project.heroImage,
        creator: {
          '@id': 'https://www.priadarchitects.in/#organization'
        },
        genre: project.category,
        locationCreated: {
          '@type': 'Place',
          name: project.location
        },
        material: project.keyMaterials?.join(', '),
        dateCreated: project.year ? `${project.year}` : undefined
      });
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': graphItems
    };

    let scriptTag = document.getElementById('json-ld-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData, null, 2);
  }, [activeRoute, customTitle, customDescription, project]);

  return null;
};

