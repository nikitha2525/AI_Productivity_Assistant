import { NextResponse } from "next/server";

// This route is the single backend endpoint used by all three features.
// It receives { feature, payload } from the client, builds an appropriate
// prompt, calls the Claude API, and returns the generated text.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-5";

function buildPrompt(feature, payload) {
  switch (feature) {
    case "task-planner": {
      const { goal, deadline, context } = payload;
      return `You are a productivity planning assistant. Break the following goal into a clear, prioritized, actionable task list.

Goal: ${goal}
Deadline: ${deadline || "Not specified"}
Extra context: ${context || "None"}

Return the result as clean markdown with:
- A short 1-2 sentence summary of the approach
- A prioritized checklist of tasks (use "- [ ] " for each item)
- Suggested order / rough time estimate per task where useful
Keep it concise and practical, no fluff.`;
    }
    case "email-generator": {
      const { purpose, recipient, tone, keyPoints } = payload;
      return `You are an email drafting assistant. Write a complete, ready-to-send email.

Purpose: ${purpose}
Recipient / relationship: ${recipient || "Not specified"}
Tone: ${tone || "Professional"}
Key points to include: ${keyPoints || "None specified"}

Return only the email with a Subject line, greeting, body, and sign-off. Do not include any commentary before or after the email.`;
    }
    case "meeting-notes": {
      const { rawNotes } = payload;
      return `You are a meeting notes assistant. Turn the following raw, messy meeting notes or transcript into a clean, structured summary.

Raw notes:
"""
${rawNotes}
"""

Return clean markdown with these sections:
## Summary
(2-4 sentences)
## Key Discussion Points
(bulleted)
## Decisions Made
(bulleted, or "None recorded" if none)
## Action Items
(bulleted, each as "- [ ] Owner — Task — Due date (if mentioned)")`;
    }
    default:
      return null;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { feature, payload } = body || {};

    if (!feature || !payload) {
      return NextResponse.json(
        { error: "Missing 'feature' or 'payload' in request body." },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(feature, payload);
    if (!prompt) {
      return NextResponse.json(
        { error: `Unknown feature: ${feature}` },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Server is missing ANTHROPIC_API_KEY. Add it in your Vercel project's Environment Variables (see README).",
        },
        { status: 500 }
      );
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || DEFAULT_MODEL,
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `AI API error (${response.status}): ${errText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const textBlocks = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text);
    const result = textBlocks.join("\n").trim();

    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}

