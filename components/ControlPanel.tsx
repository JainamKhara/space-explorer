"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSpaceStore, ScaleMode } from "@/store/useSpaceStore";
import { PLANETS, SUN_CONFIG, PlanetConfig } from "@/lib/celestialData";

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
    scaleMode,
    setScaleMode,
    controlPanelOpen,
    toggleControlPanel,
    triggerResetView,
    gravityTransitioning,
    simDate,
    simSpeed,
    setSimSpeed,
    isPlaying,
    togglePlay,
    resetToCurrentDate,
    setSelectedObject,
  } = useSpaceStore();

  const handleSelectBody = (config: PlanetConfig) => {
    setSelectedObject({
      id: config.id,
      name: config.name,
      type: config.type,
      tagline: config.tagline,
      description: config.description,
      distance: config.id === "sun" ? "0 AU" : `${config.stats.distanceAU} AU`,
      color: config.color,
      emissive: config.emissive,
      atmosphereColor: config.atmosphereColor,
      stats: config.stats,
      atmosphereGases: config.atmosphereGases,
      missions: config.missions,
      trivia: config.trivia,
      moons: config.moons,
      config: config,
    });
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col items-end gap-2">
      {/* Expand/Collapse Header Button */}
      <motion.button
        onClick={toggleControlPanel}
        className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={controlPanelOpen ? "Collapse Mission Control" : "Expand Mission Control"}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      </motion.button>

      {/* Main Panel */}
      <AnimatePresence>
        {controlPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="glass w-80 p-4 flex flex-col gap-4 max-h-[85vh] overflow-y-auto custom-scrollbar border border-cyan-500/20 shadow-2xl rounded-2xl backdrop-blur-xl"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {/* Mission Control Title */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span
                  className="text-xs font-bold tracking-widest text-white/80 uppercase"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Mission Control
                </span>
              </div>
            </div>

            {/* QUICK CELESTIAL NAV BAR */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[0.55rem] text-white/40 uppercase tracking-widest font-bold">
                Target Celestial Body
              </span>
              <div className="grid grid-cols-5 gap-1 bg-black/30 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => handleSelectBody(SUN_CONFIG)}
                  className="px-1.5 py-1 text-[0.65rem] font-bold rounded text-amber-300 hover:bg-amber-500/20 transition-all border border-amber-500/30"
                  title="The Sun"
                >
                  SUN
                </button>
                {PLANETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectBody(p)}
                    className="px-1.5 py-1 text-[0.65rem] font-medium rounded text-white/70 hover:text-cyan-300 hover:bg-white/10 transition-all text-center"
                    title={p.name}
                  >
                    {p.name.slice(0, 3).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* PLANET SCALE SELECTOR */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[0.55rem] text-white/40 uppercase tracking-widest font-bold">
                  Planet Size Scale Mode
                </span>
                <span className="text-[0.65rem] text-cyan-400 font-bold uppercase">{scaleMode}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                {(
                  [
                    { id: "calibrated", label: "Calibrated" },
                    { id: "true", label: "True Ratio" },
                    { id: "logarithmic", label: "Log Scale" },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setScaleMode(mode.id as ScaleMode)}
                    className={`py-1 text-[0.65rem] font-bold rounded-lg transition-all ${
                      scaleMode === mode.id
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* REAL-TIME EPHEMERIS TIME CONTROLS */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[0.55rem] text-white/40 uppercase tracking-widest font-bold">
                  Ephemeris Time Flow
                </span>
                <span className="text-[0.65rem] text-cyan-400 font-bold">
                  {isPlaying ? `${simSpeed}x Speed` : "PAUSED"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={togglePlay}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isPlaying
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  }`}
                >
                  {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
                </button>

                <div className="grid grid-cols-4 gap-1 grow">
                  {[1, 10, 50, 200].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setSimSpeed(spd)}
                      className={`py-1 text-[0.6rem] font-bold rounded-lg border transition-all ${
                        simSpeed === spd && isPlaying
                          ? "bg-cyan-500/30 text-cyan-300 border-cyan-400"
                          : "bg-white/5 text-white/40 border-white/5 hover:text-white"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={resetToCurrentDate}
                className="w-full py-1 text-[0.65rem] text-white/60 hover:text-cyan-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-center"
              >
                ↻ Sync to Current Real Date
              </button>
            </div>

            <div className="border-t border-white/10" />

            {/* GRAVITY TOGGLE */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/80 font-medium">Orbital Physics</div>
                <div
                  className="text-[0.6rem]"
                  style={{ color: gravityEnabled ? "#00d4ff" : "#ff8b6b" }}
                >
                  {gravityTransitioning
                    ? "TRANSITIONING..."
                    : gravityEnabled
                    ? "KEPLERIAN GRAVITY"
                    : "ZERO-G DRIFT"}
                </div>
              </div>
              <Toggle
                value={gravityEnabled}
                onToggle={toggleGravity}
                colorOn="#00d4ff"
              />
            </div>

            {/* ASTEROID BELT TOGGLE */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/80 font-medium">Asteroid Belt</div>
              <Toggle
                value={showAsteroids}
                onToggle={toggleAsteroids}
                colorOn="#ffb347"
              />
            </div>

            {/* ORBIT LINES TOGGLE */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/80 font-medium">Keplerian Orbits</div>
              <Toggle
                value={showOrbits}
                onToggle={toggleOrbits}
                colorOn="#00d4ff"
              />
            </div>

            {/* SOUND TOGGLE */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/80 font-medium">Ambient Audio</div>
              <Toggle
                value={soundEnabled}
                onToggle={toggleSound}
                colorOn="#00d4ff"
              />
            </div>

            <div className="border-t border-white/10" />

            {/* RESET CAMERA VIEW */}
            <motion.button
              onClick={triggerResetView}
              className="flex items-center justify-center gap-2 py-2 rounded-xl border border-white/10 text-xs text-white/70 hover:text-white hover:border-white/30 transition-all duration-300 bg-white/5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset Camera View
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
