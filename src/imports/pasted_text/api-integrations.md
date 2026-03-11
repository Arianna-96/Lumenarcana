Integrate three external APIs: Tarot, Horoscope, and Groq AI reflection
Important: all values are dynamic, not hardcoded

sign — comes from localStorage key tarot_sign, set during onboarding
cardName and cardMeaning — come from the card drawn by the user, matched against apiTarotCards by name
horoscope — fetched fresh every day from the horoscope API using the user's sign


1. Tarot API
Fetch the Major Arcana cards on app load:
GET https://tarot-api-3hv5.onrender.com/api/v1/cards?type=major
Response shape:
json{
  "cards": [
    {
      "name": "The Fool",
      "number": "0",
      "arcana": "Major Arcana",
      "meaning_up": "Beginnings, innocence, spontaneity, a free spirit"
    }
  ]
}
```

Store the result in a state variable `apiTarotCards` at the app root level. Pass it down to `CardReflectionScreen` as a prop.

---

**2. Horoscope API**

Fetch the daily horoscope as soon as the user's sign is available (after onboarding). The sign must be lowercased:
```
GET https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign={sign}&day=TODAY
```

Example with sign "Leo":
```
GET https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=leo&day=TODAY
Response shape:
json{
  "data": {
    "horoscope_data": "Today is a powerful day for reflection..."
  }
}
Store the result in a horoscopeText state variable at the app root level. Pass it down to CardReflectionScreen as a prop.

3. Groq API — AI reflection
Call this from inside CardReflectionScreen once both apiTarotCards and horoscopeText are available. Use a serverless edge function at /api/reflection to avoid exposing the API key in the frontend.
The edge function receives a POST request with this body:
json{
  "sign": "<user's zodiac sign from localStorage>",
  "horoscope": "<horoscopeText fetched today for that sign>",
  "cardName": "<name of the card the user drew>",
  "cardMeaning": "<meaning_up of that card from apiTarotCards>"
}
Match the drawn card against apiTarotCards by name to get cardMeaning:
typescriptconst cardData = apiTarotCards?.find(c => c.name === card.name);
const cardMeaning = cardData?.meaning_up ?? "";
```

The edge function calls:
```
POST https://api.groq.com/openai/v1/chat/completions
Authorization: Bearer ${GROQ_API_KEY}
Content-Type: application/json
With this body:
json{
  "model": "llama-3.1-70b-versatile",
  "messages": [
    {
      "role": "system",
      "content": "You are a warm, poetic tarot guide. You write personal, evocative reflections using metaphor and imagery — but always in clear, simple sentences. No complex or convoluted phrasing. Every sentence should be easy to read on first try. Always respond ONLY with a valid JSON object, no markdown, no backticks, no preamble."
    },
    {
      "role": "user",
      "content": "The user is a {sign}. Today's horoscope: \"{horoscope}\"\n\nThey drew: {cardName}\nCard meaning: \"{cardMeaning}\"\n\nUse both the horoscope energy and the card meaning together to craft the reflection and question. They should feel like two voices saying the same thing in different ways — not two separate ideas.\n\nTone: warm, poetic, personal. Metaphors welcome but keep sentences short and clear.\nDo not start with the zodiac sign name as a direct address.\nAvoid overly elaborate compound metaphors — one image per sentence is enough.\nThe reflection should include at least one concrete, actionable insight — not just imagery. Something the person can actually think about or do today.\nAvoid vague cosmic language — ground the message in real human experience.\nLength: 3-4 sentences for the reflection.\n\nThe journaling question must be specific and practical. It should help the person reflect on something concrete in their actual life — relationships, decisions, emotions, habits. Someone should be able to open their journal and start writing immediately after reading it. One sentence only.\n\nWrite ONLY this JSON:\n{\n  \"reflection\": \"...\",\n  \"question\": \"...\"\n}"
    }
  ]
}
Note: in the actual edge function, replace {sign}, {horoscope}, {cardName}, {cardMeaning} with the real dynamic values interpolated from the request body.
The edge function returns to the frontend:
json{
  "reflection": "...",
  "question": "..."
}
```

In `CardReflectionScreen`, replace `getPlaceholderReflection` and `getPlaceholderQuestion` with the `reflection` and `question` values returned by `/api/reflection`. Show the `Shimmer` component while the request is in flight.

---

**4. Environment variable**

Add to `.env`:
```
GROQ_API_KEY=your_key_here
On Vercel, add GROQ_API_KEY as an environment variable in the project settings. Never expose it in frontend code.

5. Loading and error states

While any API is loading → pass apiTarotLoading={true} to CardReflectionScreen to show Shimmer in the reflection and question sections
If the Groq API call fails for any reason → silently fall back to getPlaceholderReflection(card.name, sign) and getPlaceholderQuestion(card.name, sign)
If the horoscope API fails → call Groq without the horoscope field, or pass an empty string