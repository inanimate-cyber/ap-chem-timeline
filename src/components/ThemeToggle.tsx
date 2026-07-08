"use client";

import { useEffect, useState } from "react";

/**
 * Light/dark toggle. The initial class is applied by an inline script in
 * layout.tsx before hydration to avoid a flash of the wrong theme.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-sm backdrop-blur transition-colors hover:text-slate-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:text-slate-100"
    >
      {dark ? (
        <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 fill-current" aria-hidden>
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 12a4 4 0 100-8 4 4 0 000 8zm7-5a1 1 0 110 2h-1a1 1 0 110-2h1zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm12.07-5.07a1 1 0 010 1.41l-.7.71a1 1 0 11-1.42-1.41l.71-.71a1 1 0 011.41 0zM6.05 13.95a1 1 0 010 1.41l-.7.71a1 1 0 01-1.42-1.41l.71-.71a1 1 0 011.41 0zm9.9 2.12a1 1 0 01-1.41 0l-.71-.7a1 1 0 111.41-1.42l.71.71a1 1 0 010 1.41zM6.05 6.05a1 1 0 01-1.41 0l-.71-.7A1 1 0 015.34 3.9l.71.71a1 1 0 010 1.41zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 fill-current" aria-hidden>
          <path d="M17.29 13.4A8 8 0 016.6 2.71a.75.75 0 00-.98-.98 9.5 9.5 0 1012.65 12.65.75.75 0 00-.98-.98z" />
        </svg>
      )}
    </button>
  );
}
