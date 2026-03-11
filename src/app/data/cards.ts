export interface TarotCard {
  id: number;
  number: string;
  name: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0,  number: "0",     name: "The Fool" },
  { id: 1,  number: "I",     name: "The Magician" },
  { id: 2,  number: "II",    name: "The High Priestess" },
  { id: 3,  number: "III",   name: "The Empress" },
  { id: 4,  number: "IV",    name: "The Emperor" },
  { id: 5,  number: "V",     name: "The Hierophant" },
  { id: 6,  number: "VI",    name: "The Lovers" },
  { id: 7,  number: "VII",   name: "The Chariot" },
  { id: 8,  number: "VIII",  name: "Strength" },
  { id: 9,  number: "IX",    name: "The Hermit" },
  { id: 10, number: "X",     name: "Wheel of Fortune" },
  { id: 11, number: "XI",    name: "Justice" },
  { id: 12, number: "XII",   name: "The Hanged Man" },
  { id: 13, number: "XIII",  name: "Death" },
  { id: 14, number: "XIV",   name: "Temperance" },
  { id: 15, number: "XV",    name: "The Devil" },
  { id: 16, number: "XVI",   name: "The Tower" },
  { id: 17, number: "XVII",  name: "The Star" },
  { id: 18, number: "XVIII", name: "The Moon" },
  { id: 19, number: "XIX",   name: "The Sun" },
  { id: 20, number: "XX",    name: "Judgement" },
  { id: 21, number: "XXI",   name: "The World" },
];

export function getRandomCard(): TarotCard {
  const idx = Math.floor(Math.random() * MAJOR_ARCANA.length);
  return MAJOR_ARCANA[idx];
}

/** Shape of a single card returned by the freehoroscopeapi major-arcana endpoint */
export interface ApiTarotCard {
  name: string;
  meaning_up?: string;
  desc?: string;
  [key: string]: unknown;
}
