"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  starGlowVertexShader,
  starGlowFragmentShader,
} from "@/lib/shaders";
import { pickStarColor } from "@/lib/celestialData";

const LAYER_CONFIGS = [
  { count: 3500, radiusMin: 80, radiusMax: 500, sizeBase: 1.4, layer: 0 },
  { count: 4000, radiusMin: 300, radiusMax: 1500, sizeBase: 0.9, layer: 1 },
  { count: 3000, radiusMin: 1000, radiusMax: 4000, sizeBase: 0.5, layer: 2 },
];

interface LayerData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  brightness: Float32Array;
}

function buildLayer(config: (typeof LAYER_CONFIGS)[0]): LayerData {
  const { count, radiusMin, radiusMax, sizeBase } = config;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const brightness = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radiusMin + Math.random() * (radiusMax - radiusMin);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
    positions[i * 3 + 2] = r * Math.cos(phi);

    const starType = pickStarColor();
    const c = new THREE.Color(starType.color);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = sizeBase * starType.size * (0.6 + Math.random() * 0.8);
    brightness[i] = 0.5 + Math.random() * 0.5;
  }

  return { positions, colors, sizes, brightness };
}

function StarLayer({ config }: { config: (typeof LAYER_CONFIGS)[0] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { gl } = useThree();
  const pixelRatio = gl.getPixelRatio();

  useEffect(() => {
    if (!pointsRef.current) return;

    const data = buildLayer(config);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(data.colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(data.sizes, 1));
    geo.setAttribute("aBrightness", new THREE.BufferAttribute(data.brightness, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: starGlowVertexShader,
      fragmentShader: starGlowFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uBreathScale: { value: config.layer === 0 ? 1.0 : 0.3 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    pointsRef.current.geometry = geo;
    pointsRef.current.material = mat;

    return () => {
      geo.dispose();
      mat.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixelRatio]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !pointsRef.current.material) return;
    const mat = pointsRef.current.material as THREE.ShaderMaterial;
    if (mat.uniforms) {
      mat.uniforms.uTime.value = clock.getElapsedTime();
    }
    const speed = [0.00008, 0.00004, 0.00002][config.layer];
    pointsRef.current.rotation.y += speed;
  });

  return <points ref={pointsRef} />;
}

export default function StarField() {
  return (
    <group name="starfield">
      {LAYER_CONFIGS.map((cfg) => (
        <StarLayer key={cfg.layer} config={cfg} />
      ))}
    </group>
  );
}
