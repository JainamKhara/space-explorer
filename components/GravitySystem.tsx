"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceStore } from "@/store/useSpaceStore";

export default function GravitySystem() {
  const { camera } = useThree();
  const resetView = useSpaceStore((s) => s.resetView);
  const clearResetView = useSpaceStore((s) => s.clearResetView);

  const isResettingRef = useRef(false);

  // Handle reset view
  useEffect(() => {
    if (resetView) {
      isResettingRef.current = true;
      clearResetView();
    }
  }, [resetView, clearResetView]);

  useFrame((_, delta) => {
    try {
      if (!isResettingRef.current) return;

      const defaultPos = new THREE.Vector3(0, 5, 100);
      camera.position.lerp(defaultPos, delta * 2);
      
      const targetQuat = new THREE.Quaternion();
      const dummy = new THREE.Object3D();
      dummy.position.copy(camera.position);
      dummy.lookAt(0, 0, 0);
      targetQuat.copy(dummy.quaternion);
      camera.quaternion.slerp(targetQuat, delta * 2);

      if (camera.position.distanceTo(defaultPos) < 0.5) {
        isResettingRef.current = false;
      }
    } catch (error) {
      console.error("❌ GravitySystem useFrame error:", error);
    }
  });

  return null;
}
