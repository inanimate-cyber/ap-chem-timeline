import type { SubjectData, SubjectListing, Discovery } from "@/lib/types";
import { AP_CHEMISTRY_UNITS } from "./ap-chemistry/units";
import chemistryDiscoveries from "./ap-chemistry/discoveries.json";
import { AP_BIOLOGY_UNITS } from "./ap-biology/units";
import biologyDiscoveries from "./ap-biology/discoveries.json";

export const AP_CHEMISTRY: SubjectData = {
  id: "ap-chemistry",
  name: "AP Chemistry",
  shortName: "AP Chem",
  discipline: "Chemistry",
  units: AP_CHEMISTRY_UNITS,
  discoveries: chemistryDiscoveries as Discovery[],
};

export const AP_BIOLOGY: SubjectData = {
  id: "ap-biology",
  name: "AP Biology",
  shortName: "AP Bio",
  discipline: "Biology",
  units: AP_BIOLOGY_UNITS,
  discoveries: biologyDiscoveries as Discovery[],
};

/** Registry of subjects. Add new SubjectData objects here as they're built. */
export const SUBJECTS: Record<string, SubjectData> = {
  "ap-chemistry": AP_CHEMISTRY,
  "ap-biology": AP_BIOLOGY,
};

/** Ids of subjects with a live page — drives routing and card links. */
export const AVAILABLE_SUBJECT_IDS = Object.keys(SUBJECTS);

/** Shown in the "Explore Other Subjects" section. */
export const SUBJECT_LISTINGS: SubjectListing[] = [
  { id: "ap-chemistry", name: "AP Chemistry", emoji: "⚗️", available: true },
  { id: "ap-biology", name: "AP Biology", emoji: "🧬", available: true },
  { id: "general-chemistry", name: "General Chemistry", emoji: "🧪", available: false },
  { id: "organic-chemistry", name: "Organic Chemistry", emoji: "⬡", available: false },
  { id: "physical-chemistry", name: "Physical Chemistry", emoji: "📐", available: false },
  { id: "ap-physics", name: "AP Physics", emoji: "🍎", available: false },
];
