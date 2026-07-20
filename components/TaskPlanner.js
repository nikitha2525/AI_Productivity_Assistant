"use client";

import { useState } from "react";
import OutputPanel from "./OutputPanel";

export default function TaskPlanner() {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError("Please describe your goal or task first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "task-planner",
          payload: { goal, deadline, context },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-border bg-panel2 p-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Goal / Task
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Finish my ML internship project report and submit it"
            rows={3}
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-muted focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Deadline (optional)
          </label>
          <input
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="e.g. This Friday"
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-muted focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Extra context (optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. I have 3 hours a day free, and I already collected the data"
            rows={2}
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-muted focus:border-gold"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-goldSoft disabled:opacity-50"
        >
          {loading ? "Planning..." : "Generate Plan"}
        </button>
      </div>

      <div className="min-h-[320px]">
        <OutputPanel
          loading={loading}
          error={error}
          result={result}
          placeholder="Your prioritized task breakdown will appear here."
        />
      </div>
    </div>
  );
}
