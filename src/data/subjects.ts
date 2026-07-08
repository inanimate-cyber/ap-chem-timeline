import type { SubjectData, SubjectListing } from "@/lib/types";
import { AP_CHEMISTRY_UNITS } from "./ap-chemistry/units";
import discoveries from "./ap-chemistry/discoveries.json";
import type { Discovery } from "@/lib/types";

export const AP_CHEMISTRY: SubjectData = {
  id: "ap-chemistry",
  name: "AP Chemistry",
  shortName: "AP Chem",
  units: AP_CHEMISTRY_UNITS,
  discoveries: discoveries as Discovery[],
};

/** Registry of subjects. Add new SubjectData objects here as they're built. */
export const SUBJECTS: Record<string, SubjectData> = {
  "ap-chemistry": AP_CHEMISTRY,
};

/** Shown in the "Explore Other Subjects" section. */
export const SUBJECT_LISTINGS: SubjectListing[] = [
  { id: "ap-chemistry", name: "AP Chemistry", emoji: "⚗️", available: true },
  { id: "general-chemistry", name: "General Chemistry", emoji: "🧪", available: false },
  { id: "organic-chemistry", name: "Organic Chemistry", emoji: "🧬", available: false },
  { id: "physical-chemistry", name: "Physical Chemistry", emoji: "📐", available: false },
  { id: "ap-biology", name: "AP Biology", emoji: "🌱", available: false },
  { id: "ap-physics", name: "AP Physics", emoji: "🍎", available: false },
];
