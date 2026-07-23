import type { UnitDef } from "@/lib/types";

/**
 * AP Biology units (2019 CED ordering) with the topic rows used on the
 * y-axis. Colors follow the reference palette: Unit 1 blue, Unit 2 orange,
 * Unit 3 green, ... and the final unit dark blue. AP Biology has 8 units, so
 * Unit 8 borrows palette slot 9 (dark blue) via `colorIndex`.
 */
export const AP_BIOLOGY_UNITS: UnitDef[] = [
  {
    number: 1,
    name: "Chemistry of Life",
    color: "#3b82f6",
    topics: [
      "Water & Life",
      "Biological Macromolecules",
      "Protein Structure & Function",
    ],
  },
  {
    number: 2,
    name: "Cell Structure & Function",
    color: "#f97316",
    topics: [
      "The Cell & Its Organelles",
      "Membranes & Transport",
      "Origin of Eukaryotes",
    ],
  },
  {
    number: 3,
    name: "Cellular Energetics",
    color: "#22c55e",
    topics: ["Enzymes", "Photosynthesis", "Cellular Respiration"],
  },
  {
    number: 4,
    name: "Cell Communication & Cell Cycle",
    color: "#ef4444",
    topics: ["Cell Signaling", "The Cell Cycle", "Programmed Cell Death"],
  },
  {
    number: 5,
    name: "Heredity",
    color: "#a855f7",
    topics: [
      "Meiosis & Sexual Reproduction",
      "Mendelian Genetics",
      "Chromosomal Inheritance",
    ],
  },
  {
    number: 6,
    name: "Gene Expression & Regulation",
    color: "#b45309",
    topics: [
      "DNA as the Genetic Material",
      "DNA Structure & Replication",
      "Transcription & Translation",
      "Gene Regulation & Biotechnology",
    ],
  },
  {
    number: 7,
    name: "Natural Selection",
    color: "#ec4899",
    topics: [
      "Foundations of Evolution",
      "Natural Selection & Its Evidence",
      "Speciation & the Origin of Life",
      "Phylogeny & Systematics",
    ],
  },
  {
    number: 8,
    name: "Ecology",
    color: "#1e3a8a",
    colorIndex: 9,
    topics: [
      "Energy Flow & Ecosystems",
      "Population Ecology",
      "Community Ecology & Conservation",
    ],
  },
];
