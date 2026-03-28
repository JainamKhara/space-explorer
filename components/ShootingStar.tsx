"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ShootingStarProps {
  onComplete?: () => void;
}

function SingleShootingStar({ onComplete }: ShootingStarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const startPosRef = useRef(new THREE.Vector3());
  const endPosRef = useRef(new THREE.Vector3());
  const trailRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  // Store computed trail length in a ref — set once in useEffect, never during render
  const trailLengthRef = useRef(6);
  const speedRef = useRef(1.8);

  // Initialise all random values after mount
  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 80;

    startPosRef.current.set(
      Math.cos(angle) * dist,
      (Math.random() - 0.5) * 30,
      Math.sin(angle) * dist
    );

    const travelAngle = angle + Math.PI * (0.7 + Math.random() * 0.6);
    const travelDist = 20 + Math.random() * 40;

    endPosRef.current.set(
      startPosRef.current.x + Math.cos(travelAngle) * travelDist,
      startPosRef.current.y + (Math.random() - 0.5) * 10,
      startPosRef.current.z + Math.sin(travelAngle) * travelDist
    );

    trailLengthRef.current = 4 + Math.random() * 6;
    speedRef.current = 1.5 + Math.random() * 0.5;
  }, []);

  useFrame((_, delta) => {
    try {
      if (!groupRef.current || !trailRef.current || !headRef.current) return;

      progressRef.current += delta * speedRef.current;

      if (progressRef.current >= 1) {
        onComplete?.();
        return;
      }

      const t = progressRef.current;
      const pos = new THREE.Vector3().lerpVectors(
        startPosRef.current,
        endPosRef.current,
        t
      );
      groupRef.current.position.copy(pos);
      groupRef.current.lookAt(endPosRef.current);

      // Fade in/out
      const fade =
        t < 0.15 ? t / 0.15 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;

      (trailRef.current.material as THREE.MeshBasicMaterial).opacity = fade * 0.9;
      (headRef.current.material as THREE.MeshBasicMaterial).opacity = fade * 1.0;
    } catch (error) {
      console.error("❌ SingleShootingStar useFrame error:", error);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Trail — fixed size geometry; actual length set via scale in the effect */}
      <mesh ref={trailRef} position={[-5, 0, 0]}>
        <planeGeometry args={[10, 0.06]} />
        <meshBasicMaterial
          color={new THREE.Color("#ffffff")}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Head glow */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial
          color={new THREE.Color("#aaddff")}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function ShootingStar() {
  // Use state instead of a ref for the active-star list so re-renders actually happen
  const [activeStars, setActiveStars] = useState<string[]>([]);
  const nextTimeRef = useRef(0);
  const elapsedRef = useRef(0);
  const initialised = useRef(false);

  const scheduleNext = useCallback(() => {
    nextTimeRef.current = elapsedRef.current + 8 + Math.random() * 7;
  }, []);

  useEffect(() => {
    // Schedule the first shooting star after mount
    if (!initialised.current) {
      initialised.current = true;
      nextTimeRef.current = 6 + Math.random() * 4;
    }
  }, []);

  const addStar = useCallback(() => {
    const id = `ss_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    setActiveStars((prev) => [...prev, id]);
  }, []);

  const removeStar = useCallback((id: string) => {
    setActiveStars((prev) => prev.filter((s) => s !== id));
  }, []);

  useFrame((_, delta) => {
    try {
      elapsedRef.current += delta;
      if (elapsedRef.current >= nextTimeRef.current) {
        addStar();
        scheduleNext();
      }
    } catch (error) {
      console.error("❌ ShootingStar scheduler useFrame error:", error);
    }
  });

  return (
    <group name="shooting-stars">
      {activeStars.map((id) => (
        <SingleShootingStar key={id} onComplete={() => removeStar(id)} />
      ))}
    </group>
  );
}
