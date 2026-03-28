"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import dynamic from "next/dynamic";
import { useSpaceStore } from "@/store/useSpaceStore";
import ErrorBoundary from "./ErrorBoundary";

// Dynamic imports to prevent SSR issues
const StarField = dynamic(() => import("./StarField"), { ssr: false });
const Planets = dynamic(() => import("./Planets"), { ssr: false });
const ShootingStar = dynamic(() => import("./ShootingStar"), { ssr: false });
const GravitySystem = dynamic(() => import("./GravitySystem"), { ssr: false });
const AsteroidBelt = dynamic(() => import("./AsteroidBelt"), { ssr: false });
const SpaceDust = dynamic(() => import("./SpaceDust"), { ssr: false });

// Debug component to monitor render loop in console
function RenderMonitor() {
  const frameCount = useRef(0);
  const lastLog = useRef(0);

  useEffect(() => {
    lastLog.current = performance.now();
  }, []);

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    if (now - lastLog.current > 5000) {
      console.log("🔄 SpaceCanvas active. Frames since last log:", frameCount.current);
      lastLog.current = now;
      frameCount.current = 0;
    }
  });

  return null;
}

function SceneContent() {
  const bloomIntensity = useSpaceStore((s) => s.bloomIntensity);

  return (
    <>
      <RenderMonitor />
      
      {/* Camera system */}
      <GravitySystem />

      {/* Orbit controls — now always enabled and makeDefault */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.4}
        zoomSpeed={0.6}
        minDistance={10}
        maxDistance={1000}
        enablePan={false}
        makeDefault
      />

      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.05} color="#1a2040" />
      <directionalLight
        position={[100, 50, 100]}
        intensity={0.5}
        color="#fff4c2"
      />

      {/* Scene objects */}
      <StarField />
      <SpaceDust />
      <AsteroidBelt />
      <Planets />
      <ShootingStar />

      {/* Post-processing */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette
          offset={0.3}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>

      {/* Performance utilities */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

export default function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("🔭 SpaceCanvas Scene Mounted");
    
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.error("💥 WebGL Context Lost!");
    };
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLost, false);
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-[#020408]">
      <ErrorBoundary>
        <Canvas
          ref={canvasRef}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
          camera={{
            fov: 60,
            near: 0.1,
            far: 10000,
            position: [0, 5, 100],
          }}
          dpr={[1, 2]}
          onCreated={(state) => {
            state.gl.setClearColor("#020408");
            console.log("🎮 Three.js Render State Initialised");
          }}
        >
          <color attach="background" args={["#020408"]} />
          <fog attach="fog" args={["#020408", 500, 8000]} />
          <SceneContent />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
