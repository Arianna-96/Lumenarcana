import { useEffect } from "react";

interface TransitionDeckScreenProps {
  onComplete: () => void;
}

export function TransitionDeckScreen({ onComplete }: TransitionDeckScreenProps) {
  useEffect(() => {
    const t = setTimeout(() => onComplete(), 3500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ animation: "fade-in-up 1200ms ease-in-out forwards" }}
    >
      <p
        style={{
          fontFamily: "'Italiana', serif",
          fontSize: "clamp(24px, 4.5vw, 40px)",
          color: "#F0EEF8",
          fontWeight: 400,
          letterSpacing: "0.03em",
          lineHeight:"0.8",
          margin: 0,
        }}
      >
        Your arcana is ready.
      </p>
      <p
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: "clamp(13px, 2vw, 18px)",
          color: "#A09CC0",
          fontWeight: 300,
          letterSpacing: "0.06em",
          margin: 0,
        }}
      >
        Take a breath. The cards will wait.
      </p>

      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "12px",
          color: "#FFFFFF",
          fontSize: "12px",
          opacity: 0.7,
          animation: "twinkle 3s ease-in-out infinite",
        }}
      >
        ✦ ✦ ✦
        
      </div>
    </div>
  );
}