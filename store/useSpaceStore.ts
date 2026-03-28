import { create } from "zustand";

export type SelectedObject = {
  id?: string;
  name: string;
  type: string;
  distance: string;
  description?: string;
  stats?: {
    distanceAU: number;
    gravity: number;
    temperature: string;
    dayLength: string;
    yearLength: string;
    mass: string;
    composition: string;
  };
} | null;

interface SpaceStore {
  // Physics
  gravityEnabled: boolean;
  toggleGravity: () => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;
  ambientVolume: number;
  setAmbientVolume: (vol: number) => void;

  // Visual
  bloomIntensity: number;
  setBloomIntensity: (intensity: number) => void;
  showAsteroids: boolean;
  toggleAsteroids: () => void;
  showOrbits: boolean;
  toggleOrbits: () => void;

  // HUD
  selectedObject: SelectedObject;
  setSelectedObject: (obj: SelectedObject) => void;

  // Control panel
  controlPanelOpen: boolean;
  toggleControlPanel: () => void;

  // Scene state
  resetView: boolean;
  triggerResetView: () => void;
  clearResetView: () => void;

  // Color temperature (0 = cool blue, 0.5 = neutral, 1 = warm gold)
  colorTemp: number;
  setColorTemp: (temp: number) => void;

  // Transition
  gravityTransitioning: boolean;
  setGravityTransitioning: (val: boolean) => void;
}

export const useSpaceStore = create<SpaceStore>((set) => ({
  gravityEnabled: true,
  toggleGravity: () =>
    set((s) => ({
      gravityEnabled: !s.gravityEnabled,
      gravityTransitioning: true,
    })),

  soundEnabled: false,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  ambientVolume: 0.4,
  setAmbientVolume: (vol) => set({ ambientVolume: vol }),

  bloomIntensity: 1.5,
  setBloomIntensity: (intensity) => set({ bloomIntensity: intensity }),
  showAsteroids: true,
  toggleAsteroids: () => set((s) => ({ showAsteroids: !s.showAsteroids })),
  showOrbits: true,
  toggleOrbits: () => set((s) => ({ showOrbits: !s.showOrbits })),

  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  controlPanelOpen: true,
  toggleControlPanel: () => set((s) => ({ controlPanelOpen: !s.controlPanelOpen })),

  resetView: false,
  triggerResetView: () => set({ resetView: true }),
  clearResetView: () => set({ resetView: false }),

  colorTemp: 0,
  setColorTemp: (temp) => set({ colorTemp: temp }),

  gravityTransitioning: false,
  setGravityTransitioning: (val) => set({ gravityTransitioning: val }),
}));
