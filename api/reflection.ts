export const config = { runtime: "edge" };

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
  cardMeaning: string
): string {
  const style = OPENING_STYLES[Math.floor(Math.random() * OPENING_STYLES.length)];

  return `The user is a ${sign}. Today's horoscope: "${horoscope}"

They drew: ${cardName}
Card meaning: "${cardMeaning}"
Opening instruction: ${style}

IMPORTANT: The horoscope is the most important element. It changes every day and must drive the reflection. The card meaning is the lens, the horoscope is the subject. If you ignore the horoscope the reflection is wrong.

Tone: warm, poetic, personal. Metaphors welcome but keep sentences short and clear.
Do not always start with the zodiac sign name as a direct address.
Avoid overly elaborate compound metaphors — one image per sentence is enough.
The reflection should include at least one concrete, actionable insight — not just imagery. Something the person can actually think about or do today.
Avoid vague cosmic language — ground the message in real human experience.
Length: 3-5 sentences for the reflection.

The journaling question must be specific and practical. It should help the person reflect on something concrete in their actual life — relationships, decisions, emotions, habits. Someone should be able to open their journal and start writing immediately after reading it. One or two sentences only. It should be based on the reflection.
The question must NOT always start with "What". Vary the opening — sometimes start with "Where", "When", "Who", "How", "Which", "Think about", "If you", "Imagine", or make it a direct statement that implies a question. Never use the same sentence structure twice.

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
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: buildUserPrompt(sign, horoscope, cardName, cardMeaning) },
        ],
        temperature: 1.0,
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

    const cleaned = rawContent
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // sanitizza caratteri di controllo illegali
    const sanitized = cleaned.replace(/[\u0000-\u001F\u007F]/g, (char) => {
      if (char === "\n") return "\\n";
      if (char === "\r") return "\\r";
      if (char === "\t") return "\\t";
      return "";
    });

    const parsed = JSON.parse(sanitized) as { reflection: string; question: string };

    if (!parsed.reflection || !parsed.question) {
      throw new Error("Missing reflection or question in Groq response");
    }

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
