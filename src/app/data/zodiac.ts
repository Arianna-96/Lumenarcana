export interface ZodiacInfo {
  name: string;
  glyph: string;
  article: string; // "a" or "an"
}

export const ZODIAC_SIGNS: Record<string, ZodiacInfo> = {
  Aries: { name: "Aries", glyph: "♈", article: "an" },
  Taurus: { name: "Taurus", glyph: "♉", article: "a" },
  Gemini: { name: "Gemini", glyph: "♊", article: "a" },
  Cancer: { name: "Cancer", glyph: "♋", article: "a" },
  Leo: { name: "Leo", glyph: "♌", article: "a" },
  Virgo: { name: "Virgo", glyph: "♍", article: "a" },
  Libra: { name: "Libra", glyph: "♎", article: "a" },
  Scorpio: { name: "Scorpio", glyph: "♏", article: "a" },
  Sagittarius: { name: "Sagittarius", glyph: "♐", article: "a" },
  Capricorn: { name: "Capricorn", glyph: "♑", article: "a" },
  Aquarius: { name: "Aquarius", glyph: "♒", article: "an" },
  Pisces: { name: "Pisces", glyph: "♓", article: "a" },
};

export function getZodiacSign(day: number, month: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}
