"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANETS, PlanetConfig } from "@/lib/celestialData";
import {
  atmosphereVertexShader,
  atmosphereFragmentShader,
} from "@/lib/shaders";
import { useSpaceStore } from "@/store/useSpaceStore";
import { useGravityEngine } from "@/hooks/useGravityEngine";
import SolarFlares from "./SolarFlares";

// Individual ring system
function PlanetRings({
  innerR,
  outerR,
  color,
  opacity,
}: {
  innerR: number;
  outerR: number;
  color: string;
  opacity: number;
}) {
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
    <mesh rotation={[Math.PI / 2.2, 0, 0]} material={material}>
      <ringGeometry args={[innerR, outerR, 128]} />
    </mesh>
  );
}

// Atmosphere glow shell
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
    mesh.scale.setScalar(1.25);
    const group = groupRef.current;
    group.add(mesh);
    return () => {
      geo.dispose();
      material.dispose();
      group.remove(mesh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <group ref={groupRef} />;
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
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[moon.radius, 16, 16]} />
    </mesh>
  );
}

// Single planet
function Planet({
  config,
  onClick,
}: {
  config: PlanetConfig;
  onClick: (config: PlanetConfig) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitAngleRef = useRef(0);
  const { updatePlanetPosition, gravityBlendRef } = useGravityEngine();
  const showOrbits = useSpaceStore((s) => s.showOrbits);

  const zeroGVelocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const basePositionRef = useRef(new THREE.Vector3(config.orbitRadius, 0, 0));

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    orbitAngleRef.current = Math.random() * Math.PI * 2;
    zeroGVelocityRef.current.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 1,
      (Math.random() - 0.5) * 2
    );
  }, []);

  const planetMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.color),
        emissive: new THREE.Color(config.emissive),
        emissiveIntensity: 0.3,
        roughness: config.roughness,
        metalness: config.metalness,
      }),
    [config]
  );

  const orbitLineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0x334466,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
      }),
    []
  );

  const orbitLine = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * config.orbitRadius,
          Math.sin(a) * config.orbitRadius * Math.sin(config.orbitInclination),
          Math.sin(a) * config.orbitRadius * Math.cos(config.orbitInclination)
        )
      );
    }
    return { points: pts };
  }, [config]);

  useFrame((state, delta) => {
    try {
      if (!groupRef.current || !meshRef.current) return;

      const speed = config.orbitSpeed * 0.2;
      const blend = gravityBlendRef.current;
      
      const { angle, x, y, z } = updatePlanetPosition(
        {
          orbitAngle: orbitAngleRef.current,
          orbitRadius: config.orbitRadius,
          orbitInclination: config.orbitInclination,
        },
        delta,
        speed,
        blend
      );
      orbitAngleRef.current = angle;

      const orbitPos = new THREE.Vector3(x, y, z);
      
      // Zero-G drift calculation
      if (blend < 1) {
        basePositionRef.current.add(
          zeroGVelocityRef.current.clone().multiplyScalar(delta * 0.1)
        );
        // Soft boundary for Zero-G drift
        if (basePositionRef.current.length() > config.orbitRadius * 2) {
          zeroGVelocityRef.current.negate();
        }
      }

      groupRef.current.position.lerpVectors(basePositionRef.current, orbitPos, blend);
      meshRef.current.rotation.y += config.rotationSpeed * delta * 0.5;
    } catch (error) {
      console.error("❌ Planet useFrame error:", error, { planet: config.name });
    }
  });

  return (
    <>
      {/* Visual Orbit Path - Anchored at origin */}
      {showOrbits && (
        <primitive
          object={
            new THREE.LineLoop(
              new THREE.BufferGeometry().setFromPoints(orbitLine.points),
              orbitLineMaterial
            )
          }
        />
      )}

      <group ref={groupRef}>
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
            <sphereGeometry args={[config.radius, 64, 64]} />
            {config.hasRings && (
              <PlanetRings
                innerR={config.ringInnerRadius!}
                outerR={config.ringOuterRadius!}
                color={config.ringColor!}
                opacity={config.ringOpacity!}
              />
            )}
          </mesh>

          {/* Dynamic glow intensity on hover */}
          <Atmosphere
            radius={config.radius}
            color={config.atmosphereColor}
            intensity={
              hovered
                ? config.atmosphereIntensity * 1.5
                : config.atmosphereIntensity
            }
          />
        </group>

        {/* Moons - Children of the planet group */}
        {config.moons.map((moon, i) => (
          <Moon key={i} moon={moon} parentRef={groupRef} />
        ))}
      </group>
    </>
  );
}

// The Central Star (Sun)
function CentralStar() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffdd88"),
        emissive: new THREE.Color("#ffaa44"),
        emissiveIntensity: 2,
        roughness: 0,
        metalness: 0,
      }),
    []
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffaa22"),
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    []
  );

  useFrame(({ clock }) => {
    try {
      if (!meshRef.current || !glowRef.current) return;
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y += 0.002;
      const pulse = 1 + Math.sin(t * 0.5) * 0.03;
      glowRef.current.scale.setScalar(pulse * 3.5);
    } catch (error) {
      console.error("❌ CentralStar useFrame error:", error);
    }
  });

  return (
    <group>
      <pointLight
        color="#ffdd88"
        intensity={800}
        distance={300}
        decay={1.5}
        castShadow
      />
      
      {/* Adding Solar Flares to the Sun */}
      <SolarFlares />

      <mesh ref={meshRef} material={coreMaterial}>
        <sphereGeometry args={[3.5, 64, 64]} />
      </mesh>
      <mesh ref={glowRef} material={glowMaterial}>
        <sphereGeometry args={[3.5, 32, 32]} />
      </mesh>
      {[6, 9, 14].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r, r + 0.15, 64]} />
          <meshBasicMaterial
            color={new THREE.Color("#ff8800")}
            transparent
            opacity={0.04 - i * 0.01}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <pointLight color="#ff6600" intensity={60} distance={20} decay={2} />
    </group>
  );
}

export default function Planets() {
  const setSelectedObject = useSpaceStore((s) => s.setSelectedObject);

  const handleClick = (config: PlanetConfig) => {
    setSelectedObject({
      id: config.id,
      name: config.name,
      type: config.type,
      distance: config.stats.distanceAU + " AU",
      description: config.description,
      stats: config.stats,
    });
  };

  return (
    <group name="planets">
      <CentralStar />
      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          config={planet}
          onClick={() => handleClick(planet)}
        />
      ))}
    </group>
  );
}
