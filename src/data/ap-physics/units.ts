import type { UnitDef } from "@/lib/types";

/**
 * Combined AP Physics 1 & 2 (algebra-based) units, in the usual teaching
 * sequence: mechanics first, then fluids, thermodynamics, electromagnetism,
 * optics, and modern physics. 12 units, so several borrow the extended
 * palette slots (10–12) via `colorIndex`, and the finale (Modern Physics)
 * takes the dark-blue slot 9 for the "final unit dark blue" look.
 */
export const AP_PHYSICS_UNITS: UnitDef[] = [
  {
    number: 1,
    name: "Kinematics",
    color: "#3b82f6",
    topics: ["Motion & Inertia", "Free Fall & Projectiles"],
  },
  {
    number: 2,
    name: "Dynamics (Newton's Laws)",
    color: "#f97316",
    topics: ["Newton's Laws of Motion", "Friction & Forces"],
  },
  {
    number: 3,
    name: "Circular Motion & Gravitation",
    color: "#22c55e",
    topics: ["Orbits & Circular Motion", "Universal Gravitation"],
  },
  {
    number: 4,
    name: "Energy",
    color: "#ef4444",
    topics: ["Work & Kinetic Energy", "Conservation of Energy"],
  },
  {
    number: 5,
    name: "Momentum",
    color: "#a855f7",
    topics: ["Linear Momentum", "Collisions & Impulse"],
  },
  {
    number: 6,
    name: "Rotation & Oscillations",
    color: "#b45309",
    topics: ["Torque & Rotation", "Simple Harmonic Motion"],
  },
  {
    number: 7,
    name: "Fluids",
    color: "#ec4899",
    topics: ["Pressure & Buoyancy", "Fluid Dynamics"],
  },
  {
    number: 8,
    name: "Thermodynamics",
    color: "#ca8a04",
    topics: ["Heat & Temperature", "Laws of Thermodynamics", "Kinetic Theory"],
  },
  {
    number: 9,
    name: "Electricity & Circuits",
    color: "#0d9488",
    colorIndex: 10,
    topics: ["Electric Charge & Field", "Circuits & Current"],
  },
  {
    number: 10,
    name: "Magnetism & Induction",
    color: "#8b5cf6",
    colorIndex: 11,
    topics: ["Magnetism & Currents", "Electromagnetic Induction"],
  },
  {
    number: 11,
    name: "Optics & Waves",
    color: "#06b6d4",
    colorIndex: 12,
    topics: ["Nature of Light", "Waves & Interference"],
  },
  {
    number: 12,
    name: "Modern Physics",
    color: "#1e3a8a",
    colorIndex: 9,
    topics: ["Quantum Theory", "Atomic Models", "Nuclear & Mass–Energy"],
  },
];
