import leoImg        from "figma:asset/5889b14e3375786a31e16aba6613479e691a6099.png";
import ariesImg      from "figma:asset/a780b72891f9a9894fb960fa2100006487547eca.png";
import libraImg      from "figma:asset/66c91c1669635a8911518677df67957c8bedc29d.png";
import virgoImg      from "figma:asset/d235001dabbc9fac1504720416cc209dd0e0b788.png";
import geminiImg     from "figma:asset/d972e8ca39891d5f3841664e3894d455591e21c3.png";
import sagittariusImg from "figma:asset/12da9aab2d51820c656fa81b61a676582a66daef.png";
import cancerImg     from "figma:asset/eb95a79da87f1dd7b252ff340819059f5bbf2333.png";
import aquariusImg   from "figma:asset/8786fcf48ed329d84094a919c7c349aef60d817a.png";
import piscesImg     from "figma:asset/9715616bb5f8d120266e3b1d85fa458b68c0e30d.png";
import capricornImg  from "figma:asset/ae77802d2734b6b1a1b6a7c9db2b4e9f5473e815.png";
import scorpioImg    from "figma:asset/2e3c75d10814e4611a8b1e14845f48d2b32c4b5a.png";
import taurusImg     from "figma:asset/8194b14f700563f5013a983f8391dcd9a48c0d87.png";

/** All 12 signs now have a custom painted image. */
export const ZODIAC_IMAGES: Record<string, string> = {
  Aries:       ariesImg,
  Taurus:      taurusImg,
  Gemini:      geminiImg,
  Cancer:      cancerImg,
  Leo:         leoImg,
  Virgo:       virgoImg,
  Libra:       libraImg,
  Scorpio:     scorpioImg,
  Sagittarius: sagittariusImg,
  Capricorn:   capricornImg,
  Aquarius:    aquariusImg,
  Pisces:      piscesImg,
};