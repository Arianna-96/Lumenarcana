import imgStrength      from "../../assets/tarot-strength.png";
import imgTower         from "../../assets/tarot-tower.png";
import imgStar          from "../../assets/tarot-star.png";
import imgTemperance    from "../../assets/tarot-temperance.png";
import imgWheelFortune  from "../../assets/tarot-wheel-of-fortune.png";
import imgWorld         from "../../assets/tarot-world.png";
import imgDeath         from "../../assets/tarot-death.png";
import imgFool          from "../../assets/tarot-fool.png";
import imgJudgement     from "../../assets/tarot-judgement.png";
import imgDevil         from "../../assets/tarot-devil.png";
import imgHangedMan     from "../../assets/tarot-hanged-man.png";
import imgEmperor       from "../../assets/tarot-emperor.png";
import imgHierophant    from "../../assets/tarot-hierophant.png";
import imgSun           from "../../assets/tarot-sun.png";
import imgHighPriestess from "../../assets/tarot-high-priestess.png";
import imgHermit        from "../../assets/tarot-hermit.png";
import imgMagician      from "../../assets/tarot-magician.png";
import imgEmpress       from "../../assets/tarot-empress.png";
import imgMoon          from "../../assets/tarot-moon.png";

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
