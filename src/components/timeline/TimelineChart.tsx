"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Discovery, SubjectData, ViewMode } from "@/lib/types";
import { computeLayout } from "@/lib/layout";
import { DiscoveryCard } from "./DiscoveryCard";

/** Duration of the history <-> curriculum morph, in ms. */
export const MODE_TRANSITION_MS = 1800;

interface Trail {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface TimelineChartProps {
  subject: SubjectData;
  mode: ViewMode;
  animating: boolean;
  colorByUnit: boolean;
  pinnedId: string | null;
  onPin: (id: string | null) => void;
  highlightId: string | null;
}

export function TimelineChart({
  subject,
  mode,
  animating,
  colorByUnit,
  pinnedId,
  onPin,
  highlightId,
}: TimelineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(960);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const prevMode = useRef(mode);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const compact = width < 640;
  const layout = useMemo(
    () =>
      computeLayout(subject, width, compact ? 26 : 30, {
        top: 10,
        right: compact ? 12 : 28,
        bottom: 48,
        left: compact ? 120 : 216,
      }),
    [subject, width, compact]
  );

  // CSS variables (see globals.css) so dark mode can adjust hues.
  const unitColor = useMemo(
    () =>
      new Map(subject.units.map((u) => [u.number, `var(--unit-${u.number})`])),
    [subject]
  );
  const discoveryById = useMemo(
    () => new Map(subject.discoveries.map((d) => [d.id, d])),
    [subject]
  );

  // Faint motion trails from the old position to the new one on mode change.
  useEffect(() => {
    if (prevMode.current === mode) return;
    const from = prevMode.current;
    prevMode.current = mode;
    const next: Trail[] = [];
    for (const d of subject.discoveries) {
      const pos = layout.positions.get(d.id);
      if (!pos) continue;
      next.push({
        id: d.id,
        x1: pos[from].x,
        y1: pos[from].y,
        x2: pos[mode].x,
        y2: pos[mode].y,
      });
    }
    setTrails(next);
    const t = setTimeout(() => setTrails([]), MODE_TRANSITION_MS + 600);
    return () => clearTimeout(t);
  }, [mode, layout, subject]);

  // Landmark label placement with 2-D collision handling: try above the
  // point, then below; if both collide with an already-placed label, hide
  // this label (the point itself always stays). Returns dy per discovery id.
  const labelPlacement = useMemo(() => {
    const placement = new Map<string, number | null>();
    const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
    const CHAR_W = 5.8;
    const H = 12;
    const landmarks = subject.discoveries
      .filter((d) => d.landmark)
      .map((d) => ({ d, p: layout.positions.get(d.id)![mode] }))
      .sort((a, b) => a.p.y - b.p.y || a.p.x - b.p.x);

    for (const { d, p } of landmarks) {
      const w = d.title.length * CHAR_W;
      let chosen: number | null = null;
      for (const dy of [-10, 19]) {
        const box = {
          x0: p.x - w / 2,
          x1: p.x + w / 2,
          y0: p.y + dy - H,
          y1: p.y + dy,
        };
        const collides = placed.some(
          (b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0
        );
        if (!collides) {
          chosen = dy;
          placed.push(box);
          break;
        }
      }
      placement.set(d.id, chosen);
    }
    return placement;
  }, [subject, layout, mode]);

  const hovered = hoveredId ? discoveryById.get(hoveredId) : null;
  const hoveredPos = hoveredId ? layout.positions.get(hoveredId)?.[mode] : null;
  const pinned = pinnedId ? discoveryById.get(pinnedId) : null;
  const pinnedPos = pinnedId ? layout.positions.get(pinnedId)?.[mode] : null;

  const pointFill = (d: Discovery) =>
    colorByUnit ? unitColor.get(d.unit) ?? "#94a3b8" : "var(--point-neutral)";

  const handleKey = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPin(pinnedId === id ? null : id);
    }
  };

  // Unit boundaries for horizontal separators on the y-axis.
  const unitRowBounds = useMemo(() => {
    const bounds: { unit: number; yTop: number; yBottom: number }[] = [];
    let row = 0;
    const rowH = compact ? 26 : 30;
    for (const u of subject.units) {
      const yTop = layout.margins.top + row * rowH;
      row += u.topics.length;
      bounds.push({ unit: u.number, yTop, yBottom: layout.margins.top + row * rowH });
    }
    return bounds;
  }, [subject, layout, compact]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width={width}
        height={layout.height}
        className="block select-none"
        role="img"
        aria-label={
          mode === "history"
            ? "Discoveries plotted by year against AP Chemistry topics"
            : "Discoveries grouped by AP Chemistry unit"
        }
      >
        {/* Click-away background */}
        <rect
          x={0}
          y={0}
          width={width}
          height={layout.height}
          fill="transparent"
          onClick={() => onPin(null)}
        />

        {/* Alternating unit backgrounds + separators + topic labels */}
        {unitRowBounds.map((b, i) => (
          <g key={b.unit}>
            {i % 2 === 1 && (
              <rect
                x={0}
                y={b.yTop}
                width={width}
                height={b.yBottom - b.yTop}
                className="fill-slate-400/[0.07] dark:fill-slate-500/[0.08]"
                pointerEvents="none"
              />
            )}
            <line
              x1={0}
              x2={width}
              y1={b.yBottom}
              y2={b.yBottom}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth={1}
            />
          </g>
        ))}

        {layout.topics.map((t) => {
          const d = subject.units.find((u) => u.topics.includes(t));
          return (
            <text
              key={t}
              x={layout.margins.left - 12}
              y={layout.topicY.get(t)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-slate-500 text-[10px] font-medium tracking-wide dark:fill-slate-400 sm:text-[11px]"
              style={
                colorByUnit && d
                  ? { fill: unitColor.get(d.number), opacity: 0.9 }
                  : undefined
              }
            >
              {compact && t.length > 18 ? t.slice(0, 17) + "…" : t}
            </text>
          );
        })}

        {/* Curriculum-mode unit band tints */}
        <g pointerEvents="none">
          {layout.unitBands.map((b) => (
            <motion.rect
              key={b.unit}
              x={b.x0}
              y={layout.margins.top}
              width={b.x1 - b.x0}
              height={layout.height - layout.margins.top - layout.margins.bottom}
              rx={8}
              initial={false}
              animate={{ opacity: mode === "curriculum" ? 1 : 0 }}
              transition={{ duration: 0.8, delay: mode === "curriculum" ? 0.9 : 0 }}
              fill={colorByUnit ? unitColor.get(b.unit) : "var(--point-neutral)"}
              fillOpacity={0.06}
            />
          ))}
        </g>

        {/* X axis: years (historical) */}
        <motion.g
          initial={false}
          animate={{ opacity: mode === "history" ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          pointerEvents="none"
        >
          {layout.yearTicks.map((t) => (
            <g key={t.value}>
              <line
                x1={t.x}
                x2={t.x}
                y1={layout.margins.top}
                y2={layout.height - layout.margins.bottom + 6}
                className="stroke-slate-200/70 dark:stroke-slate-800/80"
                strokeWidth={1}
              />
              <text
                x={t.x}
                y={layout.height - layout.margins.bottom + 24}
                textAnchor="middle"
                className="fill-slate-400 text-[11px] tabular-nums dark:fill-slate-500"
              >
                {t.value}
              </text>
            </g>
          ))}
          <text
            x={(layout.margins.left + width - layout.margins.right) / 2}
            y={layout.height - 4}
            textAnchor="middle"
            className="fill-slate-400 text-[11px] font-medium uppercase tracking-widest dark:fill-slate-500"
          >
            Year
          </text>
        </motion.g>

        {/* X axis: units (curriculum) */}
        <motion.g
          initial={false}
          animate={{ opacity: mode === "curriculum" ? 1 : 0 }}
          transition={{ duration: 0.6, delay: mode === "curriculum" ? 0.9 : 0 }}
          pointerEvents="none"
        >
          {layout.unitBands.map((b) => (
            <text
              key={b.unit}
              x={b.center}
              y={layout.height - layout.margins.bottom + 24}
              textAnchor="middle"
              className="fill-slate-500 text-[11px] font-semibold dark:fill-slate-400"
              style={colorByUnit ? { fill: unitColor.get(b.unit) } : undefined}
            >
              {compact ? `U${b.unit}` : `Unit ${b.unit}`}
            </text>
          ))}
          <text
            x={(layout.margins.left + width - layout.margins.right) / 2}
            y={layout.height - 4}
            textAnchor="middle"
            className="fill-slate-400 text-[11px] font-medium uppercase tracking-widest dark:fill-slate-500"
          >
            AP Chemistry Unit
          </text>
        </motion.g>

        {/* Motion trails during the morph */}
        <AnimatePresence>
          {trails.map((t) => (
            <motion.line
              key={t.id}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.22, 0.22, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: (MODE_TRANSITION_MS + 500) / 1000,
                times: [0, 0.2, 0.75, 1],
              }}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth={1}
              pointerEvents="none"
            />
          ))}
        </AnimatePresence>

        {/* Points */}
        {subject.discoveries.map((d) => {
          const pos = layout.positions.get(d.id)![mode];
          const isActive =
            hoveredId === d.id || pinnedId === d.id || highlightId === d.id;
          const r = d.landmark ? 5.5 : 4.5;
          return (
            <g
              key={d.id}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: `transform ${MODE_TRANSITION_MS}ms cubic-bezier(0.45, 0.05, 0.15, 1)`,
                pointerEvents: animating ? "none" : "auto",
              }}
              tabIndex={0}
              role="button"
              aria-label={`${d.title}, ${d.approximateYear ? "circa " : ""}${d.year}, ${d.scientists.join(", ")}, Unit ${d.unit}`}
              onFocus={() => setHoveredId(d.id)}
              onBlur={() => setHoveredId(null)}
              onKeyDown={(e) => handleKey(e, d.id)}
              className="cursor-pointer outline-none"
            >
              {/* Pulse ring for search highlight */}
              {highlightId === d.id && (
                <motion.circle
                  r={r}
                  fill="none"
                  stroke={colorByUnit ? unitColor.get(d.unit) : "var(--point-neutral-strong)"}
                  strokeWidth={2}
                  initial={{ scale: 1, opacity: 0.9 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  transition={{ duration: 1, repeat: 2, ease: "easeOut" }}
                />
              )}
              {/* Invisible hit area */}
              <circle
                r={11}
                fill="transparent"
                onMouseEnter={() => setHoveredId(d.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onPin(pinnedId === d.id ? null : d.id);
                }}
              />
              <circle
                r={isActive ? r + 1.5 : r}
                fill={pointFill(d)}
                fillOpacity={isActive ? 1 : 0.85}
                stroke={isActive ? "var(--point-ring)" : "var(--point-stroke)"}
                strokeWidth={isActive ? 2 : 1}
                pointerEvents="none"
                style={{ transition: "r 150ms, fill 400ms" }}
              />
              {d.landmark && !compact && labelPlacement.get(d.id) != null && (
                <text
                  y={labelPlacement.get(d.id)!}
                  textAnchor="middle"
                  pointerEvents="none"
                  className="fill-slate-600 text-[10px] font-semibold dark:fill-slate-300"
                  style={
                    colorByUnit
                      ? { fill: unitColor.get(d.unit) }
                      : undefined
                  }
                >
                  {d.title}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && hoveredPos && hovered.id !== pinnedId && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-20 w-56 rounded-xl border border-slate-200/80 bg-white/95 p-3 text-left shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
            style={{
              left: Math.min(Math.max(hoveredPos.x - 112, 8), width - 232),
              top: hoveredPos.y + 16,
            }}
          >
            <p className="text-[11px] font-medium tabular-nums text-slate-400 dark:text-slate-500">
              {hovered.approximateYear ? `c. ${hovered.year}` : hovered.year}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {hovered.title}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {hovered.scientists.join(" · ")}
            </p>
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                style={{ background: unitColor.get(hovered.unit) }}
              />
              Unit {hovered.unit} · {hovered.topic}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned card */}
      <AnimatePresence>
        {pinned && pinnedPos && (
          <DiscoveryCard
            discovery={pinned}
            unitColor={unitColor.get(pinned.unit) ?? "#64748b"}
            unitName={
              subject.units.find((u) => u.number === pinned.unit)?.name ?? ""
            }
            x={Math.min(Math.max(pinnedPos.x - 150, 8), width - 308)}
            y={pinnedPos.y}
            chartHeight={layout.height}
            onClose={() => onPin(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
