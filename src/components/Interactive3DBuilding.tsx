import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Eye, Cpu, RotateCcw, Info, CheckCircle2, ArrowRight, Move } from 'lucide-react';

export const Interactive3DBuilding: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'foundation' | 'structure' | 'facade' | 'interior'>('all');
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const buildingGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const previousPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8fafc');

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 10, 16);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x1e3a8a, 1.4); // Blue Key Light
    dirLight1.position.set(20, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 0.8); // Sky Fill Light
    dirLight2.position.set(-20, 10, -20);
    scene.add(dirLight2);

    // Architectural Ground Grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x1e3a8a, 0xcbd5e1);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Group for building
    const buildingGroup = new THREE.Group();
    buildingGroupRef.current = buildingGroup;
    scene.add(buildingGroup);

    // 1. Foundation Slabs
    const foundationGeo = new THREE.BoxGeometry(8, 0.8, 8);
    const foundationMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.8,
      wireframe: activeLayer === 'structure'
    });
    const foundationMesh = new THREE.Mesh(foundationGeo, foundationMat);
    foundationMesh.position.y = -0.1;
    if (activeLayer === 'all' || activeLayer === 'foundation') {
      buildingGroup.add(foundationMesh);
    }

    // 2. Structural Steel Columns & Slabs
    const colGeo = new THREE.BoxGeometry(0.3, 6, 0.3);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.8, roughness: 0.2 });

    const colPositions = [
      [-3.5, 3, -3.5], [3.5, 3, -3.5],
      [-3.5, 3, 3.5], [3.5, 3, 3.5],
      [0, 3, -3.5], [0, 3, 3.5]
    ];

    if (activeLayer === 'all' || activeLayer === 'structure') {
      colPositions.forEach(([x, y, z]) => {
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(x, y, z);
        buildingGroup.add(col);
      });

      // Floor Slabs
      for (let i = 1; i <= 3; i++) {
        const slabGeo = new THREE.BoxGeometry(8.2, 0.2, 8.2);
        const slabMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.y = i * 2;
        buildingGroup.add(slab);
      }
    }

    // 3. Cantilever Upper Volume
    if (activeLayer === 'all' || activeLayer === 'facade' || activeLayer === 'structure') {
      const cantileverGeo = new THREE.BoxGeometry(10, 2.2, 7);
      const cantileverMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.3,
        metalness: 0.5,
        wireframe: activeLayer === 'structure'
      });
      const cantilever = new THREE.Mesh(cantileverGeo, cantileverMat);
      cantilever.position.set(2, 5.2, 0); // Extended outwards
      buildingGroup.add(cantilever);

      // Glass Facade Windows
      const glassGeo = new THREE.BoxGeometry(9.8, 1.8, 0.05);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        transmission: 0.9,
        ior: 1.5
      });
      const glassFront = new THREE.Mesh(glassGeo, glassMat);
      glassFront.position.set(2, 5.2, 3.48);
      buildingGroup.add(glassFront);
    }

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && buildingGroupRef.current) {
        buildingGroupRef.current.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeLayer, isRotating]);

  // Pointer Drag Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsRotating(false);
    previousPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !buildingGroupRef.current) return;
    const deltaX = e.clientX - previousPointerRef.current.x;
    const deltaY = e.clientY - previousPointerRef.current.y;

    buildingGroupRef.current.rotation.y += deltaX * 0.008;
    buildingGroupRef.current.rotation.x = Math.max(
      -0.8,
      Math.min(0.8, buildingGroupRef.current.rotation.x + deltaY * 0.008)
    );

    previousPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(8, Math.min(30, cameraRef.current.position.z + e.deltaY * 0.01));
  };

  const layerInfo = {
    all: {
      title: 'Full Integrated Architecture Model',
      desc: 'Complete architectural assembly showing structural concrete core, steel cantilevers, and high-performance glass curtain facade.'
    },
    foundation: {
      title: 'Foundations & Substructure Micropiles',
      desc: 'Bedrock-anchored 22m micropile grid capable of resisting 450 metric tons of overturning cantilever moment.'
    },
    structure: {
      title: 'Post-Tensioned Steel Exoskeleton',
      desc: 'Column-free post-tensioned steel frame providing 18-meter clear structural spans and open interior floorplates.'
    },
    facade: {
      title: 'Thermally Broken Triple-Glazed Facade',
      desc: 'High-efficiency thermal envelope with automated solar tracking louvers and double-sealed acoustic insulation.'
    },
    interior: {
      title: 'Custom Spatial Fit-Out & MEP Runs',
      desc: 'Concealed VRF climate ducting, integrated KNX lighting grids, and acoustic plaster ceiling assemblies.'
    }
  };

  return (
    <section className="py-24 bg-white text-slate-900 relative border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-900 font-mono-tech text-xs tracking-[0.3em] uppercase font-bold">Interactive 3D Inspector</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-slate-900 mt-2">BIM 3D Building Layers Viewer</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-sans-body mt-4 md:mt-0 leading-relaxed">
            Drag with cursor to rotate, scroll to zoom, isolate building sub-assemblies, and explore the structural engineering matrix.
          </p>
        </div>

        {/* 3D Viewer Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Layer Selector Bar */}
          <div className="lg:col-span-1 bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-mono-tech text-blue-900 uppercase tracking-widest font-bold flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Building Assembly Layers</span>
            </h3>

            <div className="space-y-2">
              {[
                { id: 'all', label: 'Complete Building' },
                { id: 'foundation', label: '1. Foundations & Bedrock Piles' },
                { id: 'structure', label: '2. Steel Exoskeleton Frame' },
                { id: 'facade', label: '3. Triple-Glazed Facade' },
                { id: 'interior', label: '4. MEP & Interior Systems' },
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono-tech transition-all flex items-center justify-between cursor-pointer ${
                    activeLayer === layer.id
                      ? 'bg-blue-900 text-white font-bold shadow-md shadow-blue-900/15'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{layer.label}</span>
                  {activeLayer === layer.id && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                </button>
              ))}
            </div>

            {/* Rotation Control */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono-tech text-slate-600">
                <span>3D Auto-Rotation</span>
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className="text-blue-900 font-bold hover:underline cursor-pointer"
                >
                  {isRotating ? 'Pause' : 'Play'}
                </button>
              </div>

              {/* Active Layer Details */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-sans-body space-y-1.5">
                <span className="font-serif-display font-bold text-blue-900 block">
                  {layerInfo[activeLayer].title}
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {layerInfo[activeLayer].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Canvas WebGL Render Box */}
          <div className="lg:col-span-3 bg-slate-50 rounded-3xl border border-slate-200 shadow-xl p-2 relative h-[520px] overflow-hidden flex flex-col justify-between">
            <div
              ref={mountRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onWheel={handleWheel}
              className={`w-full h-full rounded-2xl touch-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            />

            {/* HUD Overlay Labels */}
            <div className="absolute top-6 left-6 pointer-events-none bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 text-[10px] font-mono-tech text-slate-800 space-y-1 shadow-sm">
              <div className="flex items-center gap-2 text-blue-900 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>REAL-TIME 3D BIM MODEL</span>
              </div>
              <div>DRAG CURSOR TO MOVE & ROTATE VIEW</div>
              <div>ZOOM: SCROLL WHEEL</div>
            </div>

            <div className="absolute bottom-6 right-6 pointer-events-none bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-mono-tech text-slate-700 shadow-sm flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-blue-900" />
              <span>CLICK & DRAG TO MANUALLY ROTATE VIEW</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
