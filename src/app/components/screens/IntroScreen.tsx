import { useEffect } from "react";

interface IntroScreenProps {
  onComplete: () => void;
  isReturning?: boolean;
  sign?: string | null;
}

export function IntroScreen({ onComplete, isReturning = false, sign }: IntroScreenProps) {
  useEffect(() => {
    const t = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center px-6 text-center gap-4">
      {isReturning ? (
        <>
          <p
            className="intro-title"
            style={{
              fontFamily: "'Italiana', serif",
              fontSize: "clamp(22px, 4vw, 38px)",
              color: "#F0EEF8",
              letterSpacing: "0.03em",
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: "800px",
              animation: "fade-in-up 1200ms ease-in-out forwards",
              margin: 0,
            }}
          >
            Welcome back, {sign}.
          </p>
          <p
            className="intro-subtitle"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "clamp(14px, 2vw, 18px)",
              color: "rgba(240,238,248,0.55)",
              letterSpacing: "0.08em",
              fontWeight: 300,
              animation: "fade-in-up 1200ms 400ms ease-in-out forwards",
              opacity: 0,
              margin: 0,
            }}
          >
            Today's card is waiting.
          </p>
        </>
      ) : (
        <p
          className="intro-title"
          style={{
            fontFamily: "'Italiana', serif",
            fontSize: "clamp(22px, 4vw, 38px)",
            color: "#F0EEF8",
            letterSpacing: "0.03em",
            fontWeight: 400,
            lineHeight: 1.4,
            maxWidth: "800px",
            animation: "fade-in-up 1200ms ease-in-out forwards",
            margin: 0,
          }}
        >
          The stars have been waiting for you.
        </p>
      )}
    </div>
  );
}
