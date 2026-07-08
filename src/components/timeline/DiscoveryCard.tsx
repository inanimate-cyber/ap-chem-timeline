"use client";

import { motion } from "framer-motion";
import type { Discovery } from "@/lib/types";

interface DiscoveryCardProps {
  discovery: Discovery;
  unitColor: string;
  unitName: string;
  x: number;
  y: number;
  chartHeight: number;
  onClose: () => void;
}

/** Pinned detail card shown when a point is clicked. */
export function DiscoveryCard({
  discovery: d,
  unitColor,
  unitName,
  x,
  y,
  chartHeight,
  onClose,
}: DiscoveryCardProps) {
  // Place below the point unless it would run off the bottom of the chart.
  const below = y < chartHeight - 260;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: below ? -6 : 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute z-30 w-[300px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      style={below ? { left: x, top: y + 18 } : { left: x, bottom: chartHeight - y + 18 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
      >
        ×
      </button>
      <p className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">
        {d.approximateYear ? `c. ${d.year}` : d.year}
      </p>
      <h3 className="mt-1 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {d.title}
      </h3>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
        {d.scientists.join(" · ")}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium"
          style={{
            background: `color-mix(in srgb, ${unitColor} 12%, transparent)`,
            color: unitColor,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: unitColor }}
          />
          Unit {d.unit} · {unitName}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{d.topic}</p>
      <p className="mt-3 border-t border-slate-100 pt-3 text-[13px] leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
        {d.description}
      </p>
    </motion.div>
  );
}
