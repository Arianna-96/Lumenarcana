import imgStrength      from "figma:asset/1860db53d65fe495539bb80862bbed9b4ac15089.png";
import imgTower         from "figma:asset/3b64894ef62f5e4472eed57d190094424067faf4.png";
import imgStar          from "figma:asset/4eb2d49e8d726110fe49125fc1f9782a69e14bc7.png";
import imgTemperance    from "figma:asset/5aff86b2f83c15e444d8a30219ef282e229609a5.png";
import imgWheelFortune  from "figma:asset/d1b282476e8968dd1221be8c3a3647a404659fb0.png";
import imgWorld         from "figma:asset/62df1a687f4c2e303312bcaa70631b775f25f91c.png";
import imgDeath         from "figma:asset/3eb0be2855753bdadaa8d438d7334c16a603debf.png";
import imgFool          from "figma:asset/ca93e22a3857ab460cde4683dc42f434ad324002.png";
import imgJudgement     from "figma:asset/8db4718c9395ca4e0bfc88caa67310d3fb5d8e8f.png";
import imgDevil         from "figma:asset/56938326b49e61324a11acfe6b75e8a5ecb0521f.png";
import imgHangedMan     from "figma:asset/6c83da25331c967ef04b1165cc8f856ff5e135ae.png";
import imgEmperor       from "figma:asset/234cb090b5e1bd6d453b9dbf8af8758cc090b5d6.png";
import imgHierophant    from "figma:asset/7a5e3a23951e95f8b0e272b757170d911ae4c513.png";
import imgSun           from "figma:asset/4f43842a3f82898228354d098195fc3f08b4fc5a.png";
import imgHighPriestess from "figma:asset/e385ff419c76beadc4eda85b473a2c01df95d45a.png";
import imgHermit        from "figma:asset/e25ae0f22102f1d52b47fa62323d467496da8cbd.png";
import imgMagician      from "figma:asset/efa9104f49bda5d3dc9f34b3ceacf7e8dcb813bd.png";
import imgEmpress       from "figma:asset/ba410538a70a5351c7e5a2339bdccefb53961595.png";

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
  19: imgSun,            // The Sun            — XIX
  20: imgJudgement,      // Judgement          — XX
  21: imgWorld,          // The World          — XXI
};