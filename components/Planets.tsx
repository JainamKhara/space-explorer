"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import {
  PLANETS,
  SUN_CONFIG,
  PlanetConfig,
  getKeplerianPosition,
} from "@/lib/celestialData";
import {
  atmosphereVertexShader,
  atmosphereFragmentShader,
} from "@/lib/shaders";
import { useSpaceStore, ScaleMode, SelectedObject } from "@/store/useSpaceStore";
import { useGravityEngine } from "@/hooks/useGravityEngine";
import SolarFlares from "./SolarFlares";

// Scale multiplier for planet radius
function getDisplayRadius(config: PlanetConfig, scaleMode: ScaleMode): number {
  if (scaleMode === "true") {
    return Math.max(0.12, config.radiusTrueRatio * 0.42);
  }
  if (scaleMode === "logarithmic") {
    return config.radiusLogarithmic;
  }
  return config.radius; // Calibrated default
}

function getSunDisplayRadius(scaleMode: ScaleMode): number {
  if (scaleMode === "true") return 10.0;
  if (scaleMode === "logarithmic") return 6.0;
  return SUN_CONFIG.radius; // 3.8
}

// Dynamic orbit radius calculation
function getOrbitRadius(config: PlanetConfig, scaleMode: ScaleMode): number {
  if (scaleMode === "true") {
    const sunRadius = 10.0;
    const baseMargin = sunRadius + 8.0;
    return baseMargin + (config.orbitRadius - 8) * 1.45;
  }
  if (scaleMode === "logarithmic") {
    const sunRadius = 6.0;
    return sunRadius + 7.0 + (config.orbitRadius - 8) * 1.2;
  }
  return config.orbitRadius;
}

// Subtle Glowing Selection Highlight & Clean Floating Name Tag
function SelectionHighlight({
  radius,
  name,
}: {
  radius: number;
  name: string;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      const pulse = 1 + Math.sin(t * 2) * 0.04;
      ringRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group raycast={() => null}>
      {/* Subtle Soft Glowing Ring around Planet */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[radius * 1.25, radius * 1.34, 64]} />
        <meshBasicMaterial
          color={new THREE.Color("#00d4ff")}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Sleek Floating Planet Name Tag */}
      <Html position={[0, radius + 1.2, 0]} center distanceFactor={18}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="flex items-center gap-1.5 bg-black/80 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-400/50 shadow-[0_0_15px_rgba(0,212,255,0.4)] backdrop-blur-md uppercase tracking-wider whitespace-nowrap font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {name}
          </div>
        </div>
      </Html>
    </group>
  );
}

// Individual ring system
// Realistic per-planet ring system (Saturn has wide brilliant rings, others have faint/thin rings)
function PlanetRingSystem({
  planetId,
  radius,
  ringColor,
}: {
  planetId: string;
  radius: number;
  ringColor?: string;
}) {
  let innerR = radius * 1.35;
  let outerR = radius * 2.6;
  let opacity = 0.8;
  let color = ringColor || "#d4a060";

  if (planetId === "jupiter") {
    innerR = radius * 1.12;
    outerR = radius * 1.22;
    opacity = 0.06; // Extremely faint, thin dust ring
  } else if (planetId === "uranus") {
    innerR = radius * 1.2;
    outerR = radius * 1.38;
    opacity = 0.16; // Narrow cyan ring
  } else if (planetId === "neptune") {
    innerR = radius * 1.15;
    outerR = radius * 1.28;
    opacity = 0.1; // Faint azure ring
  }

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, opacity]
  );

  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0]} material={material} raycast={() => null}>
      <ringGeometry args={[innerR, outerR, 128]} />
    </mesh>
  );
}

// Atmosphere glow shell (raycast disabled)
function Atmosphere({
  radius,
  color,
  intensity,
}: {
  radius: number;
  color: string;
  intensity: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    const material = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uIntensity: { value: intensity },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mesh = new THREE.Mesh(geo, material);
    mesh.raycast = () => null;
    mesh.scale.setScalar(1.25);
    const group = groupRef.current;
    group.add(mesh);
    return () => {
      geo.dispose();
      material.dispose();
      group.remove(mesh);
    };
  }, [radius, color, intensity]);

  return <group ref={groupRef} raycast={() => null} />;
}

// Moon
function Moon({
  moon,
  parentRef,
}: {
  moon: PlanetConfig["moons"][0];
  parentRef: React.RefObject<THREE.Group | null>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const moonAngleRef = useRef(0);

  useEffect(() => {
    moonAngleRef.current = Math.random() * Math.PI * 2;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(moon.color),
        roughness: 0.85,
        metalness: 0.1,
      }),
    [moon.color]
  );

  useFrame((_, delta) => {
    try {
      if (!meshRef.current || !parentRef.current) return;
      moonAngleRef.current += moon.orbitSpeed * delta * 0.3;
      const x = Math.cos(moonAngleRef.current) * moon.orbitRadius;
      const z = Math.sin(moonAngleRef.current) * moon.orbitRadius;
      meshRef.current.position.set(
        parentRef.current.position.x + x,
        parentRef.current.position.y,
        parentRef.current.position.z + z
      );
      meshRef.current.rotation.y += delta * 0.2;
    } catch (error) {
      console.error("❌ Moon useFrame error:", error, { moon: moon.name });
    }
  });

  return (
    <mesh ref={meshRef} material={material} raycast={() => null}>
      <sphereGeometry args={[moon.radius, 16, 16]} />
    </mesh>
  );
}

// Mathematically exact Keplerian orbital ellipse points
function getOrbitPathPoints(config: PlanetConfig, scaleMode: ScaleMode): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const steps = 256;
  const k = config.keplerian;
  
  if (!k || k.a === 0) return pts;
  
  const degToRad = Math.PI / 180;
  const orbitRadiusScale = getOrbitRadius(config, scaleMode);
  const scaleRatio = orbitRadiusScale / k.a;
  
  const e = k.e;
  const inc = k.i * degToRad;
  const node = k.node * degToRad;
  const w = (k.wBar - k.node) * degToRad;
  
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const r_AU = (k.a * (1 - e * e)) / (1 + e * Math.cos(theta));
    const u = w + theta;
    
    const X_AU = r_AU * (Math.cos(node) * Math.cos(u) - Math.sin(node) * Math.sin(u) * Math.cos(inc));
    const Z_AU = r_AU * (Math.sin(node) * Math.cos(u) + Math.cos(node) * Math.sin(u) * Math.cos(inc));
    const Y_AU = r_AU * (Math.sin(u) * Math.sin(inc));
    
    pts.push(new THREE.Vector3(X_AU * scaleRatio, Y_AU * scaleRatio, Z_AU * scaleRatio));
  }
  return pts;
}

// Clean, memoized Orbit Line component (raycast disabled)
function OrbitPath({
  config,
  isSelected,
  hovered,
  scaleMode,
}: {
  config: PlanetConfig;
  isSelected: boolean;
  hovered: boolean;
  scaleMode: ScaleMode;
}) {
  const geometry = useMemo(() => {
    const pts = getOrbitPathPoints(config, scaleMode);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [config, scaleMode]);

  const color = isSelected ? "#00d4ff" : hovered ? "#60a5fa" : "#3b82f6";
  const opacity = isSelected ? 0.9 : hovered ? 0.55 : 0.28;

  return (
    <lineLoop geometry={geometry} raycast={() => null}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineLoop>
  );
}

// Single planet component - smoothly glides between 3D Keplerian Orbit & Straight Line Alignment
function Planet({
  config,
  onClick,
}: {
  config: PlanetConfig;
  onClick: (config: PlanetConfig) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleMode = useSpaceStore((s) => s.scaleMode);
  const showOrbits = useSpaceStore((s) => s.showOrbits);
  const simDate = useSpaceStore((s) => s.simDate);
  const selectedObject = useSpaceStore((s) => s.selectedObject);
  const gravityEnabled = useSpaceStore((s) => s.gravityEnabled);

  const isSelected = selectedObject?.id === config.id;
  const displayRadius = useMemo(() => getDisplayRadius(config, scaleMode), [config, scaleMode]);
  const currentOrbitRadius = useMemo(() => getOrbitRadius(config, scaleMode), [config, scaleMode]);

  const [hovered, setHovered] = useState(false);
  const gravityBlendRef = useRef(gravityEnabled ? 1 : 0);

  // Perfect Straight Line Alignment Position on X-Axis when Gravity is OFF
  const straightLinePos = useMemo(
    () => new THREE.Vector3(currentOrbitRadius, 0, 0),
    [currentOrbitRadius]
  );

  const planetMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.color),
        emissive: new THREE.Color(config.emissive),
        emissiveIntensity: isSelected ? 0.85 : 0.35,
        roughness: config.roughness,
        metalness: config.metalness,
      }),
    [config, isSelected]
  );

  useFrame((_, delta) => {
    try {
      if (!groupRef.current || !meshRef.current) return;

      // Smoothly animate gravity blend between 0 (Gravity OFF) and 1 (Gravity ON)
      const targetBlend = gravityEnabled ? 1 : 0;
      gravityBlendRef.current = THREE.MathUtils.damp(
        gravityBlendRef.current,
        targetBlend,
        5,
        delta
      );
      const blend = gravityBlendRef.current;

      // 1. Position on 3D Keplerian Orbit ring (Gravity ON)
      const coords = getKeplerianPosition(config, simDate, currentOrbitRadius);
      const orbitPos = new THREE.Vector3(coords.x, coords.y, coords.z);
      
      // 2. Position on Perfect Straight Horizontal Line (Gravity OFF)
      const linePos = straightLinePos;

      // Smoothly lerp between straight horizontal line (blend = 0) and 3D Keplerian Orbit (blend = 1)
      groupRef.current.position.lerpVectors(linePos, orbitPos, blend);
      
      // Zero out axial tilt when gravity is OFF so all planets sit perfectly level along the line
      groupRef.current.rotation.z = config.tilt * blend;
      meshRef.current.rotation.y += config.rotationSpeed * delta * 0.5;
    } catch (error) {
      console.error("❌ Planet useFrame error:", error, { planet: config.name });
    }
  });

  return (
    <>
      {/* Visual Elliptical Orbit Path */}
      {showOrbits && (
        <OrbitPath
          config={config}
          isSelected={isSelected}
          hovered={hovered}
          scaleMode={scaleMode}
        />
      )}

      <group ref={groupRef} name={config.id} userData={{ id: config.id }}>
        <group
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={() => onClick(config)}
        >
          <mesh ref={meshRef} material={planetMaterial} castShadow receiveShadow>
            <sphereGeometry args={[displayRadius, 64, 64]} />
            {config.hasRings && (
              <PlanetRingSystem
                planetId={config.id}
                radius={displayRadius}
                ringColor={config.ringColor}
              />
            )}
          </mesh>

          {/* Dynamic glow intensity on hover or selection */}
          <Atmosphere
            radius={displayRadius}
            color={config.atmosphereColor}
            intensity={
              isSelected
                ? config.atmosphereIntensity * 2.2
                : hovered
                ? config.atmosphereIntensity * 1.5
                : config.atmosphereIntensity
            }
          />
        </group>

        {/* Subtle Glowing Ring & Floating Planet Name */}
        {isSelected && (
          <SelectionHighlight
            radius={displayRadius}
            name={config.name}
          />
        )}

        {/* Moons */}
        {config.moons.map((moon, i) => (
          <Moon key={i} moon={moon} parentRef={groupRef} />
        ))}
      </group>
    </>
  );
}

// The Central Star (The Sun) - Clean & Non-Blocking
function CentralStar({ onSelect }: { onSelect: (obj: PlanetConfig) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const scaleMode = useSpaceStore((s) => s.scaleMode);
  const selectedObject = useSpaceStore((s) => s.selectedObject);
  const isSelected = selectedObject?.id === SUN_CONFIG.id;

  const sunRadius = useMemo(() => getSunDisplayRadius(scaleMode), [scaleMode]);

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(SUN_CONFIG.color),
        emissive: new THREE.Color(SUN_CONFIG.emissive),
        emissiveIntensity: isSelected ? 3.5 : hovered ? 2.5 : 2.0,
        roughness: 0,
        metalness: 0,
      }),
    [isSelected, hovered]
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffaa22"),
        transparent: true,
        opacity: hovered || isSelected ? 0.22 : 0.08,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    [hovered, isSelected]
  );

  useFrame(({ clock }) => {
    try {
      if (!meshRef.current || !glowRef.current) return;
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y += 0.002;
      const pulse = 1 + Math.sin(t * 0.5) * 0.03;
      glowRef.current.scale.setScalar(pulse * (hovered || isSelected ? 1.4 : 1.25));
    } catch (error) {
      console.error("❌ CentralStar useFrame error:", error);
    }
  });

  return (
    <group name={SUN_CONFIG.id} userData={{ id: SUN_CONFIG.id }}>
      <pointLight
        color="#ffdd88"
        intensity={800}
        distance={400}
        decay={1.5}
        castShadow
      />
      
      {/* Solar Flares prominence effect (raycasting disabled) */}
      <SolarFlares />

      {/* Core Sun Mesh (The ONLY mesh that receives clicks for the Sun) */}
      <group
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={() => onSelect(SUN_CONFIG)}
      >
        <mesh ref={meshRef} material={coreMaterial}>
          <sphereGeometry args={[sunRadius, 64, 64]} />
        </mesh>
      </group>

      {/* Visual Glow Shell (Raycasting disabled) */}
      <mesh ref={glowRef} material={glowMaterial} raycast={() => null}>
        <sphereGeometry args={[sunRadius, 32, 32]} />
      </mesh>

      {/* Subtle Selection Highlight for Sun */}
      {isSelected && (
        <SelectionHighlight
          radius={sunRadius}
          name={SUN_CONFIG.name}
        />
      )}

      <pointLight color="#ff6600" intensity={80} distance={30} decay={2} />
    </group>
  );
}

export default function Planets() {
  const setSelectedObject = useSpaceStore((s) => s.setSelectedObject);
  const simDate = useSpaceStore((s) => s.simDate);
  const setSimDate = useSpaceStore((s) => s.setSimDate);
  const isPlaying = useSpaceStore((s) => s.isPlaying);
  const simSpeed = useSpaceStore((s) => s.simSpeed);
  const scaleMode = useSpaceStore((s) => s.scaleMode);

  // Time evolution loop driven by R3F frame rate
  useFrame((_, delta) => {
    if (isPlaying && simSpeed > 0) {
      const daysToAdd = delta * simSpeed * 0.5;
      const newTime = simDate.getTime() + daysToAdd * 86400 * 1000;
      setSimDate(new Date(newTime));
    }
  });

  const handleSelect = (config: PlanetConfig) => {
    const currentOrbitRadius = getOrbitRadius(config, scaleMode);
    const currentCoords = getKeplerianPosition(config, simDate, currentOrbitRadius);
    const distStr = config.id === "sun" ? "0 AU (Center)" : `${currentCoords.distanceAU.toFixed(3)} AU`;

    const selectedPayload: SelectedObject = {
      id: config.id,
      name: config.name,
      type: config.type,
      tagline: config.tagline,
      description: config.description,
      distance: distStr,
      color: config.color,
      emissive: config.emissive,
      atmosphereColor: config.atmosphereColor,
      stats: config.stats,
      atmosphereGases: config.atmosphereGases,
      missions: config.missions,
      trivia: config.trivia,
      moons: config.moons,
      config: config,
    };

    setSelectedObject(selectedPayload);
  };

  return (
    <group name="planets">
      <CentralStar onSelect={handleSelect} />
      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          config={planet}
          onClick={handleSelect}
        />
      ))}
    </group>
  );
}
