import { useEffect } from "react";

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  useEffect(() => {
    // Stays for 2s after fade in (800ms), total ~3s then auto-advance
    const t = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center px-6 text-center">
      <p
        style={{
          fontFamily: "'Italiana', serif",
          fontSize: "clamp(22px, 4vw, 38px)",
          color: "#F0EEF8",
          letterSpacing: "0.03em",
          fontWeight: 400,
          lineHeight: 1.4,
          maxWidth: "800px",
          animation: "fade-in-up 1200ms ease-in-out forwards",
        }}
      >
        The stars have been waiting for you.
      </p>
    </div>
  );
}