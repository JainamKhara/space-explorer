"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceStore } from "@/store/useSpaceStore";

const ASTEROID_COUNT = 3000;
const INNER_RADIUS = 32;
const OUTER_RADIUS = 40;

export default function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const showAsteroids = useSpaceStore((s) => s.showAsteroids);

  const [asteroids] = useState(() => {
    const data = [];
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const radius = INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS);
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 1.5;

      const scale = 0.02 + Math.random() * 0.08;
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const speed = (0.05 + Math.random() * 0.05) * (INNER_RADIUS / radius);
      
      data.push({ x, y, z, angle, radius, speed, rotation, scale });
    }
    return data;
  });

  const dummy = useRef(new THREE.Object3D());

  useFrame((state) => {
    if (!meshRef.current || !showAsteroids) return;

    const time = state.clock.getElapsedTime();

    asteroids.forEach((asteroid, i) => {
      const currentAngle = asteroid.angle + time * asteroid.speed;
      const x = Math.cos(currentAngle) * asteroid.radius;
      const z = Math.sin(currentAngle) * asteroid.radius;

      dummy.current.position.set(x, asteroid.y, z);
      dummy.current.rotation.set(
        asteroid.rotation.x + time * 0.2,
        asteroid.rotation.y + time * 0.3,
        asteroid.rotation.z + time * 0.1
      );
      dummy.current.scale.setScalar(asteroid.scale);
      dummy.current.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.current.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!showAsteroids) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ASTEROID_COUNT]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#8a8a8a"
        roughness={0.9}
        metalness={0.1}
      />
    </instancedMesh>
  );
}
