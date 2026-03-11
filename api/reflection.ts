/**
 * Vercel Edge Function — /api/reflection
 *
 * Receives: POST { sign, horoscope, cardName, cardMeaning }
 * Returns:  { reflection: string, question: string }
 *
 * The GROQ_API_KEY must be set as an environment variable in Vercel project settings.
 * Never expose this key in frontend code.
 */

export const config = { runtime: "edge" };

const SYSTEM_PROMPT =
  "You are a warm, poetic tarot guide. You write personal, evocative reflections using metaphor and imagery — but always in clear, simple sentences. No complex or convoluted phrasing. Every sentence should be easy to read on first try. Always respond ONLY with a valid JSON object, no markdown, no backticks, no preamble.";

function buildUserPrompt(
  sign: string,
  horoscope: string,
  cardName: string,
  cardMeaning: string
): string {
  return `The user is a ${sign}. Today's horoscope: "${horoscope}"

They drew: ${cardName}
Card meaning: "${cardMeaning}"

Use both the horoscope energy and the card meaning together to craft the reflection and question. They should feel like two voices saying the same thing in different ways — not two separate ideas.

Tone: warm, poetic, personal. Metaphors welcome but keep sentences short and clear.
Do not start with the zodiac sign name as a direct address.
Avoid overly elaborate compound metaphors — one image per sentence is enough.
The reflection should include at least one concrete, actionable insight — not just imagery. Something the person can actually think about or do today.
Avoid vague cosmic language — ground the message in real human experience.
Length: 3-4 sentences for the reflection.

The journaling question must be specific and practical. It should help the person reflect on something concrete in their actual life — relationships, decisions, emotions, habits. Someone should be able to open their journal and start writing immediately after reading it. One sentence only.

Write ONLY this JSON:
{
  "reflection": "...",
  "question": "..."
}`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { sign: string; horoscope: string; cardName: string; cardMeaning: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { sign, horoscope, cardName, cardMeaning } = body;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: buildUserPrompt(sign, horoscope, cardName, cardMeaning) },
        ],
        temperature: 0.85,
        max_tokens: 400,
      }),
    });

    if (!groqRes.ok) {
      const text = await groqRes.text();
      console.error("[/api/reflection] Groq error:", groqRes.status, text);
      return new Response(JSON.stringify({ error: "Groq API error" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groqData = await groqRes.json() as {
      choices: Array<{ message: { content: string } }>;
    };

    const rawContent = groqData.choices?.[0]?.message?.content ?? "{}";

    // Strip any accidental markdown fences before parsing
    const cleaned = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(cleaned) as { reflection: string; question: string };

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[/api/reflection] Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
