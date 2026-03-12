import { useState, useCallback, useEffect, useRef } from "react";
import { TarotCard } from "../../data/cards";
import imgCardBack from "../../../assets/card-back.jpg";

interface DeckScreenProps {
  onCardPicked: (card: TarotCard) => void;
  availableCards: TarotCard[];
}

type CT = { x: number; y: number; rotate: number; scale: number; zIndex: number };

const L = 10;

const REST: CT[] = [
  { x:  3, y: -6,  rotate: -2.5, scale: 1.000, zIndex: 10 },
  { x: -8, y:  4,  rotate: -6.0, scale: 0.994, zIndex:  9 },
  { x:  7, y: -2,  rotate:  4.5, scale: 0.988, zIndex:  8 },
  { x: -4, y:  8,  rotate: -8.0, scale: 0.982, zIndex:  7 },
  { x:  9, y:  1,  rotate:  3.0, scale: 0.976, zIndex:  6 },
  { x: -7, y:  6,  rotate: -3.5, scale: 0.970, zIndex:  5 },
  { x:  5, y: -4,  rotate:  7.0, scale: 0.964, zIndex:  4 },
  { x: -2, y:  9,  rotate: -5.5, scale: 0.958, zIndex:  3 },
  { x:  6, y:  3,  rotate:  2.0, scale: 0.952, zIndex:  2 },
  { x: -5, y: -1,  rotate: -7.5, scale: 0.946, zIndex:  1 },
];

const SHUFFLE: CT[][] = [
  [
    { x: 54,  y: -20, rotate:  13,  scale: 0.97, zIndex: 12 },
    { x: -1,  y:   0, rotate: -1.5, scale: 1.00, zIndex: 10 },
    { x:  3,  y:   2, rotate:  2.0, scale: 0.99, zIndex:  9 },
    { x: -2,  y:   4, rotate: -3.5, scale: 0.98, zIndex:  8 },
    { x:  4,  y:   6, rotate:  2.5, scale: 0.97, zIndex:  7 },
    { x: -3,  y:   8, rotate: -4.5, scale: 0.96, zIndex:  6 },
    { x:  3,  y:  10, rotate:  4.0, scale: 0.95, zIndex:  5 },
    { x: -4,  y:  12, rotate: -3.0, scale: 0.95, zIndex:  4 },
    { x:  5,  y:  14, rotate:  3.5, scale: 0.94, zIndex:  3 },
    { x: -2,  y:  16, rotate: -5.0, scale: 0.94, zIndex:  2 },
  ],
  [
    { x: -5,  y: -1,  rotate: -7.5, scale: 0.946, zIndex:  1 },
    { x:  3,  y: -6,  rotate: -2.5, scale: 1.000, zIndex: 10 },
    { x: -8,  y:  4,  rotate: -6.0, scale: 0.994, zIndex:  9 },
    { x:  7,  y: -2,  rotate:  4.5, scale: 0.988, zIndex:  8 },
    { x: -4,  y:  8,  rotate: -8.0, scale: 0.982, zIndex:  7 },
    { x:  9,  y:  1,  rotate:  3.0, scale: 0.976, zIndex:  6 },
    { x: -7,  y:  6,  rotate: -3.5, scale: 0.970, zIndex:  5 },
    { x:  5,  y: -4,  rotate:  7.0, scale: 0.964, zIndex:  4 },
    { x: -2,  y:  9,  rotate: -5.5, scale: 0.958, zIndex:  3 },
    { x:  6,  y:  3,  rotate:  2.0, scale: 0.952, zIndex:  2 },
  ],
];

const SCATTER: Omit<CT, "zIndex">[] = [
  { x:  3, y: -6,  rotate: -2.5, scale: 1.000 },
  { x: -8, y:  4,  rotate: -6.0, scale: 0.994 },
  { x:  7, y: -2,  rotate:  4.5, scale: 0.988 },
  { x: -4, y:  8,  rotate: -8.0, scale: 0.982 },
  { x:  9, y:  1,  rotate:  3.0, scale: 0.976 },
  { x: -7, y:  6,  rotate: -3.5, scale: 0.970 },
  { x:  5, y: -4,  rotate:  7.0, scale: 0.964 },
  { x: -2, y:  9,  rotate: -5.5, scale: 0.958 },
  { x:  6, y:  3,  rotate:  2.0, scale: 0.952 },
  { x: -5, y: -1,  rotate: -7.5, scale: 0.946 },
];

const FLOAT_PARAMS = [
  { duration: "3.8s", delay: "0.0s", ampY: 5, ampR:  0.4 },
  { duration: "4.4s", delay: "0.6s", ampY: 4, ampR: -0.5 },
  { duration: "3.5s", delay: "1.1s", ampY: 6, ampR:  0.3 },
  { duration: "4.8s", delay: "0.3s", ampY: 4, ampR: -0.6 },
  { duration: "3.2s", delay: "0.9s", ampY: 5, ampR:  0.4 },
  { duration: "4.1s", delay: "0.5s", ampY: 3, ampR: -0.5 },
  { duration: "3.7s", delay: "1.3s", ampY: 4, ampR:  0.3 },
  { duration: "4.5s", delay: "0.2s", ampY: 5, ampR: -0.4 },
  { duration: "3.9s", delay: "0.8s", ampY: 4, ampR:  0.5 },
  { duration: "4.2s", delay: "1.5s", ampY: 3, ampR: -0.3 },
];

const SHADOW_SOFT = "0 2px 20px rgba(0,0,0,0.18)";
const SHADOW_PICK = "0 2px 20px rgba(0,0,0,0.18)";

export function DeckScreen({ onCardPicked, availableCards }: DeckScreenProps) {
  const [isHovered, setIsHovered]         = useState(false);
  const [phaseIdx, setPhaseIdx]           = useState(0);
  const [isClicked, setIsClicked]         = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isHovered && !isClicked) {
      intervalRef.current = setInterval(() => {
        setPhaseIdx(p => (p + 1) % SHUFFLE.length);
      }, 700);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!isClicked) setPhaseIdx(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHovered, isClicked]);

  // ── Mouse handlers (desktop + touch PC) ──
  const handleHover = useCallback(() => {
    if (!isClicked) setIsHovered(true);
  }, [isClicked]);

  const handleLeave = useCallback(() => {
    if (isClicked) return;
    setIsHovered(false);
    setPhaseIdx(0);
  }, [isClicked]);

  // ── Touch handlers (mobile long press) ──
  const handleTouchStart = useCallback(() => {
    if (isClicked) return;
    touchTimerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 400);
  }, [isClicked]);

  const handleTouchEnd = useCallback(() => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (isClicked) return;
    if (isHovered) {
      setIsHovered(false);
      setPhaseIdx(0);
    }
  }, [isClicked, isHovered]);

  const handleClick = useCallback(() => {
    if (isClicked) return;
    setIsClicked(true);
    setIsHovered(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    const sl   = Math.floor(Math.random() * L);
    const card = availableCards[Math.floor(Math.random() * availableCards.length)] ?? availableCards[0];
    setSelectedLayer(sl);
    setTimeout(() => { if (card) onCardPicked(card); }, 900);
  }, [isClicked, availableCards, onCardPicked]);

  const getTransform = (i: number): CT => {
    if (isClicked) {
      if (i === selectedLayer) return { x: 0, y: -110, rotate: 0, scale: 1.06, zIndex: 20 };
      return { ...SCATTER[i], zIndex: L - i };
    }
    if (isHovered) return SHUFFLE[phaseIdx][i];
    return REST[i];
  };

  const cardW = 190;
  const cardH = 320;

  return (
    <>
      <style>{`
        @keyframes card-float-y {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(var(--amp-y)) rotate(var(--amp-r)); }
        }
        .instruction-desktop { display: block; }
        .instruction-mobile  { display: none;  }
        @media (hover: none) {
          .instruction-desktop { display: none;  }
          .instruction-mobile  { display: block; }
        }
      `}</style>

      <div
        className="flex flex-col items-center justify-center gap-16 px-6"
        style={{ animation: "fade-in-up 1200ms ease-in-out forwards", paddingTop: "80px" }}
      >
        <div style={{ position: "relative" }}>

          <div style={{
            position: "absolute",
            bottom: -20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "120%",
            height: 60,
            background: "radial-gradient(ellipse at center, rgba(201,147,58,0.06) 0%, rgba(74,47,212,0.03) 55%, transparent 80%)",
            filter: "blur(28px)",
            transition: "opacity 1000ms ease-in-out",
            opacity: isHovered ? 0.9 : 0.35,
            pointerEvents: "none",
            zIndex: 0,
          }} />

          <div
            className="relative select-none cursor-pointer"
            style={{ width: cardW, height: cardH, overflow: "visible", zIndex: 1 }}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {Array.from({ length: L }, (_, ri) => {
              const i          = L - 1 - ri;
              const t          = getTransform(i);
              const isSelected = isClicked && i === selectedLayer;
              const fp         = FLOAT_PARAMS[i];
              const isFloating = !isHovered && !isClicked;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: cardW,
                    height: cardH,
                    borderRadius: 18,
                    overflow: "visible",
                    zIndex: t.zIndex,
                    transform: `translate(${t.x}px, ${t.y}px) rotate(${t.rotate}deg) scale(${t.scale})`,
                    transition: isClicked
                      ? "transform 900ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 600ms ease-in-out"
                      : "transform 950ms cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: isSelected ? SHADOW_PICK : SHADOW_SOFT,
                    opacity: 1,
                  }}
                >
                  <div style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 18,
                    overflow: "hidden",
                    // @ts-ignore
                    "--amp-y": `${fp.ampY}px`,
                    "--amp-r": `${fp.ampR}deg`,
                    animation: isFloating
                      ? `card-float-y ${fp.duration} ${fp.delay} ease-in-out infinite`
                      : "none",
                  }}>
                    <img
                      src={imgCardBack}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                      draggable={false}
                    />
                    {i > 0 && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 18,
                        background: `rgba(5,4,15,${i * 0.03})`,
                        pointerEvents: "none",
                      }} />
                    )}
                    {isClicked && !isSelected && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 18,
                        background: "rgba(5,4,15,0.55)",
                        pointerEvents: "none",
                        transition: "opacity 500ms ease-in-out",
                      }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          opacity: isClicked ? 0 : 1,
          transition: "opacity 1200ms ease-in-out",
        }}>
          <p
            className="instruction-desktop"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "clamp(13px, 1.6vw, 16px)",
              color: "rgba(225,225,225,0.65)",
              fontWeight: 400,
              textAlign: "center",
              lineHeight: 1.75,
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Hover on the deck to shuffle.
          </p>
          <p
            className="instruction-mobile"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "clamp(13px, 1.6vw, 16px)",
              color: "rgba(225,225,225,0.65)",
              fontWeight: 400,
              textAlign: "center",
              lineHeight: 1.75,
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Hold to shuffle.
          </p>
          <p
            className="instruction-desktop"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "clamp(13px, 1.6vw, 16px)",
              color: "rgba(225,225,225,0.65)",
              fontWeight: 400,
              textAlign: "center",
              lineHeight: 1,
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Click when you're ready to draw.
          </p>
          <p
            className="instruction-mobile"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "clamp(13px, 1.6vw, 16px)",
              color: "rgba(225,225,225,0.65)",
              fontWeight: 400,
              textAlign: "center",
              lineHeight: 1,
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Tap when you're ready to draw.
          </p>
        </div>
      </div>
    </>
  );
}
