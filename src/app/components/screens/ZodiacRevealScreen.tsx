import { useEffect, useState } from "react";
import { ZODIAC_SIGNS } from "../../data/zodiac";
import { ZODIAC_IMAGES } from "../../data/zodiacImages";

interface ZodiacRevealScreenProps {
  sign: string;
  onComplete: () => void;
}

type Phase = "hidden" | "symbol-in" | "symbol-up" | "text-in";

export function ZodiacRevealScreen({ sign, onComplete }: ZodiacRevealScreenProps) {
  const [phase, setPhase] = useState<Phase>("hidden");
  const info = ZODIAC_SIGNS[sign];
  const img  = ZODIAC_IMAGES[sign];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("symbol-in"), 100);
    const t2 = setTimeout(() => setPhase("symbol-up"), 1600);
    const t3 = setTimeout(() => setPhase("text-in"),   2200);
    const t4 = setTimeout(() => onComplete(),          4400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const isUp = phase === "symbol-up" || phase === "text-in";

  /** Shared animated-wrapper styles (same for both img and glyph) */
  const symbolStyle: React.CSSProperties = {
    opacity: phase === "hidden" ? 0 : 1,
    transform: isUp
      ? "scale(0.72) translateY(-16px)"
      : "scale(1) translateY(0)",
    transition: phase === "symbol-in"
      ? "opacity 900ms ease-in-out"
      : "opacity 800ms ease-in-out, transform 800ms ease-in-out",
    transformOrigin: "center center",
  };

  return (
    <div
      className="flex flex-col items-center justify-center max-sm:px-6"
      style={{ minHeight: "100vh" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(12px, 2vh, 20px)",
        }}
      >
        {/* ── Zodiac symbol (image or glyph fallback) ── */}
        {img ? (
          <img
            src={img}
            alt={sign}
            style={{
              width:  "clamp(120px, 22vw, 180px)",
              height: "clamp(120px, 22vw, 180px)",
              objectFit: "contain",
              filter: "drop-shadow(0 0 18px rgba(201,147,58,0.25))",
              display: "block",
              ...symbolStyle,
            }}
          />
        ) : (
          <span
            style={{
              display: "block",
              fontSize: "clamp(80px, 15vw, 120px)",
              color: "#C9933A",
              fontFamily: "serif",
              textAlign: "center",
              textShadow: "0 0 20px rgba(201,147,58,0.12)",
              filter: "drop-shadow(0 0 6px rgba(201,147,58,0.12))",
              ...symbolStyle,
            }}
          >
            {info?.glyph || "✦"}
          </span>
        )}

        {/* ── Reveal text ── */}
        <p
          style={{
            fontFamily: "'Italiana', serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            color: "#F0EEF8",
            fontWeight: 400,
            letterSpacing: "0.03em",
            marginTop: "-20px",
            textAlign: "center",
            opacity: phase === "text-in" ? 1 : 0,
            transform: phase === "text-in" ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 700ms ease-in-out, transform 700ms ease-in-out",
          }}
        >
          Oh… {info?.article} {sign}. The sky remembers.
        </p>
      </div>
    </div>
  );
}