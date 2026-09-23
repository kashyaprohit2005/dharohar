"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { HeritageMarker } from "./IndiaMap";
import { CulturalEventData } from "./EventCard";
import { 
  Sparkles, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  MapPin, 
  Compass,
  Info,
  Calendar,
  Flame,
  HandMetal
} from "lucide-react";

// India Geographic Coordinate Extents (Strict Bounds)
const INDIA_BOUNDS = {
  minLon: 68.0,
  maxLon: 97.5,
  minLat: 6.5,
  maxLat: 37.5,
  centerLon: (68.0 + 97.5) / 2, // ~82.75
  centerLat: (6.5 + 37.5) / 2, // ~22.0
};

// Projection Scale Factor
const MAP_SCALE = 0.72;

// Convert [lon, lat] to 3D Plane coordinates
export function geoTo3D(lon: number, lat: number): [number, number] {
  const x = (lon - INDIA_BOUNDS.centerLon) * MAP_SCALE;
  // Invert Y so North is -Z in 3D world space
  const z = -(lat - INDIA_BOUNDS.centerLat) * MAP_SCALE * 1.06;
  return [x, z];
}

// Regional state color assignment
function getStateThemeColor(name: string): { base: string; depth: string } {
  const n = name.toLowerCase();
  // North
  if (n.includes("kashmir") || n.includes("ladakh") || n.includes("himachal") || n.includes("uttarakhand") || n.includes("punjab") || n.includes("haryana") || n.includes("delhi") || n.includes("chandigarh")) {
    return { base: "#1e3a8a", depth: "#172554" }; // Indigo
  }
  // West
  if (n.includes("rajasthan") || n.includes("gujarat") || n.includes("maharashtra") || n.includes("goa") || n.includes("daman")) {
    return { base: "#b15f2c", depth: "#8c3b1a" }; // Terracotta
  }
  // South
  if (n.includes("tamil") || n.includes("kerala") || n.includes("karnataka") || n.includes("andhra") || n.includes("telangana") || n.includes("puducherry") || n.includes("lakshadweep")) {
    return { base: "#0f766e", depth: "#115e59" }; // Deep Emerald
  }
  // Northeast
  if (n.includes("assam") || n.includes("sikkim") || n.includes("arunachal") || n.includes("nagaland") || n.includes("manipur") || n.includes("meghalaya") || n.includes("mizoram") || n.includes("tripura")) {
    return { base: "#166534", depth: "#14532d" }; // Forest Emerald
  }
  // Central & East
  if (n.includes("uttar pradesh") || n.includes("madhya") || n.includes("bihar")) {
    return { base: "#d48b28", depth: "#92400e" }; // Brass
  }
  return { base: "#c97a22", depth: "#78350f" }; // Parchment Ochre
}

export interface India3DMapProps {
  heritage?: HeritageMarker[];
  events?: CulturalEventData[];
  selectedState?: string;
  activeHeritageId?: number | null;
  onSelectState?: (stateName: string) => void;
  onSelectHeritage?: (id: number) => void;
  onSelectEvent?: (event: CulturalEventData) => void;
  height?: string;
  className?: string;
}

export default function India3DMap({
  heritage = [],
  events = [],
  selectedState = "ALL",
  activeHeritageId,
  onSelectState,
  onSelectHeritage,
  onSelectEvent,
  height = "620px",
  className = "",
}: India3DMapProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // References for Three.js internals
  const stateMeshesRef = useRef<Map<string, { mesh: THREE.Mesh; edges: THREE.LineSegments; center: [number, number] }>>(new Map());
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 620;

    // Scene: Warm Heritage Ivory Canvas (#FAF6EE)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#FAF6EE");
    scene.fog = new THREE.FogExp2("#FAF6EE", 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.5, 120);
    camera.position.set(0, 22, 17);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Orbit Controls with Strict Clamping to India & Touch Support
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 8.5; // Prevent clipping too close
    controls.maxDistance = 27.0; // Prevent zooming out to world view
    controls.minPolarAngle = Math.PI * 0.12; // Top-down angle
    controls.maxPolarAngle = Math.PI * 0.44; // Angled perspective, cannot view from below
    controls.target.set(0, 0, 0);

    // Multi-touch gestures: single-finger drag (pan), two-finger pinch-to-zoom
    controls.touches = {
      ONE: THREE.TOUCH.PAN,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controlsRef.current = controls;

    // Lighting: Warm golden museum daylight
    const ambientLight = new THREE.AmbientLight("#FFFDF7", 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#FFFBEB", 2.2);
    sunLight.position.set(16, 26, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0008;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight("#F59E0B", 0.7);
    rimLight.position.set(-18, 14, -16);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight("#D97706", 0.5, 35);
    bottomGlow.position.set(0, 3, 0);
    scene.add(bottomGlow);

    // Base Pedestal / Sandstone Parchment Plate
    const basePlateGeo = new THREE.CylinderGeometry(15.5, 16.5, 0.4, 64);
    const basePlateMat = new THREE.MeshStandardMaterial({
      color: "#EDE5D8",
      roughness: 0.85,
      metalness: 0.1,
    });
    const basePlate = new THREE.Mesh(basePlateGeo, basePlateMat);
    basePlate.position.set(0, -0.28, 0);
    basePlate.receiveShadow = true;
    scene.add(basePlate);

    // Concentric golden decorative rings on base
    [10, 13, 15.2].forEach((radius) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.03, 64);
      const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: "#D97706", side: THREE.DoubleSide, transparent: true, opacity: 0.35 }));
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = -0.06;
      scene.add(ringMesh);
    });

    // Group for states
    const statesGroup = new THREE.Group();
    scene.add(statesGroup);

    // Group for pins
    const pinsGroup = new THREE.Group();
    scene.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    // Fetch and build 3D Extruded India States
    fetch("/india_states_3d.json")
      .then((res) => res.json())
      .then((geoJson) => {
        const meshesMap = stateMeshesRef.current;
        meshesMap.clear();

        geoJson.features.forEach((feature: any) => {
          const stateName = feature.properties.name || "Unknown";
          const { base, depth } = getStateThemeColor(stateName);

          const shapes: THREE.Shape[] = [];
          let centerSumX = 0;
          let centerSumZ = 0;
          let pointCount = 0;

          const polyCoords = feature.geometry.coordinates; // MultiPolygon
          polyCoords.forEach((polygon: any) => {
            const exterior = polygon[0];
            if (!exterior || exterior.length < 3) return;

            const shape = new THREE.Shape();
            exterior.forEach(([lon, lat]: [number, number], i: number) => {
              const [x, z] = geoTo3D(lon, lat);
              centerSumX += x;
              centerSumZ += z;
              pointCount++;

              if (i === 0) {
                shape.moveTo(x, -z);
              } else {
                shape.lineTo(x, -z);
              }
            });

            // Handle interior holes if any
            for (let h = 1; h < polygon.length; h++) {
              const hole = polygon[h];
              if (hole.length < 3) continue;
              const holePath = new THREE.Path();
              hole.forEach(([lon, lat]: [number, number], hi: number) => {
                const [x, z] = geoTo3D(lon, lat);
                if (hi === 0) holePath.moveTo(x, -z);
                else holePath.lineTo(x, -z);
              });
              shape.holes.push(holePath);
            }

            shapes.push(shape);
          });

          if (shapes.length === 0) return;

          // Extrude Geometry
          const extrudeSettings: THREE.ExtrudeGeometryOptions = {
            depth: 0.42,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.02,
            bevelSegments: 1,
          };

          const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
          geometry.rotateX(-Math.PI / 2);

          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(base),
            roughness: 0.55,
            metalness: 0.25,
            flatShading: false,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData = {
            stateName,
            baseColor: base,
            depthColor: depth,
            type: "state",
          };

          // State boundary outline wireframe
          const edgesGeo = new THREE.EdgesGeometry(geometry, 28);
          const edgesMat = new THREE.LineBasicMaterial({
            color: new THREE.Color("#fbbf24"),
            transparent: true,
            opacity: 0.35,
          });
          const edges = new THREE.LineSegments(edgesGeo, edgesMat);
          mesh.add(edges);

          statesGroup.add(mesh);

          const avgCenterX = pointCount > 0 ? centerSumX / pointCount : 0;
          const avgCenterZ = pointCount > 0 ? centerSumZ / pointCount : 0;
          meshesMap.set(stateName.toLowerCase(), {
            mesh,
            edges,
            center: [avgCenterX, avgCenterZ],
          });
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load India 3D GeoJSON:", err);
        setLoading(false);
      });

    // Raycasting for Hover and Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;
    let hoveredPinGroup: THREE.Group | null = null;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePos({ x: e.clientX, y: e.clientY });

      raycaster.setFromCamera(mouse, camera);

      // Check pin intersections first (pins take precedence)
      const pinIntersects = raycaster.intersectObjects(pinsGroup.children, true);
      if (pinIntersects.length > 0) {
        let pinHolder: THREE.Object3D | null = pinIntersects[0].object;
        while (pinHolder && pinHolder.parent !== pinsGroup) {
          pinHolder = pinHolder.parent;
        }

        if (pinHolder && pinHolder.userData && pinHolder.userData.item) {
          if (hoveredPinGroup !== pinHolder) {
            if (hoveredPinGroup) hoveredPinGroup.scale.set(1, 1, 1);
            hoveredPinGroup = pinHolder as THREE.Group;
            hoveredPinGroup.scale.set(1.35, 1.35, 1.35);
          }
          const item = pinHolder.userData.item;
          setHoveredMarker({
            title: item.name || item.title,
            type: pinHolder.userData.type,
            location: item.state || item.city,
            category: item.category || (pinHolder.userData.type === "event" ? "Live Event" : "Living Tradition"),
            has3D: item.has_3d,
          });
          setHoveredState(null);
          renderer.domElement.style.cursor = "pointer";
          return;
        }
      } else {
        if (hoveredPinGroup) {
          hoveredPinGroup.scale.set(1, 1, 1);
          hoveredPinGroup = null;
          setHoveredMarker(null);
        }
      }

      // Check state mesh intersections
      const stateIntersects = raycaster.intersectObjects(statesGroup.children, true);
      if (stateIntersects.length > 0) {
        let hit = stateIntersects[0].object as THREE.Mesh;
        while (hit.parent && hit.parent !== statesGroup) {
          hit = hit.parent as THREE.Mesh;
        }

        if (hit && hit.userData && hit.userData.stateName) {
          if (hoveredMesh !== hit) {
            if (hoveredMesh) {
              const prevMat = hoveredMesh.material as THREE.MeshStandardMaterial;
              prevMat.color.set(hoveredMesh.userData.baseColor);
              prevMat.emissive.set("#000000");
              hoveredMesh.position.y = 0;
            }

            hoveredMesh = hit;
            const mat = hit.material as THREE.MeshStandardMaterial;
            mat.color.set("#f59e0b"); // Golden brass highlight
            mat.emissive.set("#78350f");
            hit.position.y = 0.12; // Subtle physical elevation
            setHoveredState(hit.userData.stateName);
            setHoveredMarker(null);
            renderer.domElement.style.cursor = "pointer";
          }
          return;
        }
      }

      // No intersection
      if (hoveredMesh) {
        const prevMat = hoveredMesh.material as THREE.MeshStandardMaterial;
        prevMat.color.set(hoveredMesh.userData.baseColor);
        prevMat.emissive.set("#000000");
        hoveredMesh.position.y = 0;
        hoveredMesh = null;
        setHoveredState(null);
        renderer.domElement.style.cursor = "grab";
      }
    };

    const handlePointerDown = () => {
      renderer.domElement.style.cursor = "grabbing";
    };

    const handlePointerUp = (e: MouseEvent) => {
      renderer.domElement.style.cursor = "grab";
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check pins click
      const pinIntersects = raycaster.intersectObjects(pinsGroup.children, true);
      if (pinIntersects.length > 0) {
        let pinHolder: THREE.Object3D | null = pinIntersects[0].object;
        while (pinHolder && pinHolder.parent !== pinsGroup) {
          pinHolder = pinHolder.parent;
        }
        if (pinHolder && pinHolder.userData && pinHolder.userData.item) {
          const item = pinHolder.userData.item;
          if (pinHolder.userData.type === "heritage" && onSelectHeritage) {
            onSelectHeritage(item.id);
          } else if (pinHolder.userData.type === "event" && onSelectEvent) {
            onSelectEvent(item);
          }
          if (item.state && onSelectState) {
            onSelectState(item.state);
          }
          return;
        }
      }

      // Check state click
      const stateIntersects = raycaster.intersectObjects(statesGroup.children, true);
      if (stateIntersects.length > 0) {
        let hit = stateIntersects[0].object as THREE.Mesh;
        while (hit.parent && hit.parent !== statesGroup) {
          hit = hit.parent as THREE.Mesh;
        }

        if (hit && hit.userData && hit.userData.stateName) {
          const selectedName = hit.userData.stateName;
          if (onSelectState) {
            onSelectState(selectedName);
          }
        }
      }
    };

    renderer.domElement.addEventListener("mousemove", handlePointerMove);
    renderer.domElement.addEventListener("mousedown", handlePointerDown);
    renderer.domElement.addEventListener("mouseup", handlePointerUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Camera focal transition smooth lerp
      if (targetCamPosRef.current && targetLookAtRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.06);
        controls.target.lerp(targetLookAtRef.current, 0.06);

        if (camera.position.distanceTo(targetCamPosRef.current) < 0.1) {
          targetCamPosRef.current = null;
          targetLookAtRef.current = null;
        }
      }

      // STRICT CLAMPING: Lock camera position and controls target strictly to India
      const maxExtentX = 11.5;
      const maxExtentZ = 12.0;
      controls.target.x = Math.max(-maxExtentX, Math.min(maxExtentX, controls.target.x));
      controls.target.z = Math.max(-maxExtentZ, Math.min(maxExtentZ, controls.target.z));
      controls.target.y = 0; // Lock ground height

      camera.position.x = Math.max(-maxExtentX - 8, Math.min(maxExtentX + 8, camera.position.x));
      camera.position.z = Math.max(-maxExtentZ - 8, Math.min(maxExtentZ + 8, camera.position.z));
      camera.position.y = Math.max(7.5, Math.min(28.0, camera.position.y));

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("mousemove", handlePointerMove);
      renderer.domElement.removeEventListener("mousedown", handlePointerDown);
      renderer.domElement.removeEventListener("mouseup", handlePointerUp);
      renderer.dispose();
    };
  }, [onSelectState, onSelectHeritage, onSelectEvent]);

  // Update 3D Pins strictly on user interaction (Section 9: Zero clutter at All-India level)
  useEffect(() => {
    const pinsGroup = pinsGroupRef.current;
    if (!pinsGroup) return;

    while (pinsGroup.children.length > 0) {
      const obj = pinsGroup.children[0];
      pinsGroup.remove(obj);
    }

    // At All-India level: SHOW STATE POLYGONS ONLY (Zero markers before interaction)
    if (!selectedState || selectedState === "ALL") {
      return;
    }

    const stateLower = selectedState.toLowerCase();
    const relevantHeritage = heritage.filter(
      (h) => h.state && h.state.toLowerCase().includes(stateLower)
    );

    // Heritage Traditions Pins for selected state/district
    relevantHeritage.forEach((h) => {
      if (!h.lat || !h.lon) return;
      const [x, z] = geoTo3D(h.lon, h.lat);

      const pinHolder = new THREE.Group();
      pinHolder.position.set(x, 0.44, z);

      const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8);
      const stemMat = new THREE.MeshStandardMaterial({
        color: "#d48b28",
        metalness: 0.8,
        roughness: 0.2,
      });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.225;
      pinHolder.add(stem);

      const isSelected = h.id === activeHeritageId;
      const headGeo = new THREE.SphereGeometry(isSelected ? 0.22 : 0.15, 16, 16);
      const headColor = h.has_3d ? "#f59e0b" : h.category.toLowerCase().includes("craft") ? "#b15f2c" : "#0f766e";
      const headMat = new THREE.MeshStandardMaterial({
        color: headColor,
        emissive: isSelected ? headColor : "#000000",
        metalness: 0.3,
        roughness: 0.4,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.45;
      pinHolder.add(head);

      pinHolder.userData = {
        type: "heritage",
        item: h,
      };

      pinsGroup.add(pinHolder);
    });

    // Live Cultural Events Pins (strictly for selected state - Section 16)
    const relevantEvents = events.filter(
      (ev) => ev.state && ev.state.toLowerCase().includes(stateLower)
    );
    relevantEvents.forEach((ev) => {
      if (!ev.lat || !ev.lon) return;
      const [x, z] = geoTo3D(ev.lon, ev.lat);

      const eventHolder = new THREE.Group();
      eventHolder.position.set(x, 0.44, z);

      const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.55, 8);
      const stemMat = new THREE.MeshStandardMaterial({
        color: "#dc2626",
        metalness: 0.7,
        roughness: 0.3,
      });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.275;
      eventHolder.add(stem);

      const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({
        color: "#ef4444",
        emissive: "#b91c1c",
        metalness: 0.2,
        roughness: 0.3,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.55;
      eventHolder.add(head);

      eventHolder.userData = {
        type: "event",
        item: ev,
      };

      pinsGroup.add(eventHolder);
    });
  }, [heritage, events, activeHeritageId, selectedState]);

  // Smooth camera focal transitions when selectedState changes
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;

    if (!selectedState || selectedState === "ALL") {
      // Overview perspective
      targetCamPosRef.current = new THREE.Vector3(0, 22, 17);
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
      return;
    }

    const key = selectedState.toLowerCase().trim();
    let targetCenter: [number, number] | null = null;

    for (const [sKey, info] of stateMeshesRef.current.entries()) {
      if (sKey === key || sKey.includes(key) || key.includes(sKey)) {
        targetCenter = info.center;
        break;
      }
    }

    if (targetCenter) {
      const [cx, cz] = targetCenter;
      targetCamPosRef.current = new THREE.Vector3(cx, 11, cz + 10);
      targetLookAtRef.current = new THREE.Vector3(cx, 0.4, cz);
    }
  }, [selectedState]);

  // Reset view to full India overview
  const handleResetView = () => {
    if (onSelectState) onSelectState("ALL");
    targetCamPosRef.current = new THREE.Vector3(0, 22, 17);
    targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.y = Math.max(8.5, cameraRef.current.position.y - 3);
    cameraRef.current.position.z = Math.max(5.0, cameraRef.current.position.z - 2.5);
  };

  const handleZoomOut = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.y = Math.min(26.0, cameraRef.current.position.y + 3);
    cameraRef.current.position.z = Math.min(22.0, cameraRef.current.position.z + 2.5);
  };

  return (
    <div 
      className={`relative w-full rounded-3xl overflow-hidden bg-stone-950 border border-stone-800/80 shadow-2xl select-none ${className}`}
      style={{ height }}
    >
      {/* 3D WebGL Canvas Mount */}
      <div 
        ref={mountRef} 
        className="w-full h-full touch-pan-x touch-pan-y outline-none"
        style={{ touchAction: "pan-x pan-y" }}
      />

      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping"></div>
            <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="font-serif text-amber-200 text-sm tracking-wide">
            Extruding 3D India Cultural Atlas...
          </p>
          <span className="text-xs text-stone-500 font-mono">Survey of India Boundaries</span>
        </div>
      )}

      {/* Top Banner & State Indicators */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-900/80 text-amber-400 border border-amber-500/30 backdrop-blur-md shadow-lg pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>3D Cultural Atlas</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-stone-900/80 text-stone-300 border border-stone-800 backdrop-blur-md">
              Strict India Bounds [6.5°N - 37.5°N]
            </span>
          </div>

          {selectedState && selectedState !== "ALL" && (
            <div className="flex items-center gap-2 pt-1 pointer-events-auto">
              <span className="text-xs text-stone-400">Focused:</span>
              <span className="text-sm font-serif font-bold text-stone-100 bg-amber-600/30 px-2.5 py-0.5 rounded-lg border border-amber-500/40 backdrop-blur-sm">
                {selectedState}
              </span>
            </div>
          )}
        </div>

        {/* Floating Controls Bar */}
        <div className="flex flex-col gap-1.5 pointer-events-auto bg-stone-900/80 p-1.5 rounded-2xl border border-stone-800 backdrop-blur-md shadow-xl">
          <button
            onClick={handleZoomIn}
            title="Zoom in (+)"
            className="w-8 h-8 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom out (-)"
            className="w-8 h-8 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset to Full India View"
            className="w-8 h-8 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 flex items-center justify-center transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Tooltips: Marker Tooltip OR State Tooltip */}
      {hoveredMarker && !loading && (
        <div 
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4 p-3 rounded-2xl bg-stone-900/95 text-stone-100 text-xs border border-amber-500/50 shadow-2xl backdrop-blur-md max-w-xs space-y-1 transition-all duration-75"
          style={{
            left: `${mousePos.x - (mountRef.current?.getBoundingClientRect().left || 0)}px`,
            top: `${mousePos.y - (mountRef.current?.getBoundingClientRect().top || 0)}px`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${hoveredMarker.type === "event" ? "bg-rose-500 animate-ping" : "bg-amber-400 animate-pulse"}`}></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">{hoveredMarker.category}</span>
            {hoveredMarker.has3D && (
              <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/40">3D</span>
            )}
          </div>
          <div className="font-serif font-bold text-sm text-stone-50 leading-tight">{hoveredMarker.title}</div>
          <div className="text-[11px] text-stone-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-stone-500" />
            <span>{hoveredMarker.location}</span>
          </div>
        </div>
      )}

      {hoveredState && !hoveredMarker && !loading && (
        <div 
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-1.5 rounded-xl bg-stone-900/95 text-stone-100 text-xs font-semibold border border-amber-500/50 shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all duration-75"
          style={{
            left: `${mousePos.x - (mountRef.current?.getBoundingClientRect().left || 0)}px`,
            top: `${mousePos.y - (mountRef.current?.getBoundingClientRect().top || 0)}px`,
          }}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-serif font-bold text-stone-50">{hoveredState}</span>
          <span className="text-[10px] text-amber-300/80 font-mono">Tap for ODOP & Heritage</span>
        </div>
      )}

      {/* Bottom Gesture & Interaction Hint */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/80 text-stone-300 text-xs border border-stone-800/80 backdrop-blur-md shadow-lg pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Single-finger drag pan • Two-finger pinch zoom • Tap state to open Cultural Drawer</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/80 text-stone-400 text-[11px] border border-stone-800/80 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Camera strictly locked to Indian subcontinent</span>
        </div>
      </div>
    </div>
  );
}
