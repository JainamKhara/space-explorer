"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FLARE_COUNT = 6;

export default function SolarFlares() {
  const groupRef = useRef<THREE.Group>(null);

  const [flares] = useState(() => {
    return Array.from({ length: FLARE_COUNT }).map((_, i) => ({
      id: i,
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      scale: 0.8 + Math.random() * 0.6,
      speed: 0.2 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
    }));
  });

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const flare = flares[i];
      const pulse = Math.sin(t * flare.speed + flare.offset);
      child.scale.setScalar(flare.scale * (1 + pulse * 0.15));
      child.rotation.z = flare.rotation.z + t * 0.1;
      
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.2 + pulse * 0.15;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {flares.map((flare) => (
        <mesh key={flare.id} rotation={flare.rotation}>
          <torusGeometry args={[3.6, 0.05, 16, 100, Math.PI / 2]} />
          <meshBasicMaterial
            color="#ff4400"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
