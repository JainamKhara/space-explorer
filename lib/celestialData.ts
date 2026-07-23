// celestialData.ts
// Real Solar System data including physical properties, orbital characteristics, space missions, and Keplerian Ephemeris engine.

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

export interface AtmosphereGas {
  name: string;
  percentage: number;
  color: string;
}

export interface SpaceMission {
  name: string;
  year: string;
  agency: string;
  type: string;
  description: string;
}

export interface MoonConfig {
  name: string;
  radius: number; // Visual scale or km ratio
  diameterKm: number;
  orbitRadius: number;
  orbitSpeed: number;
  color: string;
  description?: string;
}

export interface KeplerianElements {
  a: number; // Semi-major axis in AU
  e: number; // Eccentricity
  i: number; // Inclination in degrees
  L0: number; // Mean longitude at J2000 (deg)
  wBar: number; // Longitude of perihelion at J2000 (deg)
  node: number; // Longitude of ascending node at J2000 (deg)
  dailyMotion: number; // Mean daily motion (deg/day)
}

export interface CelestialBodyStats {
  radiusKm: number;
  radiusEarthRatio: number;
  massKg: string;
  massEarthRatio: number;
  gravityMs2: number;
  gravityEarthRatio: number;
  densityGcm3: number;
  escapeVelocityKms: number;
  surfaceAreaKm2: string;
  volumeKm3: string;
  distanceAU: number;
  distanceKm: string;
  temperature: string;
  tempKelvin: number;
  dayLength: string;
  yearLength: string;
  axialTiltDeg: number;
  spectralClass?: string;
  ageGyr?: number;
  luminosityWatts?: string;
  coreTempK?: string;
}

export interface PlanetConfig {
  id: string;
  name: string;
  type: string;
  spectralClass?: string;
  description: string;
  tagline: string;
  
  // Scale representations
  radius: number; // Visual calibrated scale radius (Earth = 1.0)
  radiusTrueRatio: number; // Strict relative radius ratio (Earth = 1.0)
  radiusLogarithmic: number; // Log scale radius
  
  orbitRadius: number; // Calibrated orbit radius for visualization
  orbitSpeed: number;
  orbitInclination: number;
  tilt: number; // Axial tilt in radians
  
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
  atmosphereGases: AtmosphereGas[];
  missions: SpaceMission[];
  trivia: string[];
  
  rotationSpeed: number;
  keplerian: KeplerianElements;
  stats: CelestialBodyStats;
}

// ----------------------------------------------------
// THE SUN (Central Star)
// ----------------------------------------------------
export const SUN_CONFIG: PlanetConfig = {
  id: "sun",
  name: "The Sun (Sol)",
  type: "Yellow Dwarf Star",
  spectralClass: "G2V",
  tagline: "The beating thermonuclear heart of our solar system",
  description: "A main-sequence G-type star that contains 99.86% of all mass in the Solar System. Driven by hydrogen fusion at 15 million Kelvin, it generates light, heat, and space weather that shapes every world.",
  
  radius: 3.8, // Calibrated for viewability
  radiusTrueRatio: 109.2, // Real ratio: Sun is 109.2x Earth's radius!
  radiusLogarithmic: 7.2,
  
  orbitRadius: 0,
  orbitSpeed: 0,
  orbitInclination: 0,
  tilt: 0.126, // 7.25 deg axial tilt to ecliptic
  
  color: "#ffdd88",
  emissive: "#ffaa33",
  roughness: 0,
  metalness: 0,
  atmosphereColor: "#ffaa22",
  atmosphereIntensity: 1.5,
  
  hasRings: false,
  moons: [],
  
  atmosphereGases: [
    { name: "Hydrogen (H)", percentage: 73.46, color: "#ff4b4b" },
    { name: "Helium (He)", percentage: 24.85, color: "#ffb834" },
    { name: "Oxygen (O)", percentage: 0.77, color: "#34b8ff" },
    { name: "Carbon (C)", percentage: 0.29, color: "#a855f7" },
    { name: "Iron & Heavy Elements", percentage: 0.63, color: "#94a3b8" },
  ],
  
  missions: [
    { name: "SOHO", year: "1995", agency: "ESA / NASA", type: "Solar Observatory", description: "Continuously monitoring solar interior, corona, and coronal mass ejections." },
    { name: "SDO", year: "2010", agency: "NASA", type: "Solar Dynamics", description: "High-definition imaging of solar magnetic field and solar flares." },
    { name: "Parker Solar Probe", year: "2018", agency: "NASA", type: "Corona Touch", description: "Flew directly through the Sun's outer corona at speeds up to 690,000 km/h." },
    { name: "Solar Orbiter", year: "2020", agency: "ESA / NASA", type: "Polar Explorer", description: "Capturing first high-resolution imagery of the Sun's mysterious polar regions." },
    { name: "Aditya-L1", year: "2023", agency: "ISRO", type: "L1 Observatory", description: "Studying solar upper atmospheric dynamics and coronal heating." },
  ],
  
  trivia: [
    "The Sun converts 600 million tons of hydrogen into helium every single second, releasing vast energy.",
    "Light takes 8 minutes and 20 seconds to travel from the Sun's photosphere to Earth.",
    "99.86% of the entire Solar System's mass resides within the Sun.",
    "The Sun's core density is 150 times that of liquid water, under pressure of 265 billion bar.",
  ],
  
  rotationSpeed: 0.05,
  keplerian: { a: 0, e: 0, i: 0, L0: 0, wBar: 0, node: 0, dailyMotion: 0 },
  
  stats: {
    radiusKm: 696340,
    radiusEarthRatio: 109.2,
    massKg: "1.989 × 10³⁰ kg",
    massEarthRatio: 333000,
    gravityMs2: 274.0,
    gravityEarthRatio: 27.9,
    densityGcm3: 1.408,
    escapeVelocityKms: 617.7,
    surfaceAreaKm2: "6.09 × 10¹² km²",
    volumeKm3: "1.41 × 10¹⁸ km³",
    distanceAU: 0,
    distanceKm: "0 km",
    temperature: "5,505°C (Surface) / 15.7M°C (Core)",
    tempKelvin: 5778,
    dayLength: "25 to 35 Earth days",
    yearLength: "230 Million Earth years (Galactic Orbit)",
    axialTiltDeg: 7.25,
    spectralClass: "G2V Yellow Dwarf",
    ageGyr: 4.603,
    luminosityWatts: "3.828 × 10²⁶ W",
    coreTempK: "15,700,000 K",
  },
};

// ----------------------------------------------------
// THE 8 PLANETS DATASET
// ----------------------------------------------------
export const PLANETS: PlanetConfig[] = [
  // 1. MERCURY
  {
    id: "mercury",
    name: "Mercury",
    type: "Terrestrial Planet",
    tagline: "A cratered world of metallic fire and frozen ice",
    description: "The smallest planet and closest to the Sun. Mercury is a dense metallic world with virtually no atmosphere, enduring extreme temperature swings from scorchingly hot to deeply frozen.",
    
    radius: 0.42,
    radiusTrueRatio: 0.383,
    radiusLogarithmic: 0.55,
    
    orbitRadius: 8,
    orbitSpeed: 0.47,
    orbitInclination: 0.12,
    tilt: 0.0006, // 0.034 deg
    
    color: "#a5a5a5",
    emissive: "#1a120b",
    roughness: 0.9,
    metalness: 0.3,
    atmosphereColor: "#e2e8f0",
    atmosphereIntensity: 0.05,
    
    hasRings: false,
    moons: [],
    
    atmosphereGases: [
      { name: "Oxygen (O2)", percentage: 42.0, color: "#38bdf8" },
      { name: "Sodium (Na)", percentage: 29.0, color: "#fbbf24" },
      { name: "Hydrogen (H2)", percentage: 22.0, color: "#f43f5e" },
      { name: "Helium (He)", percentage: 6.0, color: "#a855f7" },
      { name: "Potassium & Others", percentage: 1.0, color: "#4ade80" },
    ],
    
    missions: [
      { name: "Mariner 10", year: "1974", agency: "NASA", type: "Flyby", description: "First spacecraft to visit Mercury, mapping 45% of its surface." },
      { name: "MESSENGER", year: "2004", agency: "NASA", type: "Orbiter", description: "Discovered water ice in permanently shadowed polar craters." },
      { name: "BepiColombo", year: "2018", agency: "ESA / JAXA", type: "Dual Orbiter", description: "En route to measure Mercury's magnetic field and internal structure." },
    ],
    
    trivia: [
      "Despite being closest to the Sun, Venus is hotter than Mercury due to Venus's dense atmosphere.",
      "Mercury's core accounts for nearly 85% of the planet's radius, making it surprisingly metallic.",
      "A solar day on Mercury (sunrise to sunrise) lasts 176 Earth days—twice as long as its year!",
    ],
    
    rotationSpeed: 0.01,
    
    keplerian: {
      a: 0.387098,
      e: 0.205630,
      i: 7.0049,
      L0: 252.2509,
      wBar: 77.4564,
      node: 48.3317,
      dailyMotion: 4.092334,
    },
    
    stats: {
      radiusKm: 2439.7,
      radiusEarthRatio: 0.383,
      massKg: "3.301 × 10²³ kg",
      massEarthRatio: 0.055,
      gravityMs2: 3.7,
      gravityEarthRatio: 0.38,
      densityGcm3: 5.427,
      escapeVelocityKms: 4.25,
      surfaceAreaKm2: "7.48 × 10⁷ km²",
      volumeKm3: "6.08 × 10¹⁰ km³",
      distanceAU: 0.387,
      distanceKm: "57.9 Million km",
      temperature: "−180°C to 430°C",
      tempKelvin: 440,
      dayLength: "58.6 Earth days",
      yearLength: "87.97 Earth days",
      axialTiltDeg: 0.034,
    },
  },

  // 2. VENUS
  {
    id: "venus",
    name: "Venus",
    type: "Terrestrial Planet",
    tagline: "A runaway greenhouse furnace swathed in acid clouds",
    description: "Earth's structural twin in size and mass, but a scorching hellscape in climate. Trapped beneath thick carbon dioxide clouds and sulfuric acid rain, its surface pressure equals 900 meters underwater.",
    
    radius: 0.95,
    radiusTrueRatio: 0.949,
    radiusLogarithmic: 0.96,
    
    orbitRadius: 13,
    orbitSpeed: 0.35,
    orbitInclination: 0.06,
    tilt: 3.096, // 177.36 deg
    
    color: "#e3bb76",
    emissive: "#261a08",
    roughness: 0.8,
    metalness: 0.1,
    atmosphereColor: "#ffcc33",
    atmosphereIntensity: 0.85,
    
    hasRings: false,
    moons: [],
    
    atmosphereGases: [
      { name: "Carbon Dioxide (CO2)", percentage: 96.5, color: "#f97316" },
      { name: "Nitrogen (N2)", percentage: 3.5, color: "#38bdf8" },
      { name: "Sulfur Dioxide (SO2)", percentage: 0.015, color: "#eab308" },
      { name: "Argon & Water Vapor", percentage: 0.01, color: "#a855f7" },
    ],
    
    missions: [
      { name: "Venera 7", year: "1970", agency: "Roscosmos", type: "Surface Lander", description: "First spacecraft to successfully land on another planet and transmit data." },
      { name: "Magellan", year: "1989", agency: "NASA", type: "Radar Mapper", description: "Mapped 98% of Venusian surface topology through dense clouds." },
      { name: "Venus Express", year: "2005", agency: "ESA", type: "Atmospheric Orbiter", description: "Studied lightning, polar vortices, and cloud super-rotation." },
      { name: "Akatsuki", year: "2010", agency: "JAXA", type: "Climate Orbiter", description: "Analyzed weather patterns and acid cloud dynamics." },
    ],
    
    trivia: [
      "Venus is the hottest planet in the Solar System with surface temperatures exceeding 464°C—hot enough to melt lead!",
      "Venus rotates backwards (retrograde) compared to most planets; the Sun rises in the west and sets in the east.",
      "The atmospheric pressure at Venus's surface is 92 times greater than Earth's sea-level pressure.",
    ],
    
    rotationSpeed: -0.005,
    
    keplerian: {
      a: 0.723332,
      e: 0.006773,
      i: 3.3947,
      L0: 181.9798,
      wBar: 131.5329,
      node: 76.6807,
      dailyMotion: 1.60213,
    },
    
    stats: {
      radiusKm: 6051.8,
      radiusEarthRatio: 0.949,
      massKg: "4.867 × 10²⁴ kg",
      massEarthRatio: 0.815,
      gravityMs2: 8.87,
      gravityEarthRatio: 0.904,
      densityGcm3: 5.243,
      escapeVelocityKms: 10.36,
      surfaceAreaKm2: "4.60 × 10⁸ km²",
      volumeKm3: "9.28 × 10¹¹ km³",
      distanceAU: 0.723,
      distanceKm: "108.2 Million km",
      temperature: "464°C (Constant Surface)",
      tempKelvin: 737,
      dayLength: "243 Earth days (Retrograde)",
      yearLength: "224.7 Earth days",
      axialTiltDeg: 177.36,
    },
  },

  // 3. EARTH
  {
    id: "earth",
    name: "Earth",
    type: "Terrestrial Planet",
    tagline: "The vibrant blue marble of liquid oceans and living organisms",
    description: "Our home world, the third planet from the Sun and the only celestial body known to harbor life. Rich in nitrogen-oxygen air, protective magnetic fields, and vast liquid water oceans.",
    
    radius: 1.0,
    radiusTrueRatio: 1.0,
    radiusLogarithmic: 1.0,
    
    orbitRadius: 19,
    orbitSpeed: 0.29,
    orbitInclination: 0.0,
    tilt: 0.409, // 23.44 deg
    
    color: "#2d6fa4",
    emissive: "#091726",
    roughness: 0.5,
    metalness: 0.15,
    atmosphereColor: "#38bdf8",
    atmosphereIntensity: 0.5,
    
    hasRings: false,
    moons: [
      {
        name: "The Moon (Luna)",
        radius: 0.27,
        diameterKm: 3474.8,
        orbitRadius: 2.3,
        orbitSpeed: 1.2,
        color: "#94a3b8",
        description: "Earth's only natural satellite, causing ocean tides and stabilizing axial tilt.",
      },
    ],
    
    atmosphereGases: [
      { name: "Nitrogen (N2)", percentage: 78.08, color: "#3b82f6" },
      { name: "Oxygen (O2)", percentage: 20.95, color: "#06b6d4" },
      { name: "Argon (Ar)", percentage: 0.93, color: "#8b5cf6" },
      { name: "Carbon Dioxide & Trace", percentage: 0.04, color: "#ef4444" },
    ],
    
    missions: [
      { name: "International Space Station", year: "1998", agency: "NASA / ESA / JAXA / CSA", type: "Orbital Laboratory", description: "Continuous human presence in low Earth orbit conducting microgravity science." },
      { name: "Hubble Telescope", year: "1990", agency: "NASA / ESA", type: "Space Telescope", description: "Revolutionized astronomy with deep field imagery of ancient galaxies." },
      { name: "James Webb Telescope", year: "2021", agency: "NASA / ESA / CSA", type: "Infrared Observatory", description: "Observing first stars, galaxies, and exoplanet atmospheres at L2." },
    ],
    
    trivia: [
      "Earth's magnetic field is generated by molten iron-nickel convection currents in its outer core.",
      "Liquid water covers 70.8% of Earth's surface, with average ocean depths of 3.7 km.",
      "Earth is the densest planet in the entire Solar System at 5.514 g/cm³.",
    ],
    
    rotationSpeed: 0.3,
    
    keplerian: {
      a: 1.000000,
      e: 0.016710,
      i: 0.00005,
      L0: 100.4643,
      wBar: 102.9377,
      node: 0.0,
      dailyMotion: 0.985609,
    },
    
    stats: {
      radiusKm: 6371.0,
      radiusEarthRatio: 1.0,
      massKg: "5.972 × 10²⁴ kg",
      massEarthRatio: 1.0,
      gravityMs2: 9.81,
      gravityEarthRatio: 1.0,
      densityGcm3: 5.514,
      escapeVelocityKms: 11.186,
      surfaceAreaKm2: "5.10 × 10⁸ km²",
      volumeKm3: "1.08 × 10¹² km³",
      distanceAU: 1.0,
      distanceKm: "149.6 Million km",
      temperature: "−89.2°C to 56.7°C (Avg 15°C)",
      tempKelvin: 288,
      dayLength: "23.93 Hours",
      yearLength: "365.25 Days",
      axialTiltDeg: 23.44,
    },
  },

  // 4. MARS
  {
    id: "mars",
    name: "Mars",
    type: "Terrestrial Planet",
    tagline: "The rust-colored desert of giant volcanoes and dried riverbeds",
    description: "The Red Planet gets its iconic hue from widespread iron oxide (rust) soil. Home to the solar system's tallest volcano, Olympus Mons, and massive canyon networks cut by ancient flowing rivers.",
    
    radius: 0.53,
    radiusTrueRatio: 0.532,
    radiusLogarithmic: 0.65,
    
    orbitRadius: 27,
    orbitSpeed: 0.24,
    orbitInclination: 0.03,
    tilt: 0.439, // 25.19 deg
    
    color: "#c1440e",
    emissive: "#260a04",
    roughness: 0.9,
    metalness: 0.15,
    atmosphereColor: "#f97316",
    atmosphereIntensity: 0.2,
    
    hasRings: false,
    moons: [
      { name: "Phobos", radius: 0.08, diameterKm: 22.2, orbitRadius: 1.2, orbitSpeed: 2.5, color: "#64748b", description: "Lumpy potato-shaped moon spiraling closer to Mars." },
      { name: "Deimos", radius: 0.05, diameterKm: 12.6, orbitRadius: 1.8, orbitSpeed: 1.8, color: "#475569", description: "Smaller outer moon gradually escaping Mars's gravity." },
    ],
    
    atmosphereGases: [
      { name: "Carbon Dioxide (CO2)", percentage: 95.32, color: "#f97316" },
      { name: "Nitrogen (N2)", percentage: 2.6, color: "#38bdf8" },
      { name: "Argon (Ar)", percentage: 1.9, color: "#a855f7" },
      { name: "Oxygen & Trace", percentage: 0.18, color: "#22c55e" },
    ],
    
    missions: [
      { name: "Viking 1 & 2", year: "1976", agency: "NASA", type: "Landers", description: "First successful long-term surface operations and soil bio-tests on Mars." },
      { name: "Curiosity Rover", year: "2012", agency: "NASA", type: "Robotic Lab", description: "Discovered ancient habitable freshwater lake environments in Gale Crater." },
      { name: "Perseverance & Ingenuity", year: "2021", agency: "NASA", type: "Rover & Helicopter", description: "Collecting core samples for Earth return and performed 72 powered flights." },
    ],
    
    trivia: [
      "Olympus Mons on Mars is 21.9 km high—nearly three times the height of Mount Everest!",
      "Valles Marineris canyon network stretches over 4,000 km long, engulfing 20% of Mars's circumference.",
      "Mars experiences planet-wide dust storms that can shroud the entire world for months.",
    ],
    
    rotationSpeed: 0.28,
    
    keplerian: {
      a: 1.523662,
      e: 0.093412,
      i: 1.8506,
      L0: 355.4533,
      wBar: 336.0408,
      node: 49.5785,
      dailyMotion: 0.524033,
    },
    
    stats: {
      radiusKm: 3389.5,
      radiusEarthRatio: 0.532,
      massKg: "6.417 × 10²³ kg",
      massEarthRatio: 0.107,
      gravityMs2: 3.72,
      gravityEarthRatio: 0.379,
      densityGcm3: 3.933,
      escapeVelocityKms: 5.03,
      surfaceAreaKm2: "1.45 × 10⁸ km²",
      volumeKm3: "1.63 × 10¹¹ km³",
      distanceAU: 1.524,
      distanceKm: "227.9 Million km",
      temperature: "−153°C to 20°C (Avg -63°C)",
      tempKelvin: 210,
      dayLength: "24.62 Hours (1 Sol)",
      yearLength: "687 Earth days",
      axialTiltDeg: 25.19,
    },
  },

  // 5. JUPITER
  {
    id: "jupiter",
    name: "Jupiter",
    type: "Gas Giant",
    tagline: "The massive monarch of cloud bands and roaring storms",
    description: "The largest planet in our solar system, containing twice as much mass as all other planets combined. Dominated by colorful swirling ammonia-cloud belts and the Great Red Spot storm.",
    
    radius: 2.8,
    radiusTrueRatio: 10.97,
    radiusLogarithmic: 2.4,
    
    orbitRadius: 46,
    orbitSpeed: 0.13,
    orbitInclination: 0.02,
    tilt: 0.054, // 3.13 deg
    
    color: "#d39c7e",
    emissive: "#21150c",
    roughness: 0.35,
    metalness: 0.05,
    atmosphereColor: "#fed7aa",
    atmosphereIntensity: 0.45,
    
    hasRings: true,
    ringInnerRadius: 3.1,
    ringOuterRadius: 3.5,
    ringColor: "#a38068",
    ringOpacity: 0.15,
    
    moons: [
      { name: "Io", radius: 0.25, diameterKm: 3643.2, orbitRadius: 4.5, orbitSpeed: 1.8, color: "#facc15", description: "Most volcanically active world in the Solar System with 400+ active erupting volcanoes." },
      { name: "Europa", radius: 0.22, diameterKm: 3121.6, orbitRadius: 6.0, orbitSpeed: 1.4, color: "#93c5fd", description: "Smooth ice crust concealing a deep subsurface liquid ocean harboring twice Earth's water." },
      { name: "Ganymede", radius: 0.35, diameterKm: 5268.2, orbitRadius: 8.0, orbitSpeed: 0.9, color: "#94a3b8", description: "Largest moon in the Solar System—bigger than planet Mercury, with its own magnetic field." },
    ],
    
    atmosphereGases: [
      { name: "Hydrogen (H2)", percentage: 89.8, color: "#ef4444" },
      { name: "Helium (He)", percentage: 10.2, color: "#f59e0b" },
      { name: "Methane (CH4)", percentage: 0.3, color: "#06b6d4" },
      { name: "Ammonia & Water", percentage: 0.02, color: "#a855f7" },
    ],
    
    missions: [
      { name: "Galileo", year: "1995", agency: "NASA", type: "Orbiter & Probe", description: "First spacecraft to orbit Jupiter and drop atmospheric probe into its clouds." },
      { name: "Juno", year: "2016", agency: "NASA", type: "Polar Orbiter", description: "Probing internal core, magnetosphere, and polar cyclonic storms." },
      { name: "JUICE", year: "2023", agency: "ESA", type: "Icy Moons Explorer", description: "En route to perform detailed orbit studies of Ganymede, Callisto, and Europa." },
    ],
    
    trivia: [
      "Jupiter's Great Red Spot is a hurricane larger than Earth that has raged for over 350 years.",
      "Jupiter spins faster than any other planet, completing a full rotation in under 10 hours.",
      "Jupiter's magnetic field is 20,000 times stronger than Earth's, stretching nearly to Saturn's orbit.",
    ],
    
    rotationSpeed: 0.7,
    
    keplerian: {
      a: 5.204267,
      e: 0.048498,
      i: 1.3030,
      L0: 34.4044,
      wBar: 14.7285,
      node: 100.5562,
      dailyMotion: 0.083091,
    },
    
    stats: {
      radiusKm: 69911.0,
      radiusEarthRatio: 10.97,
      massKg: "1.898 × 10²⁷ kg",
      massEarthRatio: 317.8,
      gravityMs2: 24.79,
      gravityEarthRatio: 2.528,
      densityGcm3: 1.326,
      escapeVelocityKms: 59.5,
      surfaceAreaKm2: "6.14 × 10¹⁰ km²",
      volumeKm3: "1.43 × 10¹⁵ km³",
      distanceAU: 5.204,
      distanceKm: "778.5 Million km",
      temperature: "−110°C (Cloud Top)",
      tempKelvin: 165,
      dayLength: "9.92 Hours",
      yearLength: "11.86 Earth years",
      axialTiltDeg: 3.13,
    },
  },

  // 6. SATURN
  {
    id: "saturn",
    name: "Saturn",
    type: "Gas Giant",
    tagline: "The jewel of the solar system wrapped in radiant ice rings",
    description: "Adorned with the most complex and dazzling ring system in the cosmic realm, Saturn is a lightweight gas giant composed mainly of hydrogen and helium that would literally float in water.",
    
    radius: 2.4,
    radiusTrueRatio: 9.14,
    radiusLogarithmic: 2.1,
    
    orbitRadius: 67,
    orbitSpeed: 0.09,
    orbitInclination: 0.04,
    tilt: 0.466, // 26.73 deg
    
    color: "#ead6b8",
    emissive: "#211b0e",
    roughness: 0.4,
    metalness: 0.05,
    atmosphereColor: "#fde68a",
    atmosphereIntensity: 0.4,
    
    hasRings: true,
    ringInnerRadius: 3.2,
    ringOuterRadius: 7.2,
    ringColor: "#d4a060",
    ringOpacity: 0.55,
    
    moons: [
      { name: "Titan", radius: 0.38, diameterKm: 5149.5, orbitRadius: 9.5, orbitSpeed: 0.6, color: "#fbbf24", description: "Has a thick nitrogen atmosphere, organic smog, and liquid methane/ethane seas." },
      { name: "Enceladus", radius: 0.12, diameterKm: 504.2, orbitRadius: 4.8, orbitSpeed: 1.2, color: "#ffffff", description: "Erupts saltwater icy geysers from hydrothermal vents in a hidden global ocean." },
    ],
    
    atmosphereGases: [
      { name: "Hydrogen (H2)", percentage: 96.3, color: "#ef4444" },
      { name: "Helium (He)", percentage: 3.25, color: "#f59e0b" },
      { name: "Methane (CH4)", percentage: 0.45, color: "#06b6d4" },
      { name: "Ammonia (NH3)", percentage: 0.01, color: "#a855f7" },
    ],
    
    missions: [
      { name: "Pioneer 11", year: "1979", agency: "NASA", type: "Flyby", description: "First spacecraft to visit Saturn, discovering the F ring and Titan's cold atmosphere." },
      { name: "Cassini-Huygens", year: "2004", agency: "NASA / ESA / ASI", type: "Orbiter & Titan Probe", description: "Spent 13 years exploring Saturn, landing Huygens probe on Titan and revealing Enceladus geysers." },
    ],
    
    trivia: [
      "Saturn's average density is 0.687 g/cm³—less dense than water! It would float in a giant bathtub.",
      "Saturn's main ring system spans 282,000 km across, yet is paper-thin—only about 10 meters thick in most areas.",
      "Saturn's north pole features a mysterious hexagonal cloud pattern storm over 30,000 km wide.",
    ],
    
    rotationSpeed: 0.65,
    
    keplerian: {
      a: 9.582617,
      e: 0.056551,
      i: 2.4852,
      L0: 50.0774,
      wBar: 92.4319,
      node: 113.6655,
      dailyMotion: 0.03346,
    },
    
    stats: {
      radiusKm: 58232.0,
      radiusEarthRatio: 9.14,
      massKg: "5.683 × 10²⁶ kg",
      massEarthRatio: 95.16,
      gravityMs2: 10.44,
      gravityEarthRatio: 1.065,
      densityGcm3: 0.687,
      escapeVelocityKms: 35.5,
      surfaceAreaKm2: "4.27 × 10¹⁰ km²",
      volumeKm3: "8.27 × 10¹⁴ km³",
      distanceAU: 9.583,
      distanceKm: "1.433 Billion km",
      temperature: "−140°C (Cloud Top)",
      tempKelvin: 134,
      dayLength: "10.55 Hours",
      yearLength: "29.46 Earth years",
      axialTiltDeg: 26.73,
    },
  },

  // 7. URANUS
  {
    id: "uranus",
    name: "Uranus",
    type: "Ice Giant",
    tagline: "The sideways-spinning cyan ice giant of extreme seasons",
    description: "An ice giant composed of water, methane, and ammonia icy slush. Uranus is unique for its extreme 98° axial tilt—it literally rolls around the Sun on its side during its 84-year orbit.",
    
    radius: 1.8,
    radiusTrueRatio: 3.98,
    radiusLogarithmic: 1.5,
    
    orbitRadius: 88,
    orbitSpeed: 0.06,
    orbitInclination: 0.01,
    tilt: 1.706, // 97.77 deg
    
    color: "#afeeee",
    emissive: "#092424",
    roughness: 0.5,
    metalness: 0.05,
    atmosphereColor: "#67e8f9",
    atmosphereIntensity: 0.35,
    
    hasRings: true,
    ringInnerRadius: 2.3,
    ringOuterRadius: 3.1,
    ringColor: "#64748b",
    ringOpacity: 0.25,
    
    moons: [
      { name: "Titania", radius: 0.22, diameterKm: 1577.8, orbitRadius: 4.5, orbitSpeed: 0.5, color: "#cbd5e1", description: "Largest moon of Uranus, laced with giant fault canyons." },
      { name: "Miranda", radius: 0.12, diameterKm: 471.6, orbitRadius: 2.8, orbitSpeed: 0.9, color: "#94a3b8", description: "Features Verona Rupes, the tallest cliff in the solar system (20 km high)." },
    ],
    
    atmosphereGases: [
      { name: "Hydrogen (H2)", percentage: 82.5, color: "#ef4444" },
      { name: "Helium (He)", percentage: 15.2, color: "#f59e0b" },
      { name: "Methane (CH4)", percentage: 2.3, color: "#06b6d4" },
    ],
    
    missions: [
      { name: "Voyager 2", year: "1986", agency: "NASA", type: "Flyby", description: "Sole spacecraft to visit Uranus, discovering 10 new moons and 2 dark rings." },
    ],
    
    trivia: [
      "Because Uranus rotates on its side, each pole spends 42 years in continuous daylight followed by 42 years of total darkness.",
      "Atmospheric temperatures on Uranus drop to -224°C, making it the coldest planet atmosphere in the Solar System.",
      "Uranus was the first planet discovered with a telescope by William Herschel in 1781.",
    ],
    
    rotationSpeed: 0.45,
    
    keplerian: {
      a: 19.201246,
      e: 0.046381,
      i: 0.7732,
      L0: 314.0550,
      wBar: 170.9642,
      node: 74.0006,
      dailyMotion: 0.01173,
    },
    
    stats: {
      radiusKm: 25362.0,
      radiusEarthRatio: 3.98,
      massKg: "8.681 × 10²⁵ kg",
      massEarthRatio: 14.54,
      gravityMs2: 8.69,
      gravityEarthRatio: 0.886,
      densityGcm3: 1.270,
      escapeVelocityKms: 21.3,
      surfaceAreaKm2: "8.08 × 10⁹ km²",
      volumeKm3: "6.83 × 10¹³ km³",
      distanceAU: 19.201,
      distanceKm: "2.871 Billion km",
      temperature: "−195°C to −224°C",
      tempKelvin: 76,
      dayLength: "17.24 Hours (Retrograde)",
      yearLength: "84.02 Earth years",
      axialTiltDeg: 97.77,
    },
  },

  // 8. NEPTUNE
  {
    id: "neptune",
    name: "Neptune",
    type: "Ice Giant",
    tagline: "The deep cobalt ice giant driven by supersonic tempest winds",
    description: "The most distant major planet in the Solar System. A dark, frigid world enveloped in deep azure methane atmosphere where supersonic winds scream at over 2,100 kilometers per hour.",
    
    radius: 1.7,
    radiusTrueRatio: 3.86,
    radiusLogarithmic: 1.45,
    
    orbitRadius: 108,
    orbitSpeed: 0.05,
    orbitInclination: 0.03,
    tilt: 0.494, // 28.32 deg
    
    color: "#3f54ba",
    emissive: "#081338",
    roughness: 0.4,
    metalness: 0.05,
    atmosphereColor: "#3b82f6",
    atmosphereIntensity: 0.4,
    
    hasRings: true,
    ringInnerRadius: 2.1,
    ringOuterRadius: 2.8,
    ringColor: "#60a5fa",
    ringOpacity: 0.2,
    
    moons: [
      { name: "Triton", radius: 0.28, diameterKm: 2706.8, orbitRadius: 4.0, orbitSpeed: -0.8, color: "#f472b6", description: "Orbits Neptune backwards (retrograde) with active nitrogen ice cryovolcanoes." },
    ],
    
    atmosphereGases: [
      { name: "Hydrogen (H2)", percentage: 80.0, color: "#ef4444" },
      { name: "Helium (He)", percentage: 19.0, color: "#f59e0b" },
      { name: "Methane (CH4)", percentage: 1.5, color: "#06b6d4" },
    ],
    
    missions: [
      { name: "Voyager 2", year: "1989", agency: "NASA", type: "Flyby", description: "Only spacecraft to reach Neptune, discovering the Great Dark Spot and Triton cryovolcanoes." },
    ],
    
    trivia: [
      "Neptune's winds are the fastest recorded in the Solar System, reaching 2,100 km/h (1,300 mph).",
      "Neptune was mathematically predicted by Urbain Le Verrier before it was ever observed through a telescope in 1846.",
      "Triton is slowly spiraling inward toward Neptune and will eventually be torn apart by tidal forces to form a ring system.",
    ],
    
    rotationSpeed: 0.48,
    
    keplerian: {
      a: 30.047194,
      e: 0.009456,
      i: 1.7699,
      L0: 304.3487,
      wBar: 44.9713,
      node: 131.7806,
      dailyMotion: 0.005981,
    },
    
    stats: {
      radiusKm: 24622.0,
      radiusEarthRatio: 3.86,
      massKg: "1.024 × 10²⁶ kg",
      massEarthRatio: 17.15,
      gravityMs2: 11.15,
      gravityEarthRatio: 1.137,
      densityGcm3: 1.638,
      escapeVelocityKms: 23.5,
      surfaceAreaKm2: "7.62 × 10⁹ km²",
      volumeKm3: "6.25 × 10¹³ km³",
      distanceAU: 30.047,
      distanceKm: "4.495 Billion km",
      temperature: "−201°C (Average)",
      tempKelvin: 72,
      dayLength: "16.11 Hours",
      yearLength: "164.79 Earth years",
      axialTiltDeg: 28.32,
    },
  },

  // 9. PLUTO
  {
    id: "pluto",
    name: "Pluto",
    type: "Dwarf Planet",
    tagline: "The icy heart of the Kuiper Belt",
    description: "A beloved dwarf planet of nitrogen ice, frozen glaciers, and methane snow in the outer reaches of the solar system. Pluto features a giant heart-shaped nitrogen ice plain called Tombaugh Regio.",
    
    radius: 0.35,
    radiusTrueRatio: 0.186,
    radiusLogarithmic: 0.45,
    
    orbitRadius: 128,
    orbitSpeed: 0.04,
    orbitInclination: 0.30,
    tilt: 2.138,
    
    color: "#d4a373",
    emissive: "#1a120b",
    roughness: 0.85,
    metalness: 0.1,
    atmosphereColor: "#93c5fd",
    atmosphereIntensity: 0.15,
    
    hasRings: false,
    moons: [
      { name: "Charon", radius: 0.18, diameterKm: 1212, orbitRadius: 1.5, orbitSpeed: 1.2, color: "#a3a3a3", description: "Pluto's massive moon—so large that Pluto and Charon orbit a shared center of mass outside Pluto." },
      { name: "Nix", radius: 0.04, diameterKm: 49, orbitRadius: 2.5, orbitSpeed: 2.0, color: "#cbd5e1" },
      { name: "Hydra", radius: 0.04, diameterKm: 51, orbitRadius: 3.2, orbitSpeed: 1.6, color: "#94a3b8" },
    ],
    
    atmosphereGases: [
      { name: "Nitrogen (N2)", percentage: 99.0, color: "#38bdf8" },
      { name: "Methane (CH4)", percentage: 0.5, color: "#f59e0b" },
      { name: "Carbon Monoxide (CO)", percentage: 0.5, color: "#a855f7" },
    ],
    
    missions: [
      { name: "New Horizons", year: "2015", agency: "NASA", type: "Flyby", description: "Historic first flyby of Pluto, revealing high-resolution images of Tombaugh Regio, icy mountains, and liquid nitrogen flow." },
    ],
    
    trivia: [
      "Pluto has a giant heart-shaped glacier named Tombaugh Regio, made of nitrogen and carbon monoxide ice.",
      "Pluto's orbit is tilted at 17 degrees to the ecliptic plane and is so eccentric that it occasionally moves closer to the Sun than Neptune!",
      "Charon is half the size of Pluto, forming a unique binary dwarf planet system in the Kuiper Belt.",
    ],
    
    rotationSpeed: 0.15,
    
    keplerian: {
      a: 39.481686,
      e: 0.248807,
      i: 17.1600,
      L0: 14.8645,
      wBar: 224.0667,
      node: 110.3039,
      dailyMotion: 0.003975,
    },
    
    stats: {
      radiusKm: 1188.3,
      radiusEarthRatio: 0.186,
      massKg: "1.303 × 10²² kg",
      massEarthRatio: 0.0022,
      gravityMs2: 0.62,
      gravityEarthRatio: 0.063,
      densityGcm3: 1.854,
      escapeVelocityKms: 1.21,
      surfaceAreaKm2: "1.77 × 10⁷ km²",
      volumeKm3: "7.05 × 10⁹ km³",
      distanceAU: 39.482,
      distanceKm: "5.906 Billion km",
      temperature: "−230°C (Average)",
      tempKelvin: 44,
      dayLength: "6.39 Earth days (Retrograde)",
      yearLength: "247.94 Earth years",
      axialTiltDeg: 122.53,
    },
  },
];

// ----------------------------------------------------
// KEPLERIAN EPHEMERIS ENGINE
// Computes real-time heliocentric positions for any date
// ----------------------------------------------------
export interface HeliocentricCoords {
  x: number; // Scene coordinate X
  y: number; // Scene coordinate Y
  z: number; // Scene coordinate Z
  distanceAU: number; // Real physical distance in AU
  trueAnomalyDeg: number;
}

export function getKeplerianPosition(
  planet: PlanetConfig,
  date: Date = new Date(),
  orbitRadiusScale: number = planet.orbitRadius
): HeliocentricCoords {
  if (planet.id === "sun" || !planet.keplerian || planet.keplerian.a === 0) {
    return { x: 0, y: 0, z: 0, distanceAU: 0, trueAnomalyDeg: 0 };
  }

  const k = planet.keplerian;
  
  // Calculate Julian Days from epoch J2000.0 (2000-01-01 12:00:00 UTC)
  const epochJ2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const d = (date.getTime() - epochJ2000) / (1000 * 60 * 60 * 24);

  // 1. Mean Anomaly (M) in radians
  const meanAnomalyDeg = (k.L0 + k.dailyMotion * d - k.wBar) % 360;
  let M = (meanAnomalyDeg * Math.PI) / 180;
  if (M < 0) M += Math.PI * 2;

  // 2. Solve Kepler's Equation E - e * sin(E) = M using Newton-Raphson
  let E = M;
  const e = k.e;
  for (let iter = 0; iter < 10; iter++) {
    const deltaE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= deltaE;
    if (Math.abs(deltaE) < 1e-7) break;
  }

  // 3. True Anomaly (nu) and Radius (r in AU)
  const sinE = Math.sin(E);
  const cosE = Math.cos(E);
  const r = k.a * (1 - e * cosE);

  const sinNu = (Math.sqrt(1 - e * e) * sinE) / (1 - e * cosE);
  const cosNu = (cosE - e) / (1 - e * cosE);
  let trueAnomaly = Math.atan2(sinNu, cosNu);
  if (trueAnomaly < 0) trueAnomaly += Math.PI * 2;

  // 4. Argument of Periapsis (w) & Node / Inclination in radians
  const degToRad = Math.PI / 180;
  const w = (k.wBar - k.node) * degToRad;
  const node = k.node * degToRad;
  const inc = k.i * degToRad;

  // Position in orbital plane
  const u = w + trueAnomaly; // Argument of latitude
  const xOrb = r * Math.cos(u);
  const yOrb = r * Math.sin(u);

  // Transform to Ecliptic Heliocentric coordinates (3D)
  const X_AU = r * (Math.cos(node) * Math.cos(u) - Math.sin(node) * Math.sin(u) * Math.cos(inc));
  const Z_AU = r * (Math.sin(node) * Math.cos(u) + Math.cos(node) * Math.sin(u) * Math.cos(inc));
  const Y_AU = r * (Math.sin(u) * Math.sin(inc));

  // Map to 3D scene space using scaled orbit radius
  const scaleRatio = orbitRadiusScale / k.a;
  
  return {
    x: X_AU * scaleRatio,
    y: Y_AU * scaleRatio,
    z: Z_AU * scaleRatio,
    distanceAU: r,
    trueAnomalyDeg: (trueAnomaly * 180) / Math.PI,
  };
}

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
