"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSpaceStore, DetailTab } from "@/store/useSpaceStore";

export default function HUD() {
  const {
    selectedObject,
    setSelectedObject,
    gravityEnabled,
    simDate,
    detailTab,
    setDetailTab,
    triggerResetView,
  } = useSpaceStore();

  return (
    <>
      {/* Selected Object Telemetry Console — Bottom Center */}
      <AnimatePresence>
        {selectedObject && (
          <motion.div
            key="planet-card"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl glass p-6 z-50 border border-cyan-500/20 shadow-[0_0_50px_rgba(0,212,255,0.15)] rounded-2xl backdrop-blur-xl"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {/* Top Bar: Title, Subtitle, Tabs & Close */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full animate-pulse shadow-lg"
                  style={{
                    backgroundColor: selectedObject.color || "#00d4ff",
                    boxShadow: `0 0 15px ${selectedObject.color || "#00d4ff"}`,
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-2xl md:text-3xl font-black tracking-tight uppercase"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "#ffffff",
                        textShadow: `0 0 20px ${selectedObject.color || "#00d4ff"}80`,
                      }}
                    >
                      {selectedObject.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[0.6rem] font-bold tracking-widest uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {selectedObject.type}
                    </span>
                  </div>
                  {selectedObject.tagline && (
                    <p className="text-xs text-white/60 italic mt-0.5">
                      &quot;{selectedObject.tagline}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Tabs & Control Actions */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                  {(
                    [
                      { id: "overview", label: "Overview" },
                      { id: "atmosphere", label: "Atmosphere" },
                      { id: "orbit", label: "Orbit & Physics" },
                      { id: "exploration", label: "Missions & Moons" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id as DetailTab)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        detailTab === tab.id
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                          : "text-white/40 hover:text-white/80"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedObject(null)}
                  className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="mt-4 min-h-[160px] max-h-[40vh] overflow-y-auto custom-scrollbar">
              {/* TAB 1: OVERVIEW & PHYSICAL METRICS */}
              {detailTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: Description */}
                  <div className="md:col-span-1 flex flex-col justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[0.6rem] text-cyan-400/60 uppercase tracking-widest block mb-2 font-bold">
                        Heliocentric Profile
                      </span>
                      <p className="text-xs text-white/80 leading-relaxed">
                        {selectedObject.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-white/40">Distance to Sun</span>
                      <span className="text-cyan-400 font-bold">{selectedObject.distance}</span>
                    </div>
                  </div>

                  {/* Right: Physics Stats Grid */}
                  {selectedObject.stats && (
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                        <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Radius</span>
                        <div className="text-sm font-bold text-white mt-1">
                          {selectedObject.stats.radiusKm.toLocaleString()} km
                        </div>
                        <div className="text-[0.65rem] text-cyan-400/70">
                          {selectedObject.stats.radiusEarthRatio}x Earth
                        </div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                        <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Mass</span>
                        <div className="text-sm font-bold text-white mt-1">
                          {selectedObject.stats.massKg}
                        </div>
                        <div className="text-[0.65rem] text-cyan-400/70">
                          {selectedObject.stats.massEarthRatio}x Earth
                        </div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                        <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Surface Gravity</span>
                        <div className="text-sm font-bold text-white mt-1">
                          {selectedObject.stats.gravityMs2} m/s²
                        </div>
                        <div className="text-[0.65rem] text-cyan-400/70">
                          {selectedObject.stats.gravityEarthRatio} g
                        </div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                        <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Density</span>
                        <div className="text-sm font-bold text-white mt-1">
                          {selectedObject.stats.densityGcm3} g/cm³
                        </div>
                        <div className="text-[0.65rem] text-white/40">Compactness</div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                        <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Escape Velocity</span>
                        <div className="text-sm font-bold text-white mt-1">
                          {selectedObject.stats.escapeVelocityKms} km/s
                        </div>
                        <div className="text-[0.65rem] text-white/40">Min velocity</div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                        <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Surface Temp</span>
                        <div className="text-sm font-bold text-amber-300 mt-1">
                          {selectedObject.stats.temperature}
                        </div>
                        <div className="text-[0.65rem] text-white/40">Avg Environment</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ATMOSPHERE & CLIMATE */}
              {detailTab === "atmosphere" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gas Breakdown Bars */}
                  <div>
                    <span className="text-[0.6rem] text-cyan-400/60 uppercase tracking-widest block mb-3 font-bold">
                      Atmospheric Composition Breakdown
                    </span>
                    {selectedObject.atmosphereGases && selectedObject.atmosphereGases.length > 0 ? (
                      <div className="space-y-3">
                        {selectedObject.atmosphereGases.map((gas, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs text-white/80">
                              <span>{gas.name}</span>
                              <span className="font-bold">{gas.percentage}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(gas.percentage, 2)}%`,
                                  backgroundColor: gas.color,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-white/40 italic p-4 bg-white/5 rounded-xl">
                        Vacuum or negligible exosphere (Trace elements only).
                      </div>
                    )}
                  </div>

                  {/* Environmental Metrics */}
                  {selectedObject.stats && (
                    <div className="space-y-3">
                      <span className="text-[0.6rem] text-cyan-400/60 uppercase tracking-widest block mb-3 font-bold">
                        Thermal & Pressure Characteristics
                      </span>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/40">Mean Temperature</span>
                          <span className="text-amber-400 font-bold">{selectedObject.stats.temperature}</span>
                        </div>
                        {selectedObject.stats.tempKelvin && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40">Temperature (Kelvin)</span>
                            <span className="text-cyan-300 font-bold">{selectedObject.stats.tempKelvin} K</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/40">Axial Tilt</span>
                          <span className="text-white font-bold">{selectedObject.stats.axialTiltDeg}°</span>
                        </div>
                        {selectedObject.stats.spectralClass && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40">Spectral Class</span>
                            <span className="text-yellow-300 font-bold">{selectedObject.stats.spectralClass}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ORBIT & PHYSICS */}
              {detailTab === "orbit" && selectedObject.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Semi-Major Axis</span>
                    <div className="text-base font-bold text-cyan-400 mt-1">
                      {selectedObject.stats.distanceAU} AU
                    </div>
                    <div className="text-xs text-white/60">{selectedObject.stats.distanceKm}</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Orbital Period (Year)</span>
                    <div className="text-base font-bold text-white mt-1">
                      {selectedObject.stats.yearLength}
                    </div>
                    <div className="text-xs text-white/40">One revolution</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Rotation Period (Day)</span>
                    <div className="text-base font-bold text-white mt-1">
                      {selectedObject.stats.dayLength}
                    </div>
                    <div className="text-xs text-white/40">One full spin</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-[0.55rem] text-white/40 uppercase tracking-widest">Axial Tilt</span>
                    <div className="text-base font-bold text-amber-400 mt-1">
                      {selectedObject.stats.axialTiltDeg}°
                    </div>
                    <div className="text-xs text-white/40">To Ecliptic</div>
                  </div>
                </div>
              )}

              {/* TAB 4: MISSIONS & MOONS & TRIVIA */}
              {detailTab === "exploration" && (
                <div className="space-y-6">
                  {/* Space Missions */}
                  {selectedObject.missions && selectedObject.missions.length > 0 && (
                    <div>
                      <span className="text-[0.6rem] text-cyan-400/60 uppercase tracking-widest block mb-3 font-bold">
                        Historical & Active Space Exploration Missions
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedObject.missions.map((mission, i) => (
                          <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-cyan-300">{mission.name} ({mission.year})</span>
                              <span className="text-[0.65rem] px-2 py-0.5 rounded bg-white/10 text-white/80">
                                {mission.agency}
                              </span>
                            </div>
                            <p className="text-[0.7rem] text-white/70 mt-1.5">
                              {mission.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Moons */}
                  {selectedObject.moons && selectedObject.moons.length > 0 && (
                    <div>
                      <span className="text-[0.6rem] text-cyan-400/60 uppercase tracking-widest block mb-3 font-bold">
                        Major Natural Satellites ({selectedObject.moons.length})
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {selectedObject.moons.map((moon, i) => (
                          <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs">{moon.name}</span>
                              <span className="text-[0.65rem] text-cyan-400">{moon.diameterKm.toLocaleString()} km</span>
                            </div>
                            {moon.description && (
                              <p className="text-[0.7rem] text-white/60 mt-1">
                                {moon.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scientific Trivia */}
                  {selectedObject.trivia && selectedObject.trivia.length > 0 && (
                    <div>
                      <span className="text-[0.6rem] text-amber-400/70 uppercase tracking-widest block mb-3 font-bold">
                        Key Scientific Discoveries & Trivia
                      </span>
                      <div className="space-y-2">
                        {selectedObject.trivia.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-white/80 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/10">
                            <span className="text-amber-400 font-bold shrink-0">✦</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Left Live Status */}
      <div
        className="fixed top-4 left-4 z-40 flex flex-col gap-1"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: gravityEnabled ? "#00d4ff" : "#ff8b6b" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-white/70 tracking-widest uppercase font-bold">
            {gravityEnabled ? "Keplerian Orbit" : "Zero-G Drift"}
          </span>
        </div>
      </div>

      {/* Bottom Right Timeline Indicator */}
      <div
        className="fixed bottom-4 right-4 z-40 text-right bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <div style={{ fontSize: "0.75rem", color: "#00d4ff", fontWeight: "bold", letterSpacing: "0.05em" }}>
          {simDate.toUTCString().slice(0, 22)}
        </div>
      </div>
    </>
  );
}
