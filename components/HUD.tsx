"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSpaceStore } from "@/store/useSpaceStore";

export default function HUD() {
  const { selectedObject, gravityEnabled } = useSpaceStore();

  return (
    <>
      {/* Selected Object Detail Panel — Bottom Center */}
      <AnimatePresence>
        {selectedObject && (
          <motion.div
            key="planet-card"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl glass p-6 z-50 border border-white/10 shadow-2xl"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {/* Close Button */}
            <button
              onClick={() => useSpaceStore.getState().setSelectedObject(null)}
              className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
               {/* Left Column: Heading & Type */}
              <div className="shrink-0 md:w-1/4">
                <div
                  className="text-2xl font-black tracking-tighter uppercase mb-1"
                  style={{ fontFamily: "var(--font-heading)", color: "#00d4ff", textShadow: "0 0 15px rgba(0,212,255,0.3)" }}
                >
                  {selectedObject.name}
                </div>
                <div className="text-[0.65rem] text-white/40 uppercase tracking-[0.2em] mb-3">
                  {selectedObject.type} · {selectedObject.distance}
                </div>
              </div>

              {/* Center Column: Description */}
              <div className="grow border-white/5 md:border-l md:border-r md:px-6">
                 <p className="text-[0.75rem] text-white/70 leading-relaxed italic">
                  &quot;{selectedObject.description}&quot;
                </p>
              </div>

              {/* Right Column: Stats Grid */}
              {selectedObject.stats && (
                <div className="md:w-1/2 grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-left border-l border-white/5 pl-8">
                  <div className="flex flex-col">
                    <span className="text-[0.5rem] text-cyan-400/50 uppercase tracking-widest mb-1">Surface Gravity</span>
                    <span className="text-[0.85rem] text-white/90 font-medium">{selectedObject.stats.gravity} m/s²</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.5rem] text-cyan-400/50 uppercase tracking-widest mb-1">Mean Temperature</span>
                    <span className="text-[0.85rem] text-white/90 font-medium">{selectedObject.stats.temperature}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.5rem] text-cyan-400/50 uppercase tracking-widest mb-1">Day Length</span>
                    <span className="text-[0.85rem] text-white/90 font-medium">{selectedObject.stats.dayLength}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.5rem] text-cyan-400/50 uppercase tracking-widest mb-1">Year Length</span>
                    <span className="text-[0.85rem] text-white/90 font-medium">{selectedObject.stats.yearLength}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.5rem] text-cyan-400/50 uppercase tracking-widest mb-1">Planetary Mass</span>
                    <span className="text-[0.85rem] text-white/90 font-medium">{selectedObject.stats.mass}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.5rem] text-cyan-400/50 uppercase tracking-widest mb-1">Main Composition</span>
                    <span className="text-[0.75rem] text-white/70 leading-tight">{selectedObject.stats.composition}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status bar top-left */}
      <div
        className="fixed top-4 left-4 z-40 flex flex-col gap-1.5"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: gravityEnabled ? "#00d4ff" : "#ff8b6b" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-white/30 tracking-widest uppercase">
            {gravityEnabled ? "Orbital" : "Zero-G"}
          </span>
        </div>
      </div>

      {/* Bottom center — system name */}
      <div
        className="fixed bottom-4 right-4 z-40 text-right"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          SYSTEM SOL-PRIME
        </div>
        <div style={{ fontSize: "0.55rem", color: "rgba(0,212,255,0.2)", letterSpacing: "0.1em" }}>
          {new Date().toUTCString().slice(0, 16)} UTC
        </div>
      </div>
    </>
  );
}
