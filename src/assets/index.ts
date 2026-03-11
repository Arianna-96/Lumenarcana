/**
 * src/assets — Lumen Arcana asset manifest
 *
 * All PNG assets live here under human-readable names.
 * The Vite plugin in vite.config.ts maps each filename back to its
 * original figma:asset/<hash>.png virtual module at build time, so no
 * actual binary files need to be present in this directory.
 *
 * To use an asset in a component, import it directly by relative path:
 *   import imgCardBack from "../../assets/card-back.png";
 *
 * Or import a named export from this barrel:
 *   import { cardBack } from "@/assets";
 */

// ── Background / UI ──────────────────────────────────────────────────────────
export { default as noiseTexture  } from "./noise-texture.png";
export { default as noiseTexture2 } from "./noise-texture-2.png";

// ── Card backs ───────────────────────────────────────────────────────────────
export { default as cardBack    } from "./card-back.png";
export { default as cardBackAlt } from "./card-back-alt.png";

// ── Zodiac signs (painted illustrations) ─────────────────────────────────────
export { default as zodiacAries       } from "./zodiac-aries.png";
export { default as zodiacTaurus      } from "./zodiac-taurus.png";
export { default as zodiacGemini      } from "./zodiac-gemini.png";
export { default as zodiacCancer      } from "./zodiac-cancer.png";
export { default as zodiacLeo         } from "./zodiac-leo.png";
export { default as zodiacVirgo       } from "./zodiac-virgo.png";
export { default as zodiacLibra       } from "./zodiac-libra.png";
export { default as zodiacScorpio     } from "./zodiac-scorpio.png";
export { default as zodiacSagittarius } from "./zodiac-sagittarius.png";
export { default as zodiacCapricorn   } from "./zodiac-capricorn.png";
export { default as zodiacAquarius    } from "./zodiac-aquarius.png";
export { default as zodiacPisces      } from "./zodiac-pisces.png";

// ── Tarot illustrations (Major Arcana) ───────────────────────────────────────
export { default as tarotFool           } from "./tarot-fool.png";
export { default as tarotMagician       } from "./tarot-magician.png";
export { default as tarotHighPriestess  } from "./tarot-high-priestess.png";
export { default as tarotEmpress        } from "./tarot-empress.png";
export { default as tarotEmperor        } from "./tarot-emperor.png";
export { default as tarotHierophant     } from "./tarot-hierophant.png";
export { default as tarotStrength       } from "./tarot-strength.png";
export { default as tarotHermit         } from "./tarot-hermit.png";
export { default as tarotWheelOfFortune } from "./tarot-wheel-of-fortune.png";
export { default as tarotHangedMan      } from "./tarot-hanged-man.png";
export { default as tarotDeath          } from "./tarot-death.png";
export { default as tarotTemperance     } from "./tarot-temperance.png";
export { default as tarotDevil          } from "./tarot-devil.png";
export { default as tarotTower          } from "./tarot-tower.png";
export { default as tarotStar           } from "./tarot-star.png";
export { default as tarotSun            } from "./tarot-sun.png";
export { default as tarotJudgement      } from "./tarot-judgement.png";
export { default as tarotWorld          } from "./tarot-world.png";
