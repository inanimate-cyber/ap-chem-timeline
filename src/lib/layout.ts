import { scaleLinear } from "d3-scale";
import type { Discovery, SubjectData, ViewMode } from "./types";

export interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PointPosition {
  x: number;
  y: number;
}

export interface ChartLayout {
  width: number;
  height: number;
  margins: ChartMargins;
  /** Row (pixel y) for each topic name, in curricular order. */
  topicY: Map<string, number>;
  topics: string[];
  /** Position of every discovery in both modes, keyed by discovery id. */
  positions: Map<string, Record<ViewMode, PointPosition>>;
  /** Year axis ticks for historical mode. */
  yearTicks: { value: number; x: number }[];
  /** Unit band centers/edges for curriculum mode. */
  unitBands: { unit: number; x0: number; x1: number; center: number }[];
  yearScale: (year: number) => number;
}

/**
 * Computes point positions for both view modes up front so the chart can
 * animate between them by simply switching which position it targets.
 *
 * Historical mode: x = year, y = topic row.
 * Curriculum mode: x = unit band (discoveries spread chronologically within
 * their band), y = topic row (unchanged, so points glide horizontally).
 */
export function computeLayout(
  subject: SubjectData,
  width: number,
  rowHeight: number,
  margins: ChartMargins
): ChartLayout {
  const topics = subject.units.flatMap((u) => u.topics);
  const height = margins.top + topics.length * rowHeight + margins.bottom;

  const topicY = new Map<string, number>();
  topics.forEach((t, i) => {
    topicY.set(t, margins.top + i * rowHeight + rowHeight / 2);
  });

  const innerLeft = margins.left;
  const innerRight = width - margins.right;

  // --- Historical mode: linear year scale over the data extent, padded.
  const years = subject.discoveries.map((d) => d.year);
  const minYear = Math.floor((Math.min(...years) - 8) / 10) * 10;
  const maxYear = Math.ceil((Math.max(...years) + 8) / 10) * 10;
  const yearScale = scaleLinear()
    .domain([minYear, maxYear])
    .range([innerLeft, innerRight]);

  const tickStep = maxYear - minYear > 250 ? 50 : 25;
  const yearTicks: { value: number; x: number }[] = [];
  const firstTick = Math.ceil(minYear / tickStep) * tickStep;
  for (let y = firstTick; y <= maxYear; y += tickStep) {
    yearTicks.push({ value: y, x: yearScale(y) });
  }

  // --- Curriculum mode: 9 equal unit bands with a small gutter.
  const unitCount = subject.units.length;
  const bandGap = Math.min(14, (innerRight - innerLeft) * 0.012);
  const bandWidth =
    (innerRight - innerLeft - bandGap * (unitCount - 1)) / unitCount;
  const unitBands = subject.units.map((u, i) => {
    const x0 = innerLeft + i * (bandWidth + bandGap);
    return { unit: u.number, x0, x1: x0 + bandWidth, center: x0 + bandWidth / 2 };
  });
  const bandByUnit = new Map(unitBands.map((b) => [b.unit, b]));

  // Within each unit, spread discoveries chronologically across the band.
  const byUnit = new Map<number, Discovery[]>();
  for (const d of subject.discoveries) {
    const list = byUnit.get(d.unit) ?? [];
    list.push(d);
    byUnit.set(d.unit, list);
  }
  const curriculumX = new Map<string, number>();
  for (const [unit, list] of byUnit) {
    const band = bandByUnit.get(unit);
    if (!band) continue;
    const sorted = [...list].sort((a, b) => a.year - b.year);
    const pad = Math.min(10, bandWidth * 0.08);
    sorted.forEach((d, i) => {
      const t = sorted.length === 1 ? 0.5 : i / (sorted.length - 1);
      curriculumX.set(d.id, band.x0 + pad + t * (bandWidth - 2 * pad));
    });
  }

  const positions = new Map<string, Record<ViewMode, PointPosition>>();
  for (const d of subject.discoveries) {
    const y = topicY.get(d.topic);
    if (y === undefined) {
      throw new Error(
        `Discovery "${d.id}" has topic "${d.topic}" not present in unit definitions`
      );
    }
    positions.set(d.id, {
      history: { x: yearScale(d.year), y },
      curriculum: { x: curriculumX.get(d.id) ?? yearScale(d.year), y },
    });
  }

  return {
    width,
    height,
    margins,
    topicY,
    topics,
    positions,
    yearTicks,
    unitBands,
    yearScale: (y: number) => yearScale(y),
  };
}
