/** TODO: replace with Claude API responses when ready */

export function getPlaceholderReflection(cardName: string, sign: string): string {
  return `As a ${sign}, today's draw of ${cardName} invites you to pause and look inward. The energy surrounding you right now is asking something of you — not an answer, but a willingness to sit with the question. Notice where resistance arises, and what it might be protecting.`;
}

export function getPlaceholderQuestion(cardName: string, sign: string): string {
  return `Given the energy of ${cardName} and what ${sign} carries right now — what is one thing you have been avoiding that deserves your honest attention today?`;
}
