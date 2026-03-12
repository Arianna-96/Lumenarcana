import { useState, useRef, useCallback, useEffect } from "react";
import { TarotCard, ApiTarotCard } from "../../data/cards";
import { getPlaceholderReflection, getPlaceholderQuestion } from "../../data/reflections";
import { updateHistoryEntry } from "../../data/history";
import { CARD_IMAGES } from "../../data/cardImages";
import imgCardBack from "../../../assets/card-back.jpg";

type Phase = "back" | "flipping" | "front" | "settling" | "settled";

interface CardReflectionScreenProps {
  card: TarotCard;
  sign: string;
  isReturnVisit?: boolean;
  apiTarotCards?: ApiTarotCard[] | null;
  horoscopeText?: string | null;
  apiTarotLoading?: boolean;
}

function Shimmer({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2 w-full" aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "14px",
            borderRadius: "6px",
            background: "linear-gradient(90deg, rgba(160,156,192,0.08) 0%, rgba(160,156,192,0.18) 50%, rgba(160,156,192,0.08) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer-slide 1.6s infinite linear",
            width: i === lines - 1 ? "60%" : "100%",
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

function formatTodayShort(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export function CardReflectionScreen({
  card, sign, isReturnVisit = false, apiTarotCards, horoscopeText, apiTarotLoading = true,
}: CardReflectionScreenProps) {
  const [phase, setPhase]       = useState<Phase>(isReturnVisit ? "settled" : "back");
  const [flipped, setFlipped]   = useState(isReturnVisit);
  const [tiltX, setTiltX]       = useState(0);
  const [tiltY, setTiltY]       = useState(0);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [groqLoading, setGroqLoading] = useState(true);
  const [groqResult, setGroqResult]   = useState<{ reflection: string; question: string } | null>(null);

  useEffect(() => {
    if (apiTarotLoading) return;

    const today = new Date().toDateString();
    try {
      const cached = localStorage.getItem("tarot_today");
      if (cached) {
        const parsed = JSON.parse(cached) as { date: string; cardId: number; reflection?: string; question?: string };
        if (parsed.date === today && parsed.reflection && parsed.question) {
          setGroqResult({ reflection: parsed.reflection, question: parsed.question });
          setGroqLoading(false);
          return;
        }
      }
    } catch {}

    let cancelled = false;
    const cardData    = apiTarotCards?.find((c) => c.name === card.name);
    const cardMeaning = cardData?.meaning_up ?? "";

    fetch("/api/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sign, horoscope: horoscopeText ?? "", cardName: card.name, cardMeaning }),
    })
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() as Promise<{ reflection: string; question: string }>; })
      .then((data) => {
        if (cancelled) return;
        if (data.reflection && data.question) {
          setGroqResult(data);
          try {
            const existing = localStorage.getItem("tarot_today");
            if (existing) {
              const parsed = JSON.parse(existing);
              localStorage.setItem("tarot_today", JSON.stringify({ ...parsed, reflection: data.reflection, question: data.question }));
            }
          } catch {}
          updateHistoryEntry(today, { reflection: data.reflection, question: data.question });
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setGroqLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiTarotLoading]);

  const isLoadingReflection = apiTarotLoading || groqLoading;

  useEffect(() => {
    if (isReturnVisit) return;
    const timers = [
      setTimeout(() => { setFlipped(true); setPhase("flipping"); }, 600),
      setTimeout(() => setPhase("front"),    1650),
      setTimeout(() => setPhase("settling"), 2400),
      setTimeout(() => setPhase("settled"),  3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isReturnVisit]);

  const isLarge          = phase === "back" || phase === "flipping" || phase === "front";
  const isContentVisible = phase === "settling" || phase === "settled";
  const isSettled        = phase === "settled";

  const cardImage      = CARD_IMAGES[card.id] ?? null;
  const reflectionText = groqResult?.reflection ?? getPlaceholderReflection(card.name, sign);
  const questionText   = groqResult?.question   ?? getPlaceholderQuestion(card.name, sign);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !isSettled || expanded) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTiltX(-(e.clientY - (rect.top  + rect.height / 2)) * 0.025);
    setTiltY( (e.clientX - (rect.left + rect.width  / 2)) * 0.025);
  }, [isSettled, expanded]);

  const handleMouseLeave = useCallback(() => { setTiltX(0); setTiltY(0); }, []);

  const cardTransform =
    !flipped  ? "rotate(-8deg) rotateY(0deg)"
    : isSettled ? `rotate(-5deg) rotateX(${tiltX}deg) rotateY(${180 + tiltY}deg)`
    :             "rotate(-8deg) rotateY(180deg)";

  const cardTransition =
    phase === "flipping" ? "transform 950ms ease-in-out"
    : isSettled          ? "transform 100ms linear"
    :                      "transform 600ms ease-in-out";

  const paddingTop = isLarge
    ? "calc(50vh - clamp(166px, 31vw, 215px) - 32px)"
    : "clamp(100px, 14vh, 140px)";

  const cardW = isLarge   ? "clamp(200px, 38vw, 260px)"
    : expanded             ? "clamp(180px, 30vw, 280px)"
    :                        "clamp(120px, 22vw, 150px)";
  const cardH = isLarge   ? "clamp(333px, 63vw, 430px)"
    : expanded             ? "clamp(300px, 50vw, 466px)"
    :                        "clamp(200px, 36vw, 248px)";

  return (
    <>
      <style>{`
        @keyframes shimmer-slide {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes card-float {
          0%   { transform: translateY(0px)   rotate(0deg); }
          50%  { transform: translateY(-18px) rotate(0.6deg); }
          100% { transform: translateY(0px)   rotate(0deg); }
        }
        .card-eye:hover {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 38 38'%3E%3Cellipse cx='19' cy='19' rx='16' ry='9' fill='none' stroke='%23C9933A' stroke-width='1.8'/%3E%3Ccircle cx='19' cy='19' r='5.5' fill='none' stroke='%23C9933A' stroke-width='1.8'/%3E%3Ccircle cx='19' cy='19' r='2.2' fill='%23C9933A'/%3E%3C/svg%3E") 19 19, auto;
        }
      `}</style>

      <div
        className="w-full flex flex-col items-center"
        style={{ paddingTop, paddingBottom: "80px", paddingLeft: "clamp(24px, 5vw, 40px)", paddingRight: "clamp(24px, 5vw, 40px)", transition: "padding-top 750ms cubic-bezier(0.4, 0, 0.2, 1)", minHeight: "100vh" }}
      >
        {/* ── Card ── */}
        <div style={{ animation: isSettled ? "card-float 7.2s ease-in-out infinite" : "none", marginBottom: isLarge ? "0" : "clamp(24px, 4vh, 40px)", transition: "margin-bottom 700ms cubic-bezier(0.4, 0, 0.2, 1)", flexShrink: 0 }}>
          <div
            ref={cardRef}
            className={isSettled ? "card-eye" : ""}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => isSettled && setExpanded(!expanded)}
            style={{ width: cardW, height: cardH, perspective: "1200px", transition: "width 750ms cubic-bezier(0.4, 0, 0.2, 1), height 750ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: isSettled ? undefined : "default" }}
          >
            <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transform: cardTransform, transition: cardTransition }}>
              {/* Back face */}
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: isLarge ? "16px" : "12px", overflow: "hidden", border: "2px solid #C9933A", boxShadow: "0 20px 80px rgba(0,0,0,0.7)", transition: "border-radius 750ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
                <img src={imgCardBack} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
              </div>
              {/* Front face */}
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: isLarge ? "16px" : "12px", overflow: "hidden", border: "2px solid #C9933A", boxShadow: "0 20px 80px rgba(0,0,0,0.7), 0 0 40px rgba(201,147,58,0.2)", background: cardImage ? "transparent" : "linear-gradient(160deg, #2A2A3C 0%, #1E1E30 50%, #2A2A3C 100%)", display: cardImage ? "block" : "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: cardImage ? "0" : "clamp(16px, 3vw, 28px)", transition: "border-radius 750ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
                {cardImage ? (
                  <img src={cardImage} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", userSelect: "none", pointerEvents: "none" }} draggable={false} />
                ) : (
                  <>
                    <span style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(18px, 3vw, 28px)", color: "#C9933A", letterSpacing: "0.15em" }}>{card.number}</span>
                    <div className="flex flex-col items-center gap-3">
                      <div style={{ width: "80%", height: "1px", background: "linear-gradient(90deg, transparent, #C9933A60, transparent)" }} />
                      <span className="animate-glow-pulse" style={{ color: "#C9933A", fontSize: "clamp(20px, 4vw, 32px)" }}>✦</span>
                      <div style={{ width: "80%", height: "1px", background: "linear-gradient(90deg, transparent, #C9933A60, transparent)" }} />
                    </div>
                    <span style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(14px, 2.5vw, 22px)", color: "#C9933A", textAlign: "center", letterSpacing: "0.12em" }}>{card.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Reflection content ── */}
        <div
          className="flex flex-col items-center w-full"
          style={{ maxWidth: "640px", gap: "clamp(28px, 4vh, 44px)", opacity: isContentVisible ? 1 : 0, transform: isContentVisible ? "translateY(0)" : "translateY(32px)", pointerEvents: isContentVisible ? "auto" : "none", transition: isContentVisible ? "opacity 900ms 350ms ease-out, transform 900ms 350ms ease-out" : "none" }}
        >
          {isReturnVisit && (
            <p className="reflection-return-note" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "13px", color: "#A09CC0", letterSpacing: "0.1em", textAlign: "center", fontStyle: "italic" }}>
              This is your card for today.
            </p>
          )}

          <div className="flex flex-col items-center gap-3">
            <h2 className="reflection-card-name" style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(22px, 4vw, 38px)", color: "#E8B96A", fontWeight: 400, letterSpacing: "0.06em", margin: 0, textAlign: "center" }}>
              {card.name}
            </h2>
            <div style={{ color: "#C9933A", fontSize: "13px", letterSpacing: "0.4em", opacity: 0.7 }}>✦ ✦ ✦</div>
          </div>

          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <span className="reflection-label-top" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", color: "#C9933A", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 500 }}>
              Today's reflection
            </span>
            <span className="reflection-label-date" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", color: "rgba(160,156,192)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 300 }}>
              {sign} · {formatTodayShort()}
            </span>
          </div>

          <div className="w-full text-center">
            {isLoadingReflection ? <Shimmer lines={4} /> : (
              <p className="reflection-text" style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(16px, 2.5vw, 21px)", color: "#F0EEF8", lineHeight: 1.9, fontStyle: "italic", fontWeight: 400, margin: 0 }}>
                {reflectionText}
              </p>
            )}
          </div>

          <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,147,58,0.3), transparent)" }} />

          <div className="w-full text-center">
            <span className="reflection-question-label" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", color: "#C9933A", letterSpacing: "0.22em", textTransform: "uppercase", display: "block", marginBottom: "10px", fontWeight: 500 }}>
              A question for you
            </span>
            {isLoadingReflection ? <Shimmer lines={2} /> : (
              <p className="reflection-question-text" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(240,238,248,0.75)", lineHeight: 1.85, fontStyle: "italic", fontWeight: 300, letterSpacing: "0.02em", margin: 0 }}>
                {questionText}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="reflection-footer-primary" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "13px", color: "#A09CC0", letterSpacing: "0.1em", textAlign: "center", fontWeight: 300, margin: 0 }}>
              Carry this with you today.
            </p>
            <p className="reflection-footer-secondary" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "13px", color: "rgba(160,156,192,0.38)", letterSpacing: "0.08em", textAlign: "center", fontWeight: 300, margin: 0 }}>
              {isReturnVisit ? "Come back tomorrow for a new reading 🌙" : "We'll be here again tomorrow. 🌙"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
