"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TABS = [
  { id: "correction", label: "Suggest a correction" },
  { id: "question", label: "Ask a historical question" },
  { id: "discovery", label: "Suggest another discovery" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PLACEHOLDERS: Record<TabId, string> = {
  correction:
    "Which discovery, date, or attribution should be corrected — and what's your source?",
  question:
    "What would you like to know about the history behind a topic?",
  discovery:
    "Which discovery is missing? Include the year, the scientists, and the AP topic it belongs to.",
};

/** Floating feedback button + tabbed modal. Posts to /api/feedback. */
export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("correction");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const submit = async () => {
    if (!message.trim()) return;
    setStatus("sending");
    // Placeholder: the site is statically hosted, so submissions are logged
    // in the browser console. Swap for a real endpoint when one exists.
    console.log("[feedback]", { type: tab, message, email });
    setStatus("sent");
    setTimeout(() => {
      setOpen(false);
      setStatus("idle");
      setMessage("");
    }, 1400);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl dark:bg-slate-100 dark:text-slate-900"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M2 5.5A2.5 2.5 0 014.5 3h11A2.5 2.5 0 0118 5.5v7a2.5 2.5 0 01-2.5 2.5H7.06L3.7 17.7A1 1 0 012 16.9V5.5z" />
        </svg>
        Feedback
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Feedback"
            >
              <div className="flex flex-wrap gap-2" role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      tab === t.id
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={PLACEHOLDERS[tab]}
                rows={5}
                className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional, if you'd like a reply)"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              />

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submit}
                  disabled={status !== "idle" || !message.trim()}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
                >
                  {status === "sent"
                    ? "Thank you!"
                    : status === "sending"
                      ? "Sending…"
                      : "Send"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
