import { create } from "zustand";
import { PlanetConfig, CelestialBodyStats } from "@/lib/celestialData";

export type ScaleMode = "calibrated" | "true" | "logarithmic";
export type DetailTab = "overview" | "atmosphere" | "orbit" | "exploration";

export type SelectedObject = {
  id: string;
  name: string;
  type: string;
  tagline?: string;
  description?: string;
  distance: string;
  color?: string;
  emissive?: string;
  atmosphereColor?: string;
  stats?: CelestialBodyStats;
  atmosphereGases?: PlanetConfig["atmosphereGases"];
  missions?: PlanetConfig["missions"];
  trivia?: PlanetConfig["trivia"];
  moons?: PlanetConfig["moons"];
  config?: PlanetConfig;
} | null;

interface SpaceStore {
  // Physics & Gravity
  gravityEnabled: boolean;
  toggleGravity: () => void;
  gravityTransitioning: boolean;
  setGravityTransitioning: (val: boolean) => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;
  ambientVolume: number;
  setAmbientVolume: (vol: number) => void;

  // Visual & Scaling
  bloomIntensity: number;
  setBloomIntensity: (intensity: number) => void;
  showAsteroids: boolean;
  toggleAsteroids: () => void;
  showOrbits: boolean;
  toggleOrbits: () => void;
  scaleMode: ScaleMode;
  setScaleMode: (mode: ScaleMode) => void;

  // Real-Time Ephemeris & Time Controls
  simDate: Date;
  simSpeed: number; // 0 = paused, 1 = 1 day/sec, 10, 50, etc.
  isPlaying: boolean;
  useRealTimeDate: boolean;
  setSimDate: (date: Date) => void;
  setSimSpeed: (speed: number) => void;
  togglePlay: () => void;
  resetToCurrentDate: () => void;

  // HUD & Focus Target
  selectedObject: SelectedObject;
  setSelectedObject: (obj: SelectedObject) => void;
  focusedObjectId: string | null;
  setFocusedObjectId: (id: string | null) => void;
  detailTab: DetailTab;
  setDetailTab: (tab: DetailTab) => void;

  // Mission Control Panel
  controlPanelOpen: boolean;
  toggleControlPanel: () => void;

  // Scene Reset
  resetView: boolean;
  triggerResetView: () => void;
  clearResetView: () => void;

  // Color Temp
  colorTemp: number;
  setColorTemp: (temp: number) => void;
}

export const useSpaceStore = create<SpaceStore>((set) => ({
  // Gravity
  gravityEnabled: true,
  toggleGravity: () =>
    set((s) => ({
      gravityEnabled: !s.gravityEnabled,
      gravityTransitioning: true,
    })),
  gravityTransitioning: false,
  setGravityTransitioning: (val) => set({ gravityTransitioning: val }),

  // Sound
  soundEnabled: false,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  ambientVolume: 0.4,
  setAmbientVolume: (vol) => set({ ambientVolume: vol }),

  // Visual & Scale
  bloomIntensity: 1.5,
  setBloomIntensity: (intensity) => set({ bloomIntensity: intensity }),
  showAsteroids: true,
  toggleAsteroids: () => set((s) => ({ showAsteroids: !s.showAsteroids })),
  showOrbits: true,
  toggleOrbits: () => set((s) => ({ showOrbits: !s.showOrbits })),
  scaleMode: "calibrated",
  setScaleMode: (mode) => set({ scaleMode: mode }),

  // Ephemeris & Time
  simDate: new Date(),
  simSpeed: 1,
  isPlaying: true,
  useRealTimeDate: true,
  setSimDate: (date) => set({ simDate: date, useRealTimeDate: false }),
  setSimSpeed: (speed) => set({ simSpeed: speed, isPlaying: speed > 0 }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  resetToCurrentDate: () => set({ simDate: new Date(), useRealTimeDate: true, isPlaying: true, simSpeed: 1 }),

  // HUD & Focus
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj, detailTab: "overview" }),
  focusedObjectId: null,
  setFocusedObjectId: (id) => set({ focusedObjectId: id }),
  detailTab: "overview",
  setDetailTab: (tab) => set({ detailTab: tab }),

  // Control Panel
  controlPanelOpen: true,
  toggleControlPanel: () => set((s) => ({ controlPanelOpen: !s.controlPanelOpen })),

  // Scene Reset
  resetView: false,
  triggerResetView: () => set({ resetView: true, focusedObjectId: null }),
  clearResetView: () => set({ resetView: false }),

  // Color Temp
  colorTemp: 0,
  setColorTemp: (temp) => set({ colorTemp: temp }),
}));
