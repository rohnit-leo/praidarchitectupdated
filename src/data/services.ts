import { ServiceItem } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'architecture-masterplanning',
    category: 'Architecture',
    title: 'Concept Architecture & Master Planning',
    tagline: 'Sculpting iconic urban skylines & private luxury sanctuaries from raw land concept to structural reality.',
    description: 'We craft architectural masterpieces that challenge gravitational constraints, integrate sustainable microclimates, and generate timeless spatial experience.',
    iconName: 'Compass',
    deliverables: [
      'Comprehensive Site & Topography Analysis',
      'Concept Massing & Volumetric 3D Diagrams',
      'Zoning, FAR & Building Regulatory Approval Sets',
      'Microclimate & Passive Solar Shadow Studies',
      'High-Density Master Plan Zoning Guidelines'
    ],
    technicalSpecs: [
      'BIM Level 2 / Revit Parametric Modeling',
      'CFD Wind Tunnel Simulation Analysis',
      'LEED & BREEAM Sustainable Benchmark Compliance',
      'Solar Radiation & Daylight Autonomy Mapping'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      {
        question: 'What is the typical timeline for an architectural concept master plan?',
        answer: 'Concept development and schematic design for a luxury residential villa typically take 4 to 8 weeks, while commercial master plans range between 12 and 16 weeks including municipal pre-approvals.'
      },
      {
        question: 'Do you handle local municipality building code approvals?',
        answer: 'Yes. PRIAD Architects handles complete statutory documentation, building sanction sets, environmental clearances, and zoning authority coordination.'
      }
    ]
  },
  {
    id: 'interior-design-fitout',
    category: 'Interior Design',
    title: 'Ultra-Luxury Interior Architecture & Custom Fit-Out',
    tagline: 'Curating tactile sensory environments, custom furniture pieces, and bespoke lighting scenography.',
    description: 'Our interior architecture practice transforms interior volumes into cohesive artistic galleries where material selection, lighting design, and ergonomic precision unite.',
    iconName: 'Layout',
    deliverables: [
      '3D Photorealistic Interior Renderings',
      'Bespoke Joinery & Custom Furniture Detail Drawings',
      'Lighting Layouts & Scene Dimming Schedules',
      'Material Board Specifications & Sample Swatches',
      'False Ceiling & Flooring Pattern Layout Drawings'
    ],
    technicalSpecs: [
      'DALI & KNX Smart Home Lighting Automation Specs',
      'Acoustic NRC Insulation Rating Calculations',
      'Custom CNC Marble & Timber Fabrication Drawings',
      'HVAC Diffuser & Hidden Grille Integration'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      {
        question: 'Can PRIAD custom design bespoke furniture pieces?',
        answer: 'Absolutely. We design and manufacture one-of-a-kind monolithic marble islands, custom brass joinery, leather wall paneling, and sculptural lighting fixtures through master artisans.'
      }
    ]
  },
  {
    id: '3d-visualization-vr',
    category: '3D Visualization',
    title: 'Photorealistic Rendering, Walkthroughs & VR Studio',
    tagline: 'Experience your project before ground is ever broken with cinematic photorealism.',
    description: 'Using high-end physically based rendering engines, unreal engine 3D environments, and ray-traced lighting models, we produce ultra-realistic imagery and virtual reality experiences.',
    iconName: 'Eye',
    deliverables: [
      '8K Resolution Exterior & Interior Renderings',
      'Cinematic 4K Architectural Walkthrough Animations',
      'Interactive 360° Panorama Virtual Reality Tours',
      'Day to Night Architectural Lighting Visualizations',
      'Drone Aerial Site Integration Composite Renders'
    ],
    technicalSpecs: [
      'Unreal Engine 5 Real-Time Path Tracing',
      'V-Ray & Corona Photometric Sun/Sky Systems',
      'Volumetric Fog & Natural Vegetation Scattering',
      'VR Headset Spatial Interactivity Integration'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      {
        question: 'How accurate are the materials in the 3D renders compared to reality?',
        answer: 'We use physically accurate PBR shaders mapped directly from real marble quarries, wood veneer manufacturers, and glass fabricators to guarantee 1:1 realism.'
      }
    ]
  },
  {
    id: 'mep-engineering-working-drawings',
    category: 'Engineering & Technical',
    title: 'Working Drawings, HVAC & MEP Coordination',
    tagline: 'Flawless engineering coordination ensuring structural longevity and zero on-site spatial conflicts.',
    description: 'We bridge architectural design with rigorous engineering discipline. From structural load calculations to complex HVAC air distribution, MEP ducting, electrical grids, and plumbing schematics.',
    iconName: 'Cpu',
    deliverables: [
      'Full Working Drawing Construction Documentation Sets',
      'HVAC Ducting & Variable Refrigerant Flow (VRF) Layouts',
      'Electrical Load Calculations & Single Line Diagrams',
      'Plumbing Supply, Drainage & Rainwater Harvesting Sets',
      'Structural Steel & Reinforced Concrete Working Details'
    ],
    technicalSpecs: [
      'BIM Clash Detection Analysis (Zero Pipe/Beam Intersections)',
      'Acoustic Duct Silencer & Vibration Isolation Design',
      'Thermal Heat Gain & Energy Consumption Load Modeling',
      'Fire Suppression & Smoke Extraction System Coordination'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      {
        question: 'Why is MEP coordination critical before starting construction?',
        answer: 'Uncoordinated MEP causes ceiling height losses, costly site re-work, exposed piping, and air-conditioning noise. Our 3D BIM clash detection eliminates 100% of spatial collisions prior to site mobilization.'
      }
    ]
  },
  {
    id: 'project-support-boq',
    category: 'Project Support',
    title: 'BOQ Preparation, Cost Estimating & Site Supervision',
    tagline: 'Eliminating cost overruns and maintaining uncompromising quality through rigorous project management.',
    description: 'We safeguard your investment through precise Bills of Quantities (BOQ), material auditing, vendor quality control, and periodic on-site architectural supervision.',
    iconName: 'CheckCircle2',
    deliverables: [
      'Itemized Bill of Quantities (BOQ) with Material Specifications',
      'Contractor Tender Documentation & Bid Evaluation',
      'Periodic Site Supervision & Architectural Verification Reports',
      'Material Quality Verification & Vendor Auditing',
      'Construction Schedule Monitoring & Milestone Sign-Offs'
    ],
    technicalSpecs: [
      'Cost Tolerance Precision within +/- 3%',
      'Structural Rebar & Concrete Cube Strength Verification',
      'Snag List & Quality Control Audits at Each Stage'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      {
        question: 'Do you provide full-time on-site project management?',
        answer: 'We provide periodic architectural supervision to ensure design fidelity, and we partner with dedicated PMC firms for continuous daily site oversight.'
      }
    ]
  },
  {
    id: 'renovation-facade-remodeling',
    category: 'Renovation',
    title: 'Facade Transformation & Building Remodeling',
    tagline: 'Breathing high-end modern life and energy efficiency into existing structural bones.',
    description: 'Revitalize older structures into modern architectural landmarks. We evaluate structural integrity, reconfigure internal space utilization, and apply high-performance exterior facade systems.',
    iconName: 'Sparkles',
    deliverables: [
      'Existing Structure Laser Scanning & As-Built Verification',
      'Structural Retrofitting & Beam Reinforcement Plan',
      'Modern High-Performance Ventilated Facade Redesign',
      'Thermal Performance & Insulation Envelope Upgrade',
      'Complete Interior Spatial Re-planning'
    ],
    technicalSpecs: [
      '3D Point Cloud Scan to BIM Integration',
      'Exterior Rainscreen Cladding Substructure Specs',
      'Structural Load Transfer Verification'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      {
        question: 'Is it better to renovate or demolish and rebuild from scratch?',
        answer: 'In many cases, retaining existing concrete foundations and structural frames saves 30-40% of construction costs and cuts carbon footprint significantly, while yielding a brand-new contemporary building appearance.'
      }
    ]
  }
];
