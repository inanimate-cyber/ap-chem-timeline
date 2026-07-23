import Link from "next/link";
import { SUBJECT_LISTINGS } from "@/data/subjects";

/**
 * "Explore Other Subjects" grid. Available subjects link to their page
 * (`/<id>`, or `/` for the flagship); locked ones are placeholders. The
 * currently-viewed subject is marked as active.
 */
export function SubjectsSection({ activeId }: { activeId?: string }) {
  return (
    <section className="mx-auto mt-28 max-w-4xl px-4 pb-8">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Explore Other Subjects
      </h2>
      <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        The same idea, more ways to see it.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SUBJECT_LISTINGS.map((s) => {
          const isActive = s.id === activeId;
          const inner = (
            <>
              <span className="text-xl" aria-hidden>
                {s.available ? s.emoji : "🔒"}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                  {s.name}
                </span>
                <span className="block text-xs text-slate-400 dark:text-slate-500">
                  {isActive
                    ? "You're here"
                    : s.available
                      ? "Available now"
                      : "Coming soon"}
                </span>
              </span>
            </>
          );

          const base =
            "flex items-center gap-3 rounded-2xl border px-4 py-4 transition-all";

          if (s.available && !isActive) {
            return (
              <Link
                key={s.id}
                href={s.id === "ap-chemistry" ? "/" : `/${s.id}`}
                className={`${base} border-slate-300 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:border-slate-600 dark:bg-slate-900`}
              >
                {inner}
              </Link>
            );
          }

          return (
            <div
              key={s.id}
              aria-current={isActive ? "page" : undefined}
              className={`${base} ${
                isActive
                  ? "border-slate-900 bg-white shadow-sm dark:border-slate-300 dark:bg-slate-900"
                  : "border-slate-200/70 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-900/30"
              }`}
            >
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
