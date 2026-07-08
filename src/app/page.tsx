import { AP_CHEMISTRY } from "@/data/subjects";
import { TimelineExplorer } from "@/components/timeline/TimelineExplorer";
import { SubjectsSection } from "@/components/SubjectsSection";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen pb-24">
      <ThemeToggle />

      {/* Hero */}
      <header className="mx-auto max-w-3xl px-6 pt-24 pb-14 text-center sm:pt-32">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl dark:text-slate-50">
          Why Might Chemistry
          <br className="hidden sm:block" /> Feel So Hard?
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg dark:text-slate-400">
          Explore the history of chemistry and compare it with the order
          concepts are introduced in AP Chemistry.
        </p>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
          One set of discoveries · Two ways to see it
        </p>
      </header>

      <TimelineExplorer subject={AP_CHEMISTRY} />

      <SubjectsSection />

      <footer className="mt-16 px-6 text-center text-xs leading-relaxed text-slate-400 dark:text-slate-600">
        The discoveries never change — only the order we tell them in.
      </footer>

      <FeedbackWidget />
    </main>
  );
}
