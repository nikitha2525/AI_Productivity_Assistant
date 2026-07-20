"use client";

import { useState } from "react";
import TaskPlanner from "../components/TaskPlanner";
import EmailGenerator from "../components/EmailGenerator";
import MeetingNotes from "../components/MeetingNotes";

const TABS = [
  { id: "tasks", label: "Task Planning", icon: "✓" },
  { id: "email", label: "Email Generation", icon: "✉" },
  { id: "notes", label: "Meeting Notes", icon: "▤" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">◆</span>
              <h1 className="text-xl font-bold tracking-tight text-gray-50">
                Flow <span className="text-gold">AI</span>
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted">
              Your daily AI productivity assistant
            </p>
          </div>
        </header>

        <nav className="mb-8 flex gap-2 rounded-xl border border-border bg-panel p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-gold text-ink"
                  : "text-muted hover:bg-panel2 hover:text-gray-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        <section>
          {activeTab === "tasks" && <TaskPlanner />}
          {activeTab === "email" && <EmailGenerator />}
          {activeTab === "notes" && <MeetingNotes />}
        </section>

        <footer className="mt-12 text-center text-xs text-muted">
          Built with Next.js &amp; the Claude API
        </footer>
      </div>
    </main>
  );
}
