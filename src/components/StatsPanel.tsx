"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SubjectData } from "@/lib/types";
import { computeStats } from "@/lib/stats";

interface StatsPanelProps {
  subject: SubjectData;
  visible: boolean;
}

/** Observations computed dynamically from the dataset, shown in curriculum mode. */
export function StatsPanel({ subject, visible }: StatsPanelProps) {
  const stats = useMemo(() => computeStats(subject), [subject]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mx-auto mt-12 max-w-3xl px-4"
        >
          <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            What the reordering reveals
          </h2>

          <ul className="mt-6 space-y-4">
            {stats.observations.map((obs, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8 + i * 0.15 }}
                className="rounded-2xl border border-slate-200/70 bg-white/60 px-5 py-4 text-[15px] leading-relaxed text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
              >
                {obs}
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {stats.unitStats.map((s) => (
              <span
                key={s.unit}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-3 py-1.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400"
                title={s.name}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: `var(--unit-${s.colorIndex})` }}
                />
                Unit {s.unit}
                <span className="tabular-nums text-slate-400 dark:text-slate-500">
                  median {s.medianYear}
                </span>
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
