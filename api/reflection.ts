/**
 * Vercel Edge Function — /api/reflection
 *
 * Receives: POST { sign, horoscope, cardName, cardMeaning }
 * Returns:  { reflection: string, question: string }
 *
 * The GROQ_API_KEY must be set as an environment variable in Vercel project settings.
 * Never expose this key in frontend code.
 */

/*export const config = { runtime: "edge" };*/

const SYSTEM_PROMPT =
  "You are a warm, poetic tarot guide. You write personal, evocative reflections using metaphor and imagery — but always in clear, simple sentences. No complex or convoluted phrasing. Every sentence should be easy to read on first try. Always respond ONLY with a valid JSON object, no markdown, no backticks, no preamble.";

const OPENING_STYLES = [
  "Start with an observation about the external world that mirrors the inner one.",
  "Start with a sensory image — something the person might see, hear, or feel today.",
  "Start with a quiet question disguised as a statement.",
  "Start with what the card is releasing, not what it's calling in.",
  "Start with the tension between two opposing energies in the reading.",
  "Start with something small and concrete — an object, a gesture, a moment.",
  "Start with what the horoscope and card are both quietly pointing toward.",
];


function buildUserPrompt(
  sign: string,
  horoscope: string,
  cardName: string,
  cardMeaning: string,
  seed: string
): string {
  return `The user is a ${sign}.

Today's horoscope: "${horoscope}"

They drew: ${cardName}. Card meaning: "${cardMeaning}"

The horoscope is the PRIMARY element — it changes every day and must be the beating heart of the reflection. The card is the lens through which to read it, not the other way around. If the horoscope energy is restless, the reflection must feel restless. If it is expansive, the reflection opens up. Mirror the horoscope specific energy first, then filter it through the card meaning.

Variation seed: ${seed}
Opening instruction: ${style}

Tone: warm, poetic, personal. Metaphors welcome but keep sentences short and clear.
Do not always start with the zodiac sign name as a direct address.
Avoid overly elaborate compound metaphors — one image per sentence is enough.
The reflection should include at least one concrete, actionable insight — not just imagery. Something the person can actually think about or do today.
Avoid vague cosmic language — ground the message in real human experience.
Length: 3-5 sentences for the reflection.

The journaling question must be specific and practical. It should help the person reflect on something concrete in their actual life — relationships, decisions, emotions, habits. Someone should be able to open their journal and start writing immediately after reading it. One or two sentences only.

Write ONLY this JSON object with no markdown, no backticks, no extra text before or after:
{"reflection": "...", "question": "..."}`;
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
  const seed = Math.random().toString(36).substring(2, 10);

  try {
