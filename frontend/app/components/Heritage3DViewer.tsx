'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface Hotspot {
  id: string;
  title: string;
  category: string;
  description: string;
  pos: [number, number, number];
}

const DEFAULT_HOTSPOTS: Hotspot[] = [
  {
    id: 'material',
    title: 'Pure Mulberry Silk & Zari',
    category: 'Material',
    description: 'High-density unweighted silk yarn interwoven with metallic electroplated silver and gold zari threads.',
    pos: [0, 1.2, 0.9],
  },
  {
    id: 'technique',
    title: 'Kadwa Handloom Interlock',
    category: 'Technique',
    description: 'Each floral motif is individually engraved and woven by hand shuttle without leaving loose cut threads on the reverse side.',
    pos: [0.8, 0.2, 0.7],
  },
  {
    id: 'pattern',
    title: 'Kalka & Jangla Floral Motifs',
    category: 'Pattern Geometry',
    description: 'Mathematical Paisley (Kalka) curve motifs preserved through generationally inherited graph notations (Naksha).',
    pos: [-0.7, -0.4, 0.8],
  },
  {
    id: 'cultural',
    title: 'GI Cluster Authenticity',
    category: 'Cultural Context',
    description: 'Geographically anchored to the weaving guild, conforming to GI Registry verification specifications.',
    pos: [0, -1.1, 0.6],
  },
];

interface Heritage3DViewerProps {
  hotspots?: Hotspot[];
  modelType?: string | null;
  accentColor?: string;
  title?: string;
  height?: string;
}

export default function Heritage3DViewer({
  hotspots = DEFAULT_HOTSPOTS,
  modelType,
  accentColor = '#b15f2c',
  title = 'Interactive 3D Cultural Inspection',
  height = 'h-[460px]',
}: Heritage3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  const effectiveHotspots = hotspots && hotspots.length > 0 ? hotspots : DEFAULT_HOTSPOTS;

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffecd2, 1.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcfd8dc, 0.8);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    const accentLight = new THREE.PointLight(
      new THREE.Color(accentColor || '#cf8047').getHex(),
      2.5,
      10
    );
    accentLight.position.set(0, 2, 2);
    scene.add(accentLight);

    // Group for the 3D artifact
    const artifactGroup = new THREE.Group();

    // MODEL GEOMETRY BASED ON modelType
    if (modelType === 'BLUE_POTTERY_VASE') {
      // 1. Turquoise Glazed Vase
      const vaseGeo = new THREE.CylinderGeometry(0.7, 1.0, 2.2, 32);
      const vaseMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Turquoise
        roughness: 0.15,
        metalness: 0.1,
      });
      const vase = new THREE.Mesh(vaseGeo, vaseMat);
      artifactGroup.add(vase);

      // Cobalt Blue Neck
      const neckGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.8, 32);
      const neckMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a, // Deep Cobalt
        roughness: 0.1,
        metalness: 0.2,
      });
      const neck = new THREE.Mesh(neckGeo, neckMat);
      neck.position.y = 1.4;
      artifactGroup.add(neck);

      // Flared Lip
      const lipGeo = new THREE.TorusGeometry(0.55, 0.08, 16, 64);
      const lipMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
      const lip = new THREE.Mesh(lipGeo, lipMat);
      lip.rotation.x = Math.PI / 2;
      lip.position.y = 1.8;
      artifactGroup.add(lip);
    } else if (modelType === 'KATH_KUNI_STRUCTURE') {
      // Interlocked Timber & Stone Tower
      const baseGeo = new THREE.BoxGeometry(2.0, 1.2, 2.0);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = -0.6;
      artifactGroup.add(base);

      // Upper Timber Balcony
      const balconyGeo = new THREE.BoxGeometry(2.4, 1.0, 2.4);
      const balconyMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.6 });
      const balcony = new THREE.Mesh(balconyGeo, balconyMat);
      balcony.position.y = 0.5;
      artifactGroup.add(balcony);

      // Pyramidal Slate Roof
      const roofGeo = new THREE.ConeGeometry(2.1, 0.9, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 1.4;
      artifactGroup.add(roof);
    } else if (modelType === 'CHAND_BAORI_MODEL') {
      // Inverted Stepped Basin Tiers
      for (let i = 0; i < 4; i++) {
        const size = 2.4 - i * 0.45;
        const tierGeo = new THREE.BoxGeometry(size, 0.35, size);
        const tierMat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0x9a3412 : 0x7c2d12,
          roughness: 0.8,
        });
        const tier = new THREE.Mesh(tierGeo, tierMat);
        tier.position.y = 0.7 - i * 0.45;
        artifactGroup.add(tier);
      }
    } else if (modelType === 'SANJHI_SCREEN') {
      // Delicate Cutwork Screen Panel
      const screenGeo = new THREE.BoxGeometry(2.2, 2.8, 0.08);
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.5,
        transparent: true,
        opacity: 0.9,
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      artifactGroup.add(screen);

      // Frame Border
      const frameGeo = new THREE.BoxGeometry(2.4, 3.0, 0.12);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.4 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.z = -0.05;
      artifactGroup.add(frame);
    } else {
      // Default: Classical Vessel with Gold Rings
      const vesselGeo = new THREE.CylinderGeometry(0.8, 1.1, 2.4, 32);
      const vesselMat = new THREE.MeshStandardMaterial({
        color: 0x1f1f1f,
        roughness: 0.35,
        metalness: 0.75,
      });
      const vessel = new THREE.Mesh(vesselGeo, vesselMat);
      artifactGroup.add(vessel);

      // Metallic Rings
      for (let y = -0.9; y <= 0.9; y += 0.45) {
        const ringGeo = new THREE.TorusGeometry(y === 0 ? 1.05 : 0.92, 0.04, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xcf8047,
          roughness: 0.2,
          metalness: 0.9,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        artifactGroup.add(ring);
      }

      // Top Crown
      const crownGeo = new THREE.ConeGeometry(0.65, 0.7, 32);
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xb15f2c,
        roughness: 0.25,
        metalness: 0.85,
      });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = 1.5;
      artifactGroup.add(crown);
    }

    // Hotspot Markers (Spheres)
    const markerGroup = new THREE.Group();
    effectiveHotspots.forEach((spot) => {
      const mGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const mMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mMesh = new THREE.Mesh(mGeo, mMat);
      mMesh.position.set(...spot.pos);

      // Halo
      const haloGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentColor || '#cf8047').getHex(),
        transparent: true,
        opacity: 0.4,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      mMesh.add(haloMesh);

      mMesh.userData = { id: spot.id };
      markerGroup.add(mMesh);
    });
    artifactGroup.add(markerGroup);

    scene.add(artifactGroup);

    // Mouse & Touch Interaction Handlers
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };

    const onStart = (x: number, y: number) => {
      isDragging = true;
      prevPos = { x, y };
    };

    const onMove = (x: number, y: number) => {
      if (!isDragging) return;
      const deltaX = x - prevPos.x;
      const deltaY = y - prevPos.y;

      artifactGroup.rotation.y += deltaX * 0.01;
      artifactGroup.rotation.x += deltaY * 0.01;

      prevPos = { x, y };
    };

    const onEnd = () => {
      isDragging = false;
    };

    // Desktop Mouse Events
    const onMouseDown = (e: MouseEvent) => onStart(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onMouseUp = () => onEnd();

    // Touch Events
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => onEnd();

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.min(Math.max(camera.position.z + e.deltaY * 0.003, 2.5), 7.0);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    container.addEventListener('wheel', onWheel, { passive: false });

    // Raycasting for Hotspot Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerGroup.children, true);

      if (intersects.length > 0) {
        let hitMesh = intersects[0].object;
        while (hitMesh.parent && !hitMesh.userData.id) {
          hitMesh = hitMesh.parent as THREE.Mesh;
        }
        const hitId = hitMesh.userData.id;
        const targetSpot = effectiveHotspots.find((s) => s.id === hitId);
        if (targetSpot) {
          setActiveHotspot(targetSpot);
        }
      }
    };

    container.addEventListener('click', onClick);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        artifactGroup.rotation.y += 0.004;
      }

      // Marker pulse scale
      const time = Date.now() * 0.003;
      markerGroup.children.forEach((m, idx) => {
        const scale = 1.0 + Math.sin(time + idx) * 0.15;
        m.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [effectiveHotspots, modelType, accentColor, isRotating]);

  return (
    <div className="rounded-3xl border border-[#e6e5e2] bg-[#0a0a0a] text-white p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-6">
      {/* 3D Canvas Area */}
      <div className="flex-1 min-h-[380px] sm:min-h-[440px] relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#141414] to-[#0a0a0a] flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Controls */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition ${
              isRotating
                ? 'bg-white/20 text-white border-white/30'
                : 'bg-black/60 text-white/70 border-white/10'
            }`}
          >
            {isRotating ? '⏸ Pause Spin' : '▶ Auto Spin'}
          </button>
          <span className="text-[10px] text-white/50 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline-block">
            🖐️ Drag to inspect 360°
          </span>
        </div>

        {/* Hotspot Dots Indicator Pill */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/60 pointer-events-none z-10">
          <span className="bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10">
            {effectiveHotspots.length} Material & Structural Hotspots
          </span>
          <span className="bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10 text-[11px]">
            Tap glowing pins for details
          </span>
        </div>
      </div>

      {/* Hotspots Sidebar / Detail Drawer */}
      <div className="w-full md:w-80 flex flex-col justify-between space-y-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              3D Structural DNA
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-3 leading-snug">{title}</h3>

          {/* Hotspots Accordion / Button List */}
          <div className="space-y-2">
            {effectiveHotspots.map((spot) => {
              const isActive = activeHotspot?.id === spot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveHotspot(spot)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-white/15 border-white text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-white/50 mb-0.5">
                    <span>{spot.category}</span>
                    {isActive && <span className="text-[#cf8047]">Active Pin ●</span>}
                  </div>
                  <h4 className="text-xs font-bold text-white">{spot.title}</h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Hotspot Deep Dive Card */}
        {activeHotspot && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#cf8047]">
                {activeHotspot.category} Detail
              </span>
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                className="text-[10px] text-white/50 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <h4 className="font-bold text-sm text-white">{activeHotspot.title}</h4>
            <p className="text-white/80 text-[11px] leading-relaxed">{activeHotspot.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
