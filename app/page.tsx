"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import ControlPanel from "@/components/ControlPanel";
import HUD from "@/components/HUD";
import { useAudioAmbience } from "@/hooks/useAudioAmbience";

const SpaceCanvas = dynamic(() => import("@/components/SpaceCanvas"), {
  ssr: false,
});

// Particle field for the intro screen
function IntroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; o: number; vx: number; vy: number; c: string }[] = [];
    const colors = ["#9bb0ff", "#aabfff", "#fff5d9", "#ff8b6b", "#00d4ff"];

    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        o: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        c: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const render = () => {
      ctx.fillStyle = "rgba(2,4,8,0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.o;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

function EntryScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"title" | "subtitle" | "cta">("title");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("subtitle"), 1200);
    const t2 = setTimeout(() => setPhase("cta"), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#020408" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <IntroParticles />

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.015) 2px, rgba(0,212,255,0.015) 4px)",
        }}
      />

      {/* Center glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative z-20 flex flex-col items-center gap-6 px-8 text-center">
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.15em" }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1
            className="text-6xl md:text-8xl font-black tracking-widest uppercase select-none"
            style={{
              fontFamily: "var(--font-heading)",
              color: "white",
              textShadow:
                "0 0 40px rgba(0,212,255,0.5), 0 0 80px rgba(0,212,255,0.2)",
            }}
          >
            DEEP
          </h1>
          <h1
            className="text-6xl md:text-8xl font-black tracking-widest uppercase select-none"
            style={{
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(90deg, #00d4ff, #7b2fff, #ffb347)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
            }}
          >
            SPACE
          </h1>
        </motion.div>

        <AnimatePresence>
          {(phase === "subtitle" || phase === "cta") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-3"
            >
              <div
                className="text-sm tracking-widest text-white/40 uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.4em" }}
              >
                — EXPLORER —
              </div>
              <div className="text-xs text-white/25" style={{ fontFamily: "var(--font-mono)" }}>
                TRAVERSE THE INFINITE COSMOS
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "cta" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 mt-4"
            >
              <motion.button
                onClick={onComplete}
                className="glass glass-hover px-10 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "#00d4ff",
                  border: "1px solid rgba(0,212,255,0.4)",
                  boxShadow: "0 0 20px rgba(0,212,255,0.15)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(0,212,255,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                LAUNCH EXPLORER
              </motion.button>
              <div className="text-xs text-white/30 font-medium">
                Click to explore
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Inner app component that holds audio hook
function AppInner() {
  useAudioAmbience();
  return null;
}

export default function HomePage() {
  const [launched, setLaunched] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  // Log state changes
  useEffect(() => {
    console.log("📊 State update: launched =", launched, "showCanvas =", showCanvas);
  }, [launched, showCanvas]);

  const handleLaunch = () => {
    console.log("🚀 LAUNCH clicked! showCanvas:", showCanvas, "launched:", launched);
    setShowCanvas(true);
    setTimeout(() => {
      console.log("✅ setLaunched(true) called");
      setLaunched(true);
    }, 100);
  };

  return (
    <main className="relative w-full h-full overflow-hidden" style={{ background: "#020408" }}>
      {/* Three.js scene — fades in after launch */}
      {showCanvas && (
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: launched ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <SpaceCanvas />
        </motion.div>
      )}

      {/* HUD overlay */}
      {launched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <HUD />
          <ControlPanel />
          <AppInner />
        </motion.div>
      )}

      {/* Entry screen */}
      <AnimatePresence>
        {!launched && (
          <EntryScreen onComplete={handleLaunch} />
        )}
      </AnimatePresence>
    </main>
  );
}
