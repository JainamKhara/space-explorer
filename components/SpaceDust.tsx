"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DUST_COUNT = 1500;

export default function SpaceDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const [particles] = useState(() => {
    const data = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500
      );
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.1
      );
      const scale = 0.05 + Math.random() * 0.15;
      data.push({ position, velocity, scale });
    }
    return data;
  });

  const dummy = useRef(new THREE.Object3D());

  useFrame((state) => {
    if (!meshRef.current) return;
    
    particles.forEach((p, i) => {
      p.position.add(p.velocity);
      
      // Wrap around
      if (Math.abs(p.position.x) > 250) p.position.x *= -0.98;
      if (Math.abs(p.position.y) > 250) p.position.y *= -0.98;
      if (Math.abs(p.position.z) > 250) p.position.z *= -0.98;
      
      dummy.current.position.copy(p.position);
      dummy.current.scale.setScalar(p.scale);
      dummy.current.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.current.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, DUST_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
