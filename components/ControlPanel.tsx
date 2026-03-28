"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSpaceStore } from "@/store/useSpaceStore";

// Toggle component
function Toggle({
  value,
  onToggle,
  colorOn = "#00d4ff",
}: {
  value: boolean;
  onToggle: () => void;
  colorOn?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`toggle-track${value ? " on" : ""}`}
      style={value ? { background: `${colorOn}33`, borderColor: colorOn } : {}}
      aria-label="Toggle"
    >
      <div className="toggle-thumb" />
    </button>
  );
}

// Icon components
function GravityIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="4"
        fill={active ? "#00d4ff" : "#ffffff60"}
        className="transition-colors duration-300"
      />
      <path
        d="M12 2v4M12 18v4M2 12h4M18 12h4"
        stroke={active ? "#00d4ff" : "#ffffff40"}
        strokeWidth="2"
        strokeLinecap="round"
        className="transition-colors duration-300"
      />
      <path
        d="M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83"
        stroke={active ? "#00d4ff" : "#ffffff30"}
        strokeWidth="1.5"
        strokeLinecap="round"
        className="transition-colors duration-300"
      />
    </svg>
  );
}

function SoundIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        fill={active ? "#00d4ff" : "#ffffff40"}
        className="transition-colors duration-300"
      />
      {active ? (
        <>
          <path
            d="M15.54 8.46a5 5 0 010 7.07"
            stroke="#00d4ff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M19.07 4.93a10 10 0 010 14.14"
            stroke="#00d4ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          d="M23 9l-6 6M17 9l6 6"
          stroke="#ffffff40"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 4v6h6"
        stroke="#ffffff80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.51 15a9 9 0 102.13-9.36L1 10"
        stroke="#ffffff80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ControlPanel() {
  const {
    gravityEnabled,
    toggleGravity,
    soundEnabled,
    toggleSound,
    showAsteroids,
    toggleAsteroids,
    showOrbits,
    toggleOrbits,
    controlPanelOpen,
    toggleControlPanel,
    triggerResetView,
    gravityTransitioning,
  } = useSpaceStore();

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col items-end gap-2">
      {/* Toggle button */}
      <motion.button
        onClick={toggleControlPanel}
        className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={controlPanelOpen ? "Collapse" : "Expand controls"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: controlPanelOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.3s ease",
          }}
        >
          <path
            d="M12 5v14M5 12l7 7 7-7"
            stroke="#00d4ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>

      {/* Main panel */}
      <AnimatePresence>
        {controlPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="glass w-72 p-4 flex flex-col gap-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span
                className="text-xs font-bold tracking-widest text-white/60 uppercase"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Mission Control
              </span>
            </div>

            {/* Gravity Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GravityIcon active={gravityEnabled} />
                <div>
                  <div className="text-xs text-white/80 font-medium">
                    Gravity
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: gravityEnabled ? "#00d4ff" : "#ff8b6b",
                      fontSize: "0.65rem",
                    }}
                  >
                    {gravityTransitioning
                      ? "TRANSITIONING..."
                      : gravityEnabled
                      ? "ORBITAL MODE"
                      : "ZERO-G MODE"}
                  </div>
                </div>
              </div>
              <Toggle
                value={gravityEnabled}
                onToggle={toggleGravity}
                colorOn="#00d4ff"
              />
            </div>

            <div className="border-t border-white/10 my-1" />

            {/* Asteroid Belt Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 12l10 10 10-10L12 2z" stroke={showAsteroids ? "#ffb347" : "#ffffff40"} strokeWidth="1.5" />
                </svg>
                <div className="text-xs text-white/80 font-medium">Asteroid Belt</div>
              </div>
              <Toggle
                value={showAsteroids}
                onToggle={toggleAsteroids}
                colorOn="#ffb347"
              />
            </div>

            {/* Orbit lines toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke={showOrbits ? "#334466cc" : "#ffffff20"}
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="2"
                    fill={showOrbits ? "#ffb347" : "#ffffff30"}
                  />
                </svg>
                <div className="text-xs text-white/80 font-medium">
                  Orbit Lines
                </div>
              </div>
              <Toggle
                value={showOrbits}
                onToggle={toggleOrbits}
                colorOn="#ffb347"
              />
            </div>

            <div className="border-t border-white/10 my-1" />

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SoundIcon active={soundEnabled} />
                <div className="text-xs text-white/80 font-medium">
                  Ambient Sound
                </div>
              </div>
              <Toggle
                value={soundEnabled}
                onToggle={toggleSound}
                colorOn="#00d4ff"
              />
            </div>

            <div className="border-t border-white/10" />

            {/* Reset View */}
            <motion.button
              onClick={triggerResetView}
              className="flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white/90 hover:border-white/30 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ResetIcon />
              Reset View
            </motion.button>

            {/* Footer */}
            <div className="text-center text-white/20 pt-1" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>
              DEEP SPACE EXPLORER v2.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
