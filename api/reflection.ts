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

  return `The user is a ${sign}.

Today's horoscope: "${horoscope}"

They drew: ${cardName}
Card meaning: "${cardMeaning}"
Opening instruction: ${style}

RULE 1: The reflection MUST reference at least one specific detail from the horoscope above.
RULE 2: The reflection MUST also connect to the specific energy of ${cardName} — not generically, but using its core themes: what this card represents symbolically and emotionally.
RULE 3: The card and horoscope must feel like two voices saying the same thing. Find the thread that connects them.
RULE 4: Do not ignore either element. A reflection that only uses one of the two is wrong.

Tone: warm, poetic, personal. Short clear sentences. One image per sentence max.
No vague cosmic language. At least one concrete actionable insight.
3-5 sentences for the reflection.

The question must be specific and practical. Based on both the card and horoscope together. One or two sentences.
Do NOT start with "What". Vary: "Where", "When", "Who", "How", "If you", "Imagine", "Think about".

Write ONLY this JSON:
{
  "reflection": "...",
  "question": "..."
}`;
}

export async function POST(req: Request): Promise<Response> {
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
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: buildUserPrompt(sign, horoscope, cardName, cardMeaning) },
        ],
        temperature: 1.0,
        max_tokens: 800,
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

    console.log("[/api/reflection] raw content:", rawContent);

    const cleaned = rawContent
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: { reflection: string; question: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("[/api/reflection] Parse error, raw content:", rawContent);
      return new Response(JSON.stringify({ error: "Parse error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
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
