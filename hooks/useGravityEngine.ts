"use client";

import { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceStore } from "@/store/useSpaceStore";

export interface OrbitalBody {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  orbitInclination: number;
  starMass: number;
  id: string;
}

const G = 6.674e-11;
const SCALE = 1e9;
const GRAVITY_LERP_DURATION = 2.0; // seconds

export function useGravityEngine() {
  const gravityEnabled = useSpaceStore((s) => s.gravityEnabled);
  const setGravityTransitioning = useSpaceStore((s) => s.setGravityTransitioning);
  const gravityTransitioning = useSpaceStore((s) => s.gravityTransitioning);

  const transitionRef = useRef(0); // 0 = pure gravity/free, 1 = transitioning
  const transitionDirectionRef = useRef<"toGravity" | "toFree">("toGravity");
  const gravityBlendRef = useRef(1.0); // 1 = full gravity, 0 = zero-G

  const prevGravityRef = useRef(gravityEnabled);

  const updatePlanetPosition = useCallback(
    (
      body: { orbitAngle: number; orbitRadius: number; orbitInclination: number },
      delta: number,
      speed: number,
      gravityBlend: number
    ): { angle: number; x: number; y: number; z: number } => {
      // Gravity mode: Keplerian orbit
      const angularVelocity = speed * gravityBlend;
      const newAngle = body.orbitAngle + angularVelocity * delta;

      const cos = Math.cos(newAngle);
      const sin = Math.sin(newAngle);
      const incl = body.orbitInclination;

      const x = body.orbitRadius * cos;
      const z = body.orbitRadius * sin * Math.cos(incl);
      const y = body.orbitRadius * sin * Math.sin(incl);

      return { angle: newAngle, x, y, z };
    },
    []
  );

  // Track gravity changes for transition
  useFrame((_, delta) => {
    if (prevGravityRef.current !== gravityEnabled) {
      prevGravityRef.current = gravityEnabled;
      transitionRef.current = 0;
      transitionDirectionRef.current = gravityEnabled ? "toGravity" : "toFree";
    }

    if (gravityTransitioning) {
      transitionRef.current += delta / GRAVITY_LERP_DURATION;
      if (transitionRef.current >= 1) {
        transitionRef.current = 1;
        setGravityTransitioning(false);
      }

      gravityBlendRef.current =
        transitionDirectionRef.current === "toGravity"
          ? transitionRef.current
          : 1 - transitionRef.current;
    } else {
      gravityBlendRef.current = gravityEnabled ? 1 : 0;
    }
  });

  return {
    updatePlanetPosition,
    gravityBlendRef,
    G,
    SCALE,
  };
}

// Zero-G drift state for a body
export interface ZeroGState {
  velocity: THREE.Vector3;
  angularVelocity: THREE.Euler;
}

export function createZeroGState(): ZeroGState {
  return {
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.5
    ),
    angularVelocity: new THREE.Euler(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01
    ),
  };
}
