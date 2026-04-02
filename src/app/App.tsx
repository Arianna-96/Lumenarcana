import { useState, useCallback, useRef, useEffect } from "react";
import { Background } from "./components/Background";
import { ZodiacIcon } from "./components/ZodiacIcon";
import { HistoryOverlay } from "./components/HistoryOverlay";
import { SplashScreen } from "./components/screens/SplashScreen";
import { IntroScreen } from "./components/screens/IntroScreen";
import { BirthDateScreen } from "./components/screens/BirthDateScreen";
import { ZodiacRevealScreen } from "./components/screens/ZodiacRevealScreen";
import { TransitionDeckScreen } from "./components/screens/TransitionDeckScreen";
import { DeckScreen } from "./components/screens/DeckScreen";
import { CardReflectionScreen } from "./components/screens/CardReflectionScreen";
import { MAJOR_ARCANA, TarotCard, ApiTarotCard } from "./data/cards";
import { appendHistory, loadHistory } from "./data/history";
import { getPlaceholderReflection, getPlaceholderQuestion } from "./data/reflections";

type Screen =
  | "splash"
  | "intro"
  | "birthdate"
  | "zodiac-reveal"
  | "transition-deck"
  | "deck"
  | "card-reflection";

interface InitialAppState {
  screen: Screen;
  sign: string | null;
  card: TarotCard | null;
  isReturnVisit: boolean;
  showZodiacIcon: boolean;
}

function computeInitialState(): InitialAppState {
  const onboarded = localStorage.getItem("tarot_onboarded");
  const sign = localStorage.getItem("tarot_sign");
  const todayRaw = localStorage.getItem("tarot_today");
  const today = new Date().toDateString();

  if (!onboarded) {
    return {
      screen: "splash",
      sign: null,
      card: null,
      isReturnVisit: false,
      showZodiacIcon: false,
    };
  }

  if (todayRaw) {
    try {
      const reading = JSON.parse(todayRaw) as { date: string; cardId: number };
      if (reading.date === today) {
        const card = MAJOR_ARCANA.find((c) => c.id === reading.cardId) ?? MAJOR_ARCANA[0];
        return {
          screen: "card-reflection",
          sign,
          card,
          isReturnVisit: true,
          showZodiacIcon: true,
        };
      } else {
        localStorage.removeItem("tarot_today");
      }
    } catch {
      localStorage.removeItem("tarot_today");
    }
  }

  // Onboarded but no card today → show splash + welcome back flow
  return {
    screen: "splash",
    sign,
    card: null,
    isReturnVisit: false,
    showZodiacIcon: false,
  };
}

export default function App() {
  const [appState] = useState<InitialAppState>(computeInitialState);
  const [screen, setScreen] = useState<Screen>(appState.screen);
  const [visible, setVisible] = useState(true);
  const [zodiacSign, setZodiacSign] = useState<string | null>(appState.sign);
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(appState.card);
  const isReturnVisit = useRef(appState.isReturnVisit);
  const isReturningUser = useRef(appState.sign !== null && !appState.isReturnVisit);
  const [showZodiacIcon, setShowZodiacIcon] = useState(appState.showZodiacIcon);
  const [isChangingSign, setIsChangingSign] = useState(false);
  const changeSignReturnScreen = useRef<Screen>("deck");
  const [showHistory, setShowHistory] = useState(false);
  const [hasHistory, setHasHistory] = useState(() => loadHistory().length > 0);

  // ── External API state ───────────────────────────────────────────────────
  const [apiTarotCards, setApiTarotCards] = useState<ApiTarotCard[] | null>(null);
  const [horoscopeText, setHoroscopeText] = useState<string | null>(null);
  const [tarotLoading, setTarotLoading] = useState(true);
  const [horoscopeLoading, setHoroscopeLoading] = useState(appState.sign !== null);
  const apiTarotLoading = tarotLoading || horoscopeLoading;

  // Fetch Major Arcana card data once on mount
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    fetch("/api/tarot", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const d = data as { cards: ApiTarotCard[] };
        if (Array.isArray(d?.cards)) setApiTarotCards(d.cards);
      })
      .catch(() => {})
      .finally(() => { clearTimeout(timeout); setTarotLoading(false); });

    return () => { controller.abort(); clearTimeout(timeout); };
  }, []);

  // Fetch daily horoscope whenever we know the user's sign
  useEffect(() => {
    if (!zodiacSign) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    setHoroscopeLoading(true);

    fetch(`/api/horoscope?sign=${zodiacSign.toLowerCase()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const d = data as { data?: { horoscope_data?: string } };
        setHoroscopeText(d?.data?.horoscope ?? "");
      })
      .catch(() => setHoroscopeText(""))
      .finally(() => { clearTimeout(timeout); setHoroscopeLoading(false); });

    return () => { controller.abort(); clearTimeout(timeout); };
  }, [zodiacSign]);
  // ─────────────────────────────────────────────────────────────────────────

  const navigateTo = useCallback((next: Screen) => {
    setVisible(false);
    setTimeout(() => {
      setScreen(next);
      if (["transition-deck", "deck", "card-reflection"].includes(next)) {
        setShowZodiacIcon(true);
      }
      setVisible(true);
    }, 1200);
  }, []);

  const handleSplashComplete = useCallback(() => navigateTo("intro"), [navigateTo]);

  const handleIntroComplete = useCallback(() => {
    if (isReturningUser.current) {
      navigateTo("deck");
    } else {
      navigateTo("birthdate");
    }
  }, [navigateTo]);

  const handleBirthDateComplete = useCallback(
    (sign: string, _day: number, _month: number) => {
      localStorage.setItem("tarot_sign", sign);
      localStorage.setItem("tarot_onboarded", "true");
      if (isChangingSign) {
        localStorage.removeItem("tarot_today");
        setDrawnCard(null);
        setIsChangingSign(false);
        setHoroscopeText(null);
        setHoroscopeLoading(false);
      }
      setZodiacSign(sign);
      navigateTo("zodiac-reveal");
    },
    [navigateTo, isChangingSign]
  );

  const handleZodiacRevealComplete = useCallback(() => navigateTo("transition-deck"), [navigateTo]);
  const handleTransitionDeckComplete = useCallback(() => navigateTo("deck"), [navigateTo]);

  const handleCardPicked = useCallback(
    (card: TarotCard) => {
      setDrawnCard(card);
      if (zodiacSign && !isReturnVisit.current) {
        const today = new Date().toDateString();
        const entry = {
          date: today,
          cardId: card.id,
          cardName: card.name,
          cardNumber: card.number,
          reflection: getPlaceholderReflection(card.name, zodiacSign),
          question: getPlaceholderQuestion(card.name, zodiacSign),
        };
        localStorage.setItem("tarot_today", JSON.stringify({ date: today, cardId: card.id }));
        appendHistory(entry);
        setHasHistory(true);
      }
      navigateTo("card-reflection");
    },
    [navigateTo, zodiacSign]
  );

  const handleChangeSign = useCallback(() => {
    changeSignReturnScreen.current = screen;
    setIsChangingSign(true);
    navigateTo("birthdate");
  }, [screen, navigateTo]);

  const handleCancelChangeSign = useCallback(() => {
    setIsChangingSign(false);
    navigateTo(changeSignReturnScreen.current);
  }, [navigateTo]);

  const isReflection = screen === "card-reflection";
  const showArchiveIcon = hasHistory && showZodiacIcon && screen !== "birthdate";

  // ── Mouse sparkle trail ──────────────────────────────────────────────────
  useEffect(() => {
    const COLORS = ["#C9933A", "#E8B96A", "#D4A855", "#F5D68A", "#A67C35"];
    let lastSpawn = 0;

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn < 60) return;
      lastSpawn = now;

      const size = Math.random() * 5 + 3;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const half = size / 2;
      const jitter = () => (Math.random() - 0.5) * 16;

      const el = document.createElement("div");
      el.style.cssText = [
        "position:fixed",
        `left:${e.clientX + jitter() - half}px`,
        `top:${e.clientY + jitter() - half}px`,
        `width:${size}px`,
        `height:${size}px`,
        "pointer-events:none",
        "z-index:9999",
        "animation:sparkle-trail 600ms ease-out forwards",
      ].join(";");

      el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0 C10.45 6.2 13.8 9.55 20 10 C13.8 10.45 10.45 13.8 10 20 C9.55 13.8 6.2 10.45 0 10 C6.2 9.55 9.55 6.2 10 0 Z" fill="${color}"/>
      </svg>`;

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 640);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen onComplete={handleSplashComplete} />;
      case "intro":
        return (
          <IntroScreen
            onComplete={handleIntroComplete}
            isReturning={isReturningUser.current}
            sign={zodiacSign}
          />
        );
      case "birthdate":
        return <BirthDateScreen onComplete={handleBirthDateComplete} />;
      case "zodiac-reveal":
        return (
          <ZodiacRevealScreen
            sign={zodiacSign ?? "Leo"}
            onComplete={handleZodiacRevealComplete}
          />
        );
      case "transition-deck":
        return <TransitionDeckScreen onComplete={handleTransitionDeckComplete} />;
      case "deck":
        return <DeckScreen onCardPicked={handleCardPicked} availableCards={MAJOR_ARCANA} />;
      case "card-reflection":
        return drawnCard ? (
          <CardReflectionScreen
            card={drawnCard}
            sign={zodiacSign ?? ""}
            isReturnVisit={isReturnVisit.current}
            apiTarotCards={apiTarotCards}
            horoscopeText={horoscopeText}
            apiTarotLoading={apiTarotLoading}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div
      className="relative w-full"
      style={{ minHeight: "100vh", fontFamily: "'Raleway', sans-serif" }}
    >
      <Background />

      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{ padding: "16px 24px", pointerEvents: "none" }}
      >
        <div style={{ pointerEvents: "auto" }}>
          {isChangingSign && screen === "birthdate" ? (
            <button
              onClick={handleCancelChangeSign}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#C9933A",
                fontSize: "28px",
                lineHeight: 1,
                padding: "4px",
                opacity: 0.85,
                transition: "opacity 150ms",
              }}
              title="Cancel"
              aria-label="Cancel sign change"
            >
              ✕
            </button>
          ) : (
            zodiacSign && (
              <ZodiacIcon
                sign={zodiacSign}
                visible={showZodiacIcon}
                onClick={handleChangeSign}
              />
            )
          )}
        </div>

        <div style={{ pointerEvents: "auto" }}>
          <button
            onClick={() => setShowHistory(true)}
            className="screen-fade"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              opacity: showArchiveIcon ? 1 : 0,
              pointerEvents: showArchiveIcon ? "auto" : "none",
              transition: "opacity 600ms ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Open reading archive"
            title="Past readings"
          >
            <span
              style={{
                fontSize: "28px",
                color: "#C9933A",
                lineHeight: 1,
                fontFamily: "serif",
                display: "block",
              }}
            >
              ✦
            </span>
          </button>
        </div>
      </div>

      {showHistory && <HistoryOverlay onClose={() => setShowHistory(false)} />}

      <div
        className={`relative z-10 w-full screen-fade ${
          isReflection
            ? "flex flex-col items-center"
            : "min-h-screen flex items-center justify-center"
        }`}
        style={{ opacity: visible ? 1 : 0, minHeight: "100vh" }}
      >
        {renderScreen()}
      </div>
    </div>
  );
}
