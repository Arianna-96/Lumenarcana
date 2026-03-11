import { ZODIAC_SIGNS } from "../data/zodiac";
import { ZODIAC_IMAGES } from "../data/zodiacImages";

interface ZodiacIconProps {
  sign: string;
  visible: boolean;
  onClick?: () => void;
}

export function ZodiacIcon({ sign, visible, onClick }: ZodiacIconProps) {
  const info = ZODIAC_SIGNS[sign];
  if (!info) return null;

  const img = ZODIAC_IMAGES[sign];

  return (
    <div
      className="screen-fade"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        cursor: onClick ? "pointer" : "default",
        transition: "opacity 600ms ease-in-out",
      }}
      onClick={onClick}
      title={onClick ? "Change sign" : undefined}
    >
      <div className="flex flex-col items-center">
        {img ? (
          <img
            src={img}
            alt={sign}
            className="animate-zodiac-glow"
            style={{
              width: 58,
              height: 58,
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <span
            className="animate-zodiac-glow"
            style={{
              display: "block",
              fontSize: "36px",
              color: "#C9933A",
              lineHeight: 1,
              fontFamily: "serif",
            }}
          >
            {info.glyph}
          </span>
        )}
      </div>
    </div>
  );
}