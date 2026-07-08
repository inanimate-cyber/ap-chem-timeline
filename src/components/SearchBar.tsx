"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Discovery } from "@/lib/types";

interface SearchBarProps {
  discoveries: Discovery[];
  onSelect: (id: string) => void;
}

/** Searches by discovery title, scientist, keyword, or year. */
export function SearchBar({ discoveries, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return discoveries
      .filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.scientists.some((s) => s.toLowerCase().includes(q)) ||
          d.keywords.some((k) => k.toLowerCase().includes(q)) ||
          d.topic.toLowerCase().includes(q) ||
          String(d.year).includes(q)
      )
      .sort((a, b) => a.year - b.year)
      .slice(0, 8);
  }, [query, discoveries]);

  useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  const select = (id: string) => {
    onSelect(id);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className="relative w-full sm:w-72">
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 fill-slate-400"
        aria-hidden
      >
        <path d="M8.5 3a5.5 5.5 0 013.916 9.363l4.11 4.11a.75.75 0 11-1.06 1.061l-4.11-4.11A5.5 5.5 0 118.5 3zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && results[activeIndex]) {
            select(results[activeIndex].id);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Search scientists, discoveries, years…"
        aria-label="Search discoveries"
        className="w-full rounded-full border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition-shadow focus:border-slate-300 focus:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500"
      />
      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          {results.map((d, i) => (
            <li key={d.id} role="option" aria-selected={i === activeIndex}>
              <button
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => select(d.id)}
                className={`flex w-full items-baseline gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  i === activeIndex
                    ? "bg-slate-100 dark:bg-slate-800"
                    : "bg-transparent"
                }`}
              >
                <span className="w-10 shrink-0 text-xs tabular-nums text-slate-400">
                  {d.year}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-800 dark:text-slate-200">
                    {d.title}
                  </span>
                  <span className="block truncate text-xs text-slate-400 dark:text-slate-500">
                    {d.scientists.join(", ")}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
