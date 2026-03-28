// celestialData.ts
// Real Solar System data including physical properties and orbital characteristics.

export type SpectralClass = "O" | "B" | "A" | "F" | "G" | "K" | "M";

export interface StarColor {
  class: SpectralClass;
  color: string;
  temp: number; // Kelvin
  probability: number; // 0-1
  size: number; // relative size multiplier
}

export const STAR_COLORS: StarColor[] = [
  { class: "O", color: "#9bb0ff", temp: 35000, probability: 0.002, size: 2.5 },
  { class: "B", color: "#aabfff", temp: 15000, probability: 0.015, size: 1.8 },
  { class: "A", color: "#d8e8ff", temp: 8500, probability: 0.06, size: 1.4 },
  { class: "F", color: "#f8f8ff", temp: 6800, probability: 0.12, size: 1.1 },
  { class: "G", color: "#fff5d9", temp: 5500, probability: 0.2, size: 1.0 },
  { class: "K", color: "#ffddb4", temp: 4000, probability: 0.28, size: 0.85 },
  { class: "M", color: "#ff8b6b", temp: 2800, probability: 0.323, size: 0.6 },
];

export function pickStarColor(): StarColor {
  const r = Math.random();
  let cumulative = 0;
  for (const star of STAR_COLORS) {
    cumulative += star.probability;
    if (r < cumulative) return star;
  }
  return STAR_COLORS[STAR_COLORS.length - 1];
}

export interface PlanetConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitInclination: number;
  tilt: number;
  color: string;
  emissive: string;
  roughness: number;
  metalness: number;
  atmosphereColor: string;
  atmosphereIntensity: number;
  hasRings: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColor?: string;
  ringOpacity?: number;
  moons: MoonConfig[];
  distanceLY: string; // for compatibility, though we'll use AU for display
  rotationSpeed: number;
  
  // Detailed physics data for HUD
  stats: {
    distanceAU: number;
    gravity: number; // m/s^2
    temperature: string; // Range or Average
    dayLength: string;
    yearLength: string;
    mass: string; // relative to earth or absolute
    composition: string;
  };
}

export interface MoonConfig {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  color: string;
}

export const PLANETS: PlanetConfig[] = [
  {
    id: "mercury",
    name: "Mercury",
    type: "Terrestrial",
    description: "The smallest and innermost planet, a scorched world of iron and rock.",
    radius: 0.38,
    orbitRadius: 8,
    orbitSpeed: 0.47,
    orbitInclination: 0.12,
    tilt: 0.0001,
    color: "#a5a5a5",
    emissive: "#221100",
    roughness: 0.9,
    metalness: 0.2,
    atmosphereColor: "#ffffff",
    atmosphereIntensity: 0,
    hasRings: false,
    moons: [],
    distanceLY: "0.000006",
    rotationSpeed: 0.01,
    stats: {
      distanceAU: 0.39,
      gravity: 3.7,
      temperature: "−173 to 427°C",
      dayLength: "58.6 Earth days",
      yearLength: "88 Earth days",
      mass: "3.28e23 kg",
      composition: "Iron/Silicate rock",
    },
  },
  {
    id: "venus",
    name: "Venus",
    type: "Terrestrial",
    description: "Earth's 'evil twin', a world trapped in a runaway greenhouse effect.",
    radius: 0.95,
    orbitRadius: 12,
    orbitSpeed: 0.35,
    orbitInclination: 0.06,
    tilt: 3.09, // retrograde rotation handled visually by negative speed or tilt
    color: "#e3bb76",
    emissive: "#332200",
    roughness: 0.8,
    metalness: 0.0,
    atmosphereColor: "#ffcc33",
    atmosphereIntensity: 0.8,
    hasRings: false,
    moons: [],
    distanceLY: "0.000011",
    rotationSpeed: -0.005,
    stats: {
      distanceAU: 0.72,
      gravity: 8.87,
      temperature: "464°C (Average)",
      dayLength: "243 Earth days",
      yearLength: "224.7 Earth days",
      mass: "4.87e24 kg",
      composition: "Silicate rock/Iron core",
    },
  },
  {
    id: "earth",
    name: "Earth",
    type: "Terrestrial",
    description: "Our home, the only known world to harbor life and liquid surface water.",
    radius: 1.0,
    orbitRadius: 18,
    orbitSpeed: 0.29,
    orbitInclination: 0,
    tilt: 0.41,
    color: "#2d6fa4",
    emissive: "#0a1a2e",
    roughness: 0.6,
    metalness: 0.1,
    atmosphereColor: "#4db8ff",
    atmosphereIntensity: 0.4,
    hasRings: false,
    moons: [
      { name: "The Moon", radius: 0.27, orbitRadius: 2.2, orbitSpeed: 1.2, color: "#8a8a8a" },
    ],
    distanceLY: "0.0000158",
    rotationSpeed: 0.3,
    stats: {
      distanceAU: 1.0,
      gravity: 9.81,
      temperature: "-88 to 58°C",
      dayLength: "24 hours",
      yearLength: "365.25 days",
      mass: "5.97e24 kg",
      composition: "Nitrogen/Oxygen, Silicate rock",
    },
  },
  {
    id: "mars",
    name: "Mars",
    type: "Terrestrial",
    description: "The Red Planet, home to Olympus Mons and Valles Marineris.",
    radius: 0.53,
    orbitRadius: 26,
    orbitSpeed: 0.24,
    orbitInclination: 0.03,
    tilt: 0.44,
    color: "#c1440e",
    emissive: "#200a00",
    roughness: 0.9,
    metalness: 0.1,
    atmosphereColor: "#ff9966",
    atmosphereIntensity: 0.15,
    hasRings: false,
    moons: [
      { name: "Phobos", radius: 0.08, orbitRadius: 1.2, orbitSpeed: 2.5, color: "#444444" },
      { name: "Deimos", radius: 0.05, orbitRadius: 1.8, orbitSpeed: 1.8, color: "#555555" },
    ],
    distanceLY: "0.000024",
    rotationSpeed: 0.28,
    stats: {
      distanceAU: 1.52,
      gravity: 3.71,
      temperature: "−153 to 20°C",
      dayLength: "24.6 hours",
      yearLength: "687 Earth days",
      mass: "6.39e23 kg",
      composition: "Iron Oxide, Silicate rock",
    },
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "Gas Giant",
    description: "The king of planets, a massive gas giant with a 400-year-old storm.",
    radius: 2.8,
    orbitRadius: 45,
    orbitSpeed: 0.13,
    orbitInclination: 0.02,
    tilt: 0.05,
    color: "#d39c7e",
    emissive: "#1a1005",
    roughness: 0.3,
    metalness: 0.0,
    atmosphereColor: "#ffddaa",
    atmosphereIntensity: 0.4,
    hasRings: true,
    ringInnerRadius: 3.2,
    ringOuterRadius: 3.5,
    ringColor: "#998877",
    ringOpacity: 0.1,
    moons: [
      { name: "Io", radius: 0.25, orbitRadius: 4.5, orbitSpeed: 1.8, color: "#f3e03b" },
      { name: "Europa", radius: 0.22, orbitRadius: 6.0, orbitSpeed: 1.4, color: "#abc4ff" },
      { name: "Ganymede", radius: 0.35, orbitRadius: 8.0, orbitSpeed: 0.9, color: "#8a8a8a" },
    ],
    distanceLY: "0.000082",
    rotationSpeed: 0.7,
    stats: {
      distanceAU: 5.2,
      gravity: 24.79,
      temperature: "−110°C (Average)",
      dayLength: "9.9 hours",
      yearLength: "11.8 Earth years",
      mass: "1.89e27 kg",
      composition: "Hydrogen, Helium",
    },
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "Gas Giant",
    description: "Adorned with a spectacular ring system, Saturn is the jewel of the Solar System.",
    radius: 2.4,
    orbitRadius: 65,
    orbitSpeed: 0.09,
    orbitInclination: 0.04,
    tilt: 0.47,
    color: "#ead6b8",
    emissive: "#1a1505",
    roughness: 0.4,
    metalness: 0.0,
    atmosphereColor: "#ffecb3",
    atmosphereIntensity: 0.35,
    hasRings: true,
    ringInnerRadius: 3.5,
    ringOuterRadius: 7.5,
    ringColor: "#d4a060",
    ringOpacity: 0.5,
    moons: [
      { name: "Titan", radius: 0.38, orbitRadius: 9.5, orbitSpeed: 0.6, color: "#ffcc33" },
      { name: "Enceladus", radius: 0.12, orbitRadius: 4.8, orbitSpeed: 1.2, color: "#ffffff" },
    ],
    distanceLY: "0.00015",
    rotationSpeed: 0.65,
    stats: {
      distanceAU: 9.58,
      gravity: 10.44,
      temperature: "−140°C (Average)",
      dayLength: "10.7 hours",
      yearLength: "29.4 Earth years",
      mass: "5.68e26 kg",
      composition: "Hydrogen, Helium",
    },
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "Ice Giant",
    description: "An ice giant that rotates on its side, nearly 90 degrees from its orbital plane.",
    radius: 1.8,
    orbitRadius: 85,
    orbitSpeed: 0.06,
    orbitInclination: 0.01,
    tilt: 1.71, // 98 degrees
    color: "#afeeee",
    emissive: "#0a2020",
    roughness: 0.5,
    metalness: 0.0,
    atmosphereColor: "#b2ffff",
    atmosphereIntensity: 0.3,
    hasRings: true,
    ringInnerRadius: 2.2,
    ringOuterRadius: 3.0,
    ringColor: "#88aaaa",
    ringOpacity: 0.15,
    moons: [
      { name: "Titania", radius: 0.22, orbitRadius: 4.5, orbitSpeed: 0.5, color: "#999999" },
    ],
    distanceLY: "0.0003",
    rotationSpeed: 0.45,
    stats: {
      distanceAU: 19.22,
      gravity: 8.69,
      temperature: "−195°C (Average)",
      dayLength: "17.2 hours",
      yearLength: "84 Earth years",
      mass: "8.68e25 kg",
      composition: "Water/Methane/Ammonia ice",
    },
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "Ice Giant",
    description: "The most distant planet from the Sun, a dark world of supersonic winds.",
    radius: 1.7,
    orbitRadius: 105,
    orbitSpeed: 0.05,
    orbitInclination: 0.03,
    tilt: 0.49,
    color: "#3f54ba",
    emissive: "#050a30",
    roughness: 0.4,
    metalness: 0.0,
    atmosphereColor: "#5080ff",
    atmosphereIntensity: 0.35,
    hasRings: true,
    ringInnerRadius: 2.1,
    ringOuterRadius: 2.8,
    ringColor: "#5577ff",
    ringOpacity: 0.1,
    moons: [
      { name: "Triton", radius: 0.28, orbitRadius: 4.0, orbitSpeed: -0.8, color: "#ffcccc" },
    ],
    distanceLY: "0.00047",
    rotationSpeed: 0.48,
    stats: {
      distanceAU: 30.06,
      gravity: 11.15,
      temperature: "−201°C (Average)",
      dayLength: "16.1 hours",
      yearLength: "164.8 Earth years",
      mass: "1.02e26 kg",
      composition: "Water/Methane/Ammonia ice",
    },
  },
];

export interface NebulaConfig {
  id: string;
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  colorA: string;
  colorB: string;
  colorC: string;
  opacity: number;
  rotationSpeed: number;
  type: string;
  distance: string;
}

export const NEBULAE: NebulaConfig[] = [
  {
    id: "orion-revisited",
    name: "Orion Nebula (M42)",
    type: "Stellar Nursery",
    position: [-180, 40, -400],
    scale: [120, 80, 90],
    colorA: "#ff3366",
    colorB: "#ffaa00",
    colorC: "#220011",
    opacity: 0.12,
    rotationSpeed: 0.00005,
    distance: "1,344 ly",
  },
];

export interface GalaxySmear {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  opacity: number;
}

export const GALAXY_SMEARS: GalaxySmear[] = [
  {
    id: "milky-way",
    position: [0, -100, -800],
    rotation: [0.3, 0, 0.1],
    scale: [400, 50, 200],
    color: "#ffccaa",
    opacity: 0.04,
  },
];
