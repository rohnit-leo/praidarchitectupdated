import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'cantilever-engineering-principles',
    title: 'The Art & Engineering of 18-Meter Column-Free Cantilevers',
    slug: 'cantilever-engineering-principles',
    category: 'MEP & Engineering',
    author: 'Ar. Rajesh Priad, Principal Architect',
    date: 'July 18, 2026',
    readTime: '7 min read',
    summary: 'An inside look at post-tensioned concrete mathematics, structural deflection calculations, and counterweight foundations in extreme residential architecture.',
    content: `Suspending tons of board-formed concrete and double-glazed glass without visible vertical support is one of modern architecture's ultimate achievements. In our recent project, The Monolith Villa, we achieved an 18-meter overhang projecting over a 40-degree cliff face.

### Structural Counterweights & Post-Tensioning

The secret behind extreme cantilevers lies not in supporting the overhang itself, but in anchoring the rear foundation. We engineered deep rock-anchored micropiles extending 22 meters into bed rock.

Post-tensioned steel tendons embedded within the upper roof beam were hydraulic-stressed to 450 metric tons of force, effectively pre-arching the beam upward so that when full dead load was applied, deflection measured less than 4 millimeters across the span.

### Thermal & Acoustic Expansion Joints

Cantilevers expand and contract significantly under direct thermal exposure. By decoupling the primary structural glass track with spring-loaded neoprene isolation joints, we guaranteed zero glass stress during thermal fluctuations between day and night.`,
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    tags: ['Structural Engineering', 'Cantilever', 'Luxury Villa', 'Post-Tensioned Concrete']
  },
  {
    id: 'biophilic-microclimates-highrises',
    title: 'Designing Passive Solar Microclimates in High-Rise Architecture',
    slug: 'biophilic-microclimates-highrises',
    category: 'Sustainable Design',
    author: 'Elena Rostova, Director of Sustainability',
    date: 'June 24, 2026',
    readTime: '9 min read',
    summary: 'How computational fluid dynamics (CFD) and double-skin facades cut HVAC energy demands by 42% in modern commercial towers.',
    content: `As urban centers intensify, reliance on active air conditioning creates massive urban heat island effects. PRIAD's approach to high-rise commercial architecture focuses on passive solar chimney design and aerodynamic wind scooping.

By pairing kinetic double-skin facade glazing with automated sun tracking louvers, we create a thermal buffer zone that pre-cools intake air before reaching building HVAC handlers.`,
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tags: ['Net Zero', 'BIM', 'Facade Engineering', 'Green Building']
  },
  {
    id: 'curating-tactile-materiality',
    title: 'The Tactile Manifesto: Why Texture Outlasts Color in Luxury Interiors',
    slug: 'curating-tactile-materiality',
    category: 'Materiality',
    author: 'Vikramaditya Priad, Design Director',
    date: 'May 12, 2026',
    readTime: '5 min read',
    summary: 'Exploring the psychological impact of natural stone veining, charred timber, and raked plaster in high-end living spaces.',
    content: `In an age dominated by digital screens, human beings crave tactile authenticity. Smooth painted drywall feels sterile. In contrast, honed Volakas marble, hand-raked lime plaster, and carbonized Yakisugi cedar provide organic sensory feedback that matures gracefully over decades.`,
    featuredImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    tags: ['Interior Architecture', 'Natural Stone', 'Luxury Design']
  }
];
