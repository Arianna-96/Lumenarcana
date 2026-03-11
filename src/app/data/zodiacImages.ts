import leoImg         from "../../assets/zodiac-leo.png";
import ariesImg       from "../../assets/zodiac-aries.png";
import libraImg       from "../../assets/zodiac-libra.png";
import virgoImg       from "../../assets/zodiac-virgo.png";
import geminiImg      from "../../assets/zodiac-gemini.png";
import sagittariusImg from "../../assets/zodiac-sagittarius.png";
import cancerImg      from "../../assets/zodiac-cancer.png";
import aquariusImg    from "../../assets/zodiac-aquarius.png";
import piscesImg      from "../../assets/zodiac-pisces.png";
import capricornImg   from "../../assets/zodiac-capricorn.png";
import scorpioImg     from "../../assets/zodiac-scorpio.png";
import taurusImg      from "../../assets/zodiac-taurus.png";

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
