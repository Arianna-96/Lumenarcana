import imgStrength      from "../../assets/tarot-strength.jpg";
import imgTower         from "../../assets/tarot-tower.jpg";
import imgStar          from "../../assets/tarot-star.jpg";
import imgTemperance    from "../../assets/tarot-temperance.jpg";
import imgWheelFortune  from "../../assets/tarot-wheel-of-fortune.jpg";
import imgWorld         from "../../assets/tarot-world.jpg";
import imgDeath         from "../../assets/tarot-death.jpg";
import imgFool          from "../../assets/tarot-fool.jpg";
import imgJudgement     from "../../assets/tarot-judgement.jpg";
import imgDevil         from "../../assets/tarot-devil.jpg";
import imgHangedMan     from "../../assets/tarot-hanged-man.jpg";
import imgEmperor       from "../../assets/tarot-emperor.jpg";
import imgHierophant    from "../../assets/tarot-hierophant.jpg";
import imgSun           from "../../assets/tarot-sun.jpg";
import imgHighPriestess from "../../assets/tarot-high-priestess.jpg";
import imgHermit        from "../../assets/tarot-hermit.jpg";
import imgMagician      from "../../assets/tarot-magician.jpg";
import imgEmpress       from "../../assets/tarot-empress.jpg";
import imgMoon          from "../../assets/tarot-moon.jpg";

/**
 * Maps a card id (matching MAJOR_ARCANA[n].id) to its illustration asset.
 * Cards without an entry fall back to the procedural design in CardReflectionScreen.
 */
export const CARD_IMAGES: Record<number, string> = {
  0:  imgFool,           // The Fool           — 0
  1:  imgMagician,       // The Magician       — I
  2:  imgHighPriestess,  // The High Priestess — II
  3:  imgEmpress,        // The Empress        — III
  4:  imgEmperor,        // The Emperor        — IV
  5:  imgHierophant,     // The Hierophant     — V
  8:  imgStrength,       // Strength           — VIII
  9:  imgHermit,         // The Hermit         — IX
  10: imgWheelFortune,   // Wheel of Fortune   — X
  12: imgHangedMan,      // The Hanged Man     — XII
  13: imgDeath,          // Death              — XIII
  14: imgTemperance,     // Temperance         — XIV
  15: imgDevil,          // The Devil          — XV
  16: imgTower,          // The Tower          — XVI
  17: imgStar,           // The Star           — XVII
  18: imgMoon,           // The Moon           — XVIII
  19: imgSun,            // The Sun            — XIX
  20: imgJudgement,      // Judgement          — XX
  21: imgWorld,          // The World          — XXI
};
