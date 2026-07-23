"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceStore } from "@/store/useSpaceStore";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export default function GravitySystem() {
  const { camera, controls } = useThree();
  const resetView = useSpaceStore((s) => s.resetView);
  const clearResetView = useSpaceStore((s) => s.clearResetView);
  const selectedObject = useSpaceStore((s) => s.selectedObject);

  const isResettingRef = useRef(false);

  // Handle reset view command
  useEffect(() => {
    if (resetView) {
      isResettingRef.current = true;
      clearResetView();
    }
  }, [resetView, clearResetView]);

  useFrame(({ scene }, delta) => {
    try {
      const orbitControls = controls as unknown as OrbitControlsImpl;
      
      if (isResettingRef.current) {
        const defaultPos = new THREE.Vector3(0, 25, 130);
        camera.position.lerp(defaultPos, delta * 2.5);
        if (orbitControls) {
          orbitControls.target.lerp(new THREE.Vector3(0, 0, 0), delta * 2.5);
          orbitControls.update();
        }
        if (camera.position.distanceTo(defaultPos) < 1.0) {
          isResettingRef.current = false;
        }
        return;
      }

      // Smooth camera focus to selected planet or Sun target
      if (selectedObject && selectedObject.id) {
        let targetMesh: THREE.Object3D | null = null;
        
        // Find planet or Sun mesh in scene by name
        scene.traverse((obj) => {
          if (obj.name === selectedObject.id || (obj.userData && obj.userData.id === selectedObject.id)) {
            targetMesh = obj;
          }
        });

        if (targetMesh && orbitControls) {
          const worldPos = new THREE.Vector3();
          (targetMesh as THREE.Object3D).getWorldPosition(worldPos);

          // Smoothly lerp camera orbit target to planet position
          orbitControls.target.lerp(worldPos, delta * 3.5);
          orbitControls.update();
        }
      }
    } catch (error) {
      console.error("❌ GravitySystem useFrame error:", error);
    }
  });

  return null;
}
