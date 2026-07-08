import { SUBJECT_LISTINGS } from "@/data/subjects";

/** "Explore Other Subjects" placeholder grid. */
export function SubjectsSection() {
  return (
    <section className="mx-auto mt-28 max-w-4xl px-4 pb-8">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Explore Other Subjects
      </h2>
      <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        The same discoveries, more ways to see them.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SUBJECT_LISTINGS.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition-all ${
              s.available
                ? "border-slate-300 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-900"
                : "border-slate-200/70 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-900/30"
            }`}
          >
            <span className="text-xl" aria-hidden>
              {s.available ? s.emoji : "🔒"}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                {s.name}
              </span>
              <span className="block text-xs text-slate-400 dark:text-slate-500">
                {s.available ? "Available now" : "Coming soon"}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
