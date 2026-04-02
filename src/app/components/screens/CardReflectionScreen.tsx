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
  horoscopeText?: any; // Accetta l'oggetto dall'api horoscope
  apiTarotLoading?: boolean;
}

// Funzione helper per estrarre solo il testo dell'oroscopo
function extractHoroscopeText(data: any): string {
  if (!data) return "";
  // Se è l'oggetto che hai postato: { data: { horoscope: "..." } }
  if (data.data?.horoscope) return data.data.horoscope;
  // Se è già una stringa
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return parsed.data?.horoscope || parsed.horoscope || data;
    } catch {
      return data;
    }
  }
  return "";
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
    // Se i dati base dei tarocchi stanno caricando, aspettiamo
    if (apiTarotLoading) return;

    const today = new Date().toDateString();
    
    // 1. Controllo cache locale per non chiamare Groq inutilmente
    try {
      const cached = localStorage.getItem("tarot_today");
      if (cached) {
        const parsed = JSON.parse(cached);
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
    
    // ESTRAZIONE TESTO PULITO
    const cleanHoroscope = extractHoroscopeText(horoscopeText);

    // Chiamata all'API Groq (reflection.ts)
    fetch("/api/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        sign, 
        horoscope: cleanHoroscope, 
        cardName: card.name, 
        cardMeaning 
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.reflection && data.question) {
          setGroqResult(data);
          // Aggiorna cache
          try {
            const existing = localStorage.getItem("tarot_today");
            const parsed = existing ? JSON.parse(existing) : { date: today, cardId: card.id };
            localStorage.setItem("tarot_today", JSON.stringify({ ...parsed, ...data }));
          } catch {}
          updateHistoryEntry(today, data);
        }
      })
      .catch((err) => console.error("Reflection Error:", err))
      .finally(() => {
        if (!cancelled) setGroqLoading(false);
      });

    return () => { cancelled = true; };
  }, [apiTarotLoading, card, sign, apiTarotCards, horoscopeText]);

  // Gestione animazioni flip carta
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
  const cardImage        = CARD_IMAGES[card.id] ?? null;
  const isLoading        = apiTarotLoading || groqLoading;
  
  const reflectionText = groqResult?.reflection ?? getPlaceholderReflection(card.name, sign);
  const questionText   = groqResult?.question   ?? getPlaceholderQuestion(card.name, sign);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !isSettled || expanded) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTiltX(-(e.clientY - (rect.top  + rect.height / 2)) * 0.025);
    setTiltY( (e.clientX - (rect.left + rect.width  / 2)) * 0.025);
  }, [isSettled, expanded]);

  const cardTransform = !flipped ? "rotate(-8deg) rotateY(0deg)" : isSettled ? `rotate(-5deg) rotateX(${tiltX}deg) rotateY(${180 + tiltY}deg)` : "rotate(-8deg) rotateY(180deg)";
  const cardW = isLarge ? "clamp(200px, 38vw, 260px)" : expanded ? "clamp(180px, 30vw, 280px)" : "clamp(120px, 22vw, 150px)";
  const cardH = isLarge ? "clamp(333px, 63vw, 430px)" : expanded ? "clamp(300px, 50vw, 466px)" : "clamp(200px, 36vw, 248px)";

  return (
    <>
      <style>{`
        @keyframes shimmer-slide { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes card-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
      `}</style>

      <div className="w-full flex flex-col items-center" style={{ minHeight: "100vh", paddingBottom: "100px", paddingTop: isLarge ? "15vh" : "8vh", transition: "padding 0.7s" }}>
        
        {/* Carta */}
        <div 
          ref={cardRef}
          onClick={() => isSettled && setExpanded(!expanded)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setTiltX(0); setTiltY(0); }}
          style={{ 
            width: cardW, height: cardH, perspective: "1200px", 
            animation: isSettled ? "card-float 6s ease-in-out infinite" : "none",
            transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            marginBottom: isLarge ? "0" : "40px"
          }}
        >
          <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transform: cardTransform, transition: "transform 0.8s" }}>
            {/* Retro */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "12px", overflow: "hidden", border: "2px solid #C9933A" }}>
              <img src={imgCardBack} alt="" className="w-full h-full object-cover" />
            </div>
            {/* Fronte */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "12px", overflow: "hidden", border: "2px solid #C9933A", background: "#1E1E30" }}>
              {cardImage && <img src={cardImage} alt={card.name} className="w-full h-full object-cover" />}
            </div>
          </div>
        </div>

        {/* Contenuto Testuale */}
        <div 
          className="flex flex-col items-center w-full px-6" 
          style={{ maxWidth: "600px", opacity: isContentVisible ? 1 : 0, transform: isContentVisible ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s 0.4s" }}
        >
          <h2 style={{ fontFamily: "'Italiana', serif", fontSize: "32px", color: "#E8B96A", marginBottom: "8px" }}>{card.name}</h2>
          <p style={{ fontSize: "10px", color: "#C9933A", letterSpacing: "0.2em", textTransform: "uppercase" }}>{sign} • {formatTodayShort()}</p>

          <div className="w-full mt-8 text-center">
            {isLoading ? <Shimmer lines={4} /> : (
              <p style={{ fontFamily: "'Italiana', serif", fontSize: "19px", color: "#F0EEF8", lineHeight: "1.8", fontStyle: "italic" }}>
                "{reflectionText}"
              </p>
            )}
          </div>

          <hr style={{ width: "60px", border: "0.5px solid rgba(201,147,58,0.3)", margin: "30px 0" }} />

          <div className="w-full text-center">
            <span style={{ fontSize: "10px", color: "#C9933A", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>A question for you</span>
            {isLoading ? <Shimmer lines={2} /> : (
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "16px", color: "rgba(160,156,192,0.9)", lineHeight: "1.6" }}>
                {questionText}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
