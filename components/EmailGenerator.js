"use client";

import { useState } from "react";
import OutputPanel from "./OutputPanel";

const TONES = ["Professional", "Friendly", "Formal", "Concise", "Persuasive"];

export default function EmailGenerator() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!purpose.trim()) {
      setError("Please describe the purpose of the email first.");
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
          feature: "email-generator",
          payload: { purpose, recipient, tone, keyPoints },
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
            Purpose of the email
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Ask my professor for an internship recommendation letter"
            rows={3}
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-muted focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Recipient / relationship
          </label>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="e.g. My internship mentor at iStudio Technologies"
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-muted focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  tone === t
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border text-muted hover:border-gold/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Key points to include (optional)
          </label>
          <textarea
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="e.g. Mention my project on bias detection, ask by next Friday"
            rows={2}
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-muted focus:border-gold"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-goldSoft disabled:opacity-50"
        >
          {loading ? "Drafting..." : "Generate Email"}
        </button>
      </div>

      <div className="min-h-[320px]">
        <OutputPanel
          loading={loading}
          error={error}
          result={result}
          placeholder="Your ready-to-send email draft will appear here."
        />
      </div>
    </div>
  );
}
