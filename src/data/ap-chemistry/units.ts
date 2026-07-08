import type { UnitDef } from "@/lib/types";

/**
 * AP Chemistry units (2019 CED ordering) with the topic rows used on the
 * y-axis. Colors follow the reference figure: Unit 1 blue, Unit 2 orange,
 * Unit 3 green, ... Unit 9 dark blue.
 */
export const AP_CHEMISTRY_UNITS: UnitDef[] = [
  {
    number: 1,
    name: "Atomic Structure & Properties",
    color: "#3b82f6",
    topics: [
      "Atomic Theory & the Mole",
      "Subatomic Particles",
      "Electronic Structure & Spectra",
      "The Periodic Table",
    ],
  },
  {
    number: 2,
    name: "Compound Structure & Properties",
    color: "#f97316",
    topics: ["Chemical Bonding", "Lewis Theory & Molecular Geometry"],
  },
  {
    number: 3,
    name: "Intermolecular Forces & Properties",
    color: "#22c55e",
    topics: [
      "Gases & Kinetic Theory",
      "Intermolecular Forces",
      "Solutions & Spectroscopy",
    ],
  },
  {
    number: 4,
    name: "Chemical Reactions",
    color: "#ef4444",
    topics: ["Stoichiometry & Conservation", "Reactions & Analysis"],
  },
  {
    number: 5,
    name: "Kinetics",
    color: "#a855f7",
    topics: ["Reaction Rates", "Mechanisms & Catalysis"],
  },
  {
    number: 6,
    name: "Thermochemistry",
    color: "#b45309",
    topics: ["Heat & Calorimetry", "Enthalpy & Hess's Law"],
  },
  {
    number: 7,
    name: "Equilibrium",
    color: "#ec4899",
    topics: ["Chemical Equilibrium", "Solubility Equilibria"],
  },
  {
    number: 8,
    name: "Acids & Bases",
    color: "#ca8a04",
    topics: ["Acid–Base Theories", "pH, Buffers & Titrations"],
  },
  {
    number: 9,
    name: "Applications of Thermodynamics",
    color: "#1e3a8a",
    topics: ["Entropy & Free Energy", "Electrochemistry"],
  },
];
