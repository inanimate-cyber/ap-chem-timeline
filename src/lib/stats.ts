import { median } from "d3-array";
import type { SubjectData } from "./types";

export interface UnitStat {
  unit: number;
  name: string;
  color: string;
  /** Palette slot for coloring (mirrors UnitDef.colorIndex). */
  colorIndex: number;
  count: number;
  medianYear: number;
  minYear: number;
  maxYear: number;
}

export interface SubjectStats {
  unitStats: UnitStat[];
  observations: string[];
}

function century(year: number): string {
  const c = Math.floor((year - 1) / 100) + 1;
  const suffix = c === 21 ? "st" : c === 22 ? "nd" : c === 23 ? "rd" : "th";
  return `${c}${suffix} century`;
}

/**
 * Computes observations about the relationship between curricular order and
 * historical order, entirely from the dataset. Phrasing is deliberately
 * neutral — the goal is perspective, not critique.
 */
export function computeStats(subject: SubjectData): SubjectStats {
  const unitStats: UnitStat[] = subject.units.map((u) => {
    const years = subject.discoveries
      .filter((d) => d.unit === u.number)
      .map((d) => d.year)
      .sort((a, b) => a - b);
    return {
      unit: u.number,
      name: u.name,
      color: u.color,
      colorIndex: u.colorIndex ?? u.number,
      count: years.length,
      medianYear: Math.round(median(years) ?? 0),
      minYear: years[0] ?? 0,
      maxYear: years[years.length - 1] ?? 0,
    };
  });

  const observations: string[] = [];

  // 1. Where does Unit 1 sit historically?
  const u1 = unitStats[0];
  if (u1 && u1.count > 0) {
    observations.push(
      `The ideas in Unit 1 (${u1.name}) have a median discovery year of ${u1.medianYear} — much of what students meet first was worked out in the ${century(
        u1.medianYear
      )}.`
    );
  }

  // 2. Latest-arriving unit vs. earliest-arriving unit by median year.
  const byMedian = [...unitStats]
    .filter((s) => s.count > 0)
    .sort((a, b) => a.medianYear - b.medianYear);
  const earliest = byMedian[0];
  const latest = byMedian[byMedian.length - 1];
  if (earliest && latest && earliest.unit !== latest.unit) {
    observations.push(
      `By median year, the discoveries of Unit ${earliest.unit} (${earliest.name}, ${earliest.medianYear}) came earliest, and those of Unit ${latest.unit} (${latest.name}, ${latest.medianYear}) came latest — the curriculum follows a conceptual order, not a historical one.`
    );
  }

  // 3. Widest historical span within a single unit.
  const bySpan = [...unitStats]
    .filter((s) => s.count > 1)
    .sort((a, b) => b.maxYear - b.minYear - (a.maxYear - a.minYear));
  const widest = bySpan[0];
  if (widest) {
    observations.push(
      `Unit ${widest.unit} (${widest.name}) spans the widest stretch of history: from ${widest.minYear} to ${widest.maxYear}, ${
        widest.maxYear - widest.minYear
      } years of work sit side by side in a single unit.`
    );
  }

  // 4. Overall span of the whole course.
  const allYears = subject.discoveries.map((d) => d.year).sort((a, b) => a - b);
  if (allYears.length > 0) {
    const span = allYears[allYears.length - 1] - allYears[0];
    observations.push(
      `Altogether, a year of ${subject.name} retraces roughly ${Math.round(span / 10) * 10} years of scientific work by ${
        new Set(subject.discoveries.flatMap((d) => d.scientists)).size
      } different scientists.`
    );
  }

  return { unitStats, observations };
}
