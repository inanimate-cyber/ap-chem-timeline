"use client";

import { useCallback, useRef, useState } from "react";
import type { SubjectData, ViewMode } from "@/lib/types";
import { TimelineChart, MODE_TRANSITION_MS } from "./TimelineChart";
import { SearchBar } from "@/components/SearchBar";
import { StatsPanel } from "@/components/StatsPanel";

/**
 * Owns the interactive state (view mode, color toggle, search selection) and
 * composes the controls, chart, and stats. Subject-agnostic: hand it any
 * SubjectData and it renders the same experience.
 */
export function TimelineExplorer({ subject }: { subject: SubjectData }) {
  const [mode, setMode] = useState<ViewMode>("history");
  const [animating, setAnimating] = useState(false);
  const [colorByUnit, setColorByUnit] = useState(false);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleMode = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setPinnedId(null);
    setMode((m) => (m === "history" ? "curriculum" : "history"));
    setTimeout(() => setAnimating(false), MODE_TRANSITION_MS + 150);
  }, [animating]);

  const handleSearchSelect = useCallback((id: string) => {
    setPinnedId(id);
    setHighlightId(id);
    chartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightId(null), 3000);
  }, []);

  return (
    <section aria-label={`${subject.name} interactive timeline`}>
      {/* Controls */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            id="mode-toggle"
            onClick={toggleMode}
            disabled={animating}
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-700 hover:shadow-md disabled:cursor-wait disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {mode === "history"
              ? "How is this taught today?"
              : "How was it discovered?"}
          </button>

          <button
            role="switch"
            aria-checked={colorByUnit}
            onClick={() => setColorByUnit((v) => !v)}
            className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300"
          >
            <span
              className={`relative h-6 w-11 rounded-full transition-colors ${
                colorByUnit
                  ? "bg-slate-900 dark:bg-slate-200"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform dark:bg-slate-900 ${
                  colorByUnit ? "translate-x-5" : ""
                }`}
              />
            </span>
            Color by AP Unit
          </button>
        </div>

        <SearchBar discoveries={subject.discoveries} onSelect={handleSearchSelect} />
      </div>

      {/* Chart */}
      <div ref={chartRef} className="mx-auto mt-6 max-w-6xl px-4">
        <TimelineChart
          subject={subject}
          mode={mode}
          animating={animating}
          colorByUnit={colorByUnit}
          pinnedId={pinnedId}
          onPin={setPinnedId}
          highlightId={highlightId}
        />
      </div>

      {/* Dynamic observations, shown in curriculum mode */}
      <StatsPanel subject={subject} visible={mode === "curriculum"} />
    </section>
  );
}
