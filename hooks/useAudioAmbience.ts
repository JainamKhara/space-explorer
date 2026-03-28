"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSpaceStore } from "@/store/useSpaceStore";

export function useAudioAmbience() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    drone1: OscillatorNode;
    drone2: OscillatorNode;
    drone3: OscillatorNode;
    filter: BiquadFilterNode;
    masterGain: GainNode;
    droneGain1: GainNode;
    droneGain2: GainNode;
    droneGain3: GainNode;
    reverb: ConvolverNode;
    reverbGain: GainNode;
  } | null>(null);

  const soundEnabled = useSpaceStore((s) => s.soundEnabled);
  const ambientVolume = useSpaceStore((s) => s.ambientVolume);
  const isInitializedRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const createImpulseResponse = useCallback((ctx: AudioContext) => {
    const duration = 4;
    const decay = 2;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = impulse.getChannelData(c);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }, []);

  const initAudio = useCallback(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Reverb
    const reverb = ctx.createConvolver();
    reverb.buffer = createImpulseResponse(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.4, ctx.currentTime);
    reverb.connect(reverbGain);
    reverbGain.connect(masterGain);

    // Low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(0.5, ctx.currentTime);
    filter.connect(masterGain);
    filter.connect(reverb);

    // Drone 1 — deep sub bass
    const drone1 = ctx.createOscillator();
    drone1.type = "sine";
    drone1.frequency.setValueAtTime(55, ctx.currentTime); // A1
    const droneGain1 = ctx.createGain();
    droneGain1.gain.setValueAtTime(0.3, ctx.currentTime);
    drone1.connect(droneGain1);
    droneGain1.connect(filter);
    drone1.start();

    // Drone 2 — mid harmonic
    const drone2 = ctx.createOscillator();
    drone2.type = "triangle";
    drone2.frequency.setValueAtTime(110, ctx.currentTime); // A2
    const droneGain2 = ctx.createGain();
    droneGain2.gain.setValueAtTime(0.15, ctx.currentTime);
    drone2.connect(droneGain2);
    droneGain2.connect(filter);
    drone2.start();

    // Drone 3 — ethereal fifth
    const drone3 = ctx.createOscillator();
    drone3.type = "sine";
    drone3.frequency.setValueAtTime(164.81, ctx.currentTime); // E3
    const droneGain3 = ctx.createGain();
    droneGain3.gain.setValueAtTime(0.1, ctx.currentTime);
    drone3.connect(droneGain3);
    droneGain3.connect(filter);
    drone3.start();

    nodesRef.current = {
      drone1,
      drone2,
      drone3,
      filter,
      masterGain,
      droneGain1,
      droneGain2,
      droneGain3,
      reverb,
      reverbGain,
    };

    // Gentle LFO modulation
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.05, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(5, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
  }, [createImpulseResponse]);

  const destroyAudio = useCallback(() => {
    if (nodesRef.current) {
      try {
        nodesRef.current.drone1.stop();
        nodesRef.current.drone2.stop();
        nodesRef.current.drone3.stop();
      } catch {}
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    nodesRef.current = null;
    isInitializedRef.current = false;
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Animate drone frequencies slowly
  useEffect(() => {
    if (!soundEnabled || !nodesRef.current || !audioCtxRef.current) return;

    const animate = () => {
      if (!nodesRef.current || !audioCtxRef.current) return;
      timeRef.current += 0.001;
      const t = timeRef.current;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Subtle pitch drift
      nodesRef.current.drone1.frequency.setTargetAtTime(
        55 + Math.sin(t * 0.3) * 2,
        now,
        0.5
      );
      nodesRef.current.drone2.frequency.setTargetAtTime(
        110 + Math.sin(t * 0.2 + 1) * 3,
        now,
        0.5
      );
      nodesRef.current.drone3.frequency.setTargetAtTime(
        164.81 + Math.sin(t * 0.15 + 2) * 4,
        now,
        0.5
      );

      // Volume breathe
      const breathe = 0.9 + Math.sin(t * 0.1) * 0.1;
      nodesRef.current.droneGain1.gain.setTargetAtTime(0.3 * breathe, now, 0.3);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [soundEnabled]);

  // Handle sound toggle
  useEffect(() => {
    if (soundEnabled) {
      initAudio();
      // Fade in
      if (nodesRef.current && audioCtxRef.current) {
        nodesRef.current.masterGain.gain.setTargetAtTime(
          ambientVolume,
          audioCtxRef.current.currentTime,
          1.5
        );
      }
    } else {
      // Fade out and destroy
      if (nodesRef.current && audioCtxRef.current) {
        nodesRef.current.masterGain.gain.setTargetAtTime(
          0,
          audioCtxRef.current.currentTime,
          0.8
        );
        const t = setTimeout(destroyAudio, 2000);
        return () => clearTimeout(t);
      }
    }
  }, [soundEnabled, ambientVolume, initAudio, destroyAudio]);

  // Update volume
  useEffect(() => {
    if (!soundEnabled || !nodesRef.current || !audioCtxRef.current) return;
    nodesRef.current.masterGain.gain.setTargetAtTime(
      ambientVolume,
      audioCtxRef.current.currentTime,
      0.3
    );
  }, [ambientVolume, soundEnabled]);

  useEffect(() => {
    return () => {
      destroyAudio();
    };
  }, [destroyAudio]);
}
