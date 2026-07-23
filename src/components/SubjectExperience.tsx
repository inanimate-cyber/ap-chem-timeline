import type { SubjectData } from "@/lib/types";
import { TimelineExplorer } from "@/components/timeline/TimelineExplorer";
import { SubjectsSection } from "@/components/SubjectsSection";

/**
 * The full single-subject page body: hero, interactive timeline, subject
 * switcher, and footer. Subject-agnostic — every available subject renders
 * through this. Global chrome (theme toggle, feedback) lives in the layout.
 */
export function SubjectExperience({ subject }: { subject: SubjectData }) {
  return (
    <main className="min-h-screen pb-24">
      {/* Hero */}
      <header className="mx-auto max-w-3xl px-6 pt-24 pb-14 text-center sm:pt-32">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl dark:text-slate-50">
          Why Might {subject.discipline}
          <br className="hidden sm:block" /> Feel So Hard?
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg dark:text-slate-400">
          Explore the history of {subject.discipline.toLowerCase()} and compare
          it with the order concepts are introduced in {subject.name}.
        </p>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
          One set of discoveries · Two ways to see it
        </p>
      </header>

      <TimelineExplorer subject={subject} />

      <SubjectsSection activeId={subject.id} />

      <footer className="mt-16 px-6 text-center text-xs leading-relaxed text-slate-400 dark:text-slate-600">
        The discoveries never change — only the order we tell them in.
      </footer>
    </main>
  );
}
