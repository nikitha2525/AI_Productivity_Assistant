"use client";

import { useState } from "react";
import OutputPanel from "./OutputPanel";

export default function MeetingNotes() {
  const [rawNotes, setRawNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!rawNotes.trim()) {
      setError("Please paste your raw meeting notes or transcript first.");
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
          feature: "meeting-notes",
          payload: { rawNotes },
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
            Raw meeting notes / transcript
          </label>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Paste your messy notes here — bullet points, half-sentences, timestamps, whatever you've got."
            rows={12}
            className="scrollbar-thin w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-muted focus:border-gold"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-goldSoft disabled:opacity-50"
        >
          {loading ? "Summarizing..." : "Summarize Notes"}
        </button>
      </div>

      <div className="min-h-[320px]">
        <OutputPanel
          loading={loading}
          error={error}
          result={result}
          placeholder="A clean summary with decisions and action items will appear here."
        />
      </div>
    </div>
  );
}
