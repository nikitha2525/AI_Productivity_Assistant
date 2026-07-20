"use client";

import { useState } from "react";

export default function OutputPanel({ loading, error, result, placeholder }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-panel2">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Result
        </span>
        {result && (
          <button
            onClick={handleCopy}
            className="rounded-md border border-border px-2.5 py-1 text-xs text-muted transition hover:border-gold hover:text-gold"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
            Generating...
          </div>
        )}
        {!loading && error && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        {!loading && !error && result && (
          <pre className="animate-fade-in whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-100">
            {result}
          </pre>
        )}
        {!loading && !error && !result && (
          <p className="text-sm text-muted">{placeholder}</p>
        )}
      </div>
    </div>
  );
}
