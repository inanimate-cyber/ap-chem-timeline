/**
 * Core data model. Designed so additional subjects (AP Biology, AP Physics,
 * Organic Chemistry, ...) can be added by dropping in a new SubjectData
 * object — the visualization is subject-agnostic.
 */

export interface Discovery {
  id: string;
  /** Representative year of the discovery (negative for BCE). */
  year: number;
  title: string;
  scientists: string[];
  /** Short historical significance shown in the pinned card. */
  description: string;
  /** Primary AP unit (1-indexed). */
  unit: number;
  /** Primary AP topic — must match a topic name in the subject's units. */
  topic: string;
  /**
   * When a discovery is relevant to more than one unit/topic, the extras are
   * preserved here (produced by the dataset consolidation step).
   */
  additionalUnits?: number[];
  additionalTopics?: string[];
  keywords: string[];
  /** True when the year is a best estimate rather than a firm date. */
  approximateYear: boolean;
  /** Landmark discoveries render a permanent label (~10-20 per subject). */
  landmark?: boolean;
}

export interface UnitDef {
  /** 1-indexed unit number. */
  number: number;
  name: string;
  /** Hex color used when "Color by AP Unit" is on. */
  color: string;
  /**
   * Which slot of the shared 9-color palette (--unit-1 … --unit-9) to use.
   * Defaults to `number`. Lets a subject with fewer units still reach the
   * "final unit is dark blue" look (e.g. AP Biology's Unit 8 → palette 9).
   */
  colorIndex?: number;
  /** Topic names in curricular order; defines the y-axis row order. */
  topics: string[];
}

export interface SubjectData {
  id: string;
  name: string;
  shortName: string;
  /** Discipline noun for the hero, e.g. "Chemistry", "Biology". */
  discipline: string;
  units: UnitDef[];
  discoveries: Discovery[];
}

export interface SubjectListing {
  id: string;
  name: string;
  emoji: string;
  available: boolean;
}

export type ViewMode = "history" | "curriculum";
