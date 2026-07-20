# Flow — AI Productivity Assistant

An AI assistant that helps you stay on top of your day, built with **Next.js 14 (App Router)**, **Tailwind CSS**, and the **Claude API**.

## Features

1. **Task Planning** — Turn a goal or messy to-do into a clear, prioritized, checklist-style plan.
2. **Email Generation** — Draft a complete, ready-to-send email from a purpose, recipient, tone, and key points.
3. **Meeting Notes Summarization** — Paste raw/messy meeting notes or a transcript and get a clean summary with decisions and action items.

All three features share a single serverless API route (`app/api/generate/route.js`) that builds the right prompt and calls the Claude API.

---

## Project structure

```
ai-productivity-assistant/
├── app/
│   ├── api/generate/route.js   # Serverless backend — calls the Claude API
│   ├── layout.js
│   ├── page.js                 # Main UI with tab navigation
│   └── globals.css
├── components/
│   ├── TaskPlanner.js
│   ├── EmailGenerator.js
│   ├── MeetingNotes.js
│   └── OutputPanel.js
├── .env.example
├── package.json
├── tailwind.config.js
├── vercel.json
└── README.md
```

---

## Run locally

**Requirements:** Node.js 18.18+ (Node 20 recommended)

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env.local
# then open .env.local and paste your key:
# ANTHROPIC_API_KEY=sk-ant-...

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Get an API key from the [Anthropic Console](https://console.anthropic.com/).

---

## Push to GitHub

```bash
cd ai-productivity-assistant
git init
git add .
git commit -m "Initial commit: AI Productivity Assistant"
git branch -M main
git remote add origin https://github.com/<your-username>/ai-productivity-assistant.git
git push -u origin main
```

---

## Deploy to Vercel

### Option A — Vercel Dashboard (recommended, no CLI needed)

1. Push the project to a GitHub repo (see above).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — leave the build settings as-is.
4. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your Anthropic API key
   - (optional) `AI_MODEL` = `claude-sonnet-5`
5. Click **Deploy**. You'll get a live URL like `https://ai-productivity-assistant.vercel.app`.

### Option B — Vercel CLI

```bash
npm install -g vercel
cd ai-productivity-assistant
vercel login
vercel                # first deploy (follow prompts)
vercel env add ANTHROPIC_API_KEY   # paste your key when prompted
vercel --prod         # deploy to production
```

---

## Notes for the write-up / submission

- **AI technology used:** Anthropic Claude API (`/v1/messages`), called from a Next.js serverless function so the API key never reaches the browser.
- **Why these 3 features:** Task Planning, Email Generation, and Meeting Notes Summarization cover the most common daily productivity friction points — deciding what to do, communicating, and capturing what was discussed — while sharing one simple backend pattern (prompt-in, text-out), which keeps the codebase small and easy to extend.
- **Extending it:** to add a 4th feature (e.g. Goal Planning), add a new `case` in `buildPrompt()` inside `app/api/generate/route.js`, create a matching component in `components/`, and add a tab in `app/page.js`.
