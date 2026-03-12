import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

function Sparkle({
  size,
  color = "#E8B96A",
}: {
  size: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d="M10 0 C10.45 6.2 13.8 9.55 20 10 C13.8 10.45 10.45 13.8 10 20 C9.55 13.8 6.2 10.45 0 10 C6.2 9.55 9.55 6.2 10 0 Z"
        fill={color}
      />
    </svg>
  );
}

export function SplashScreen({
  onComplete,
}: SplashScreenProps) {
  const [phase, setPhase] = useState<
    "name-in" | "name-up" | "subtitle-in" | "done"
  >("name-in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("name-up"), 1500);
    const t2 = setTimeout(() => setPhase("subtitle-in"), 2500);
    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className="max-sm:px-6"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
      }}
    >
      {/* ── Title row ── */}
      <div
        style={{
          opacity: phase === "name-in" ? 0 : 1,
          transform:
            phase === "name-up" ||
            phase === "subtitle-in" ||
            phase === "done"
              ? "translateY(-16px)"
              : "translateY(0)",
          transition:
            phase === "name-in"
              ? "opacity 1000ms ease-in-out"
              : "opacity 1000ms ease-in-out, transform 800ms ease-in-out",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-16px",
            bottom: "-4px",
            opacity: 0.85,
          }}
        >
          <Sparkle size={10} color="#E8B96A" />
        </div>

        <h1
          style={{
            fontFamily: "'Italiana', serif",
            fontSize: "clamp(38px, 6vw, 56px)",
            color: "#E8B96A",
            letterSpacing: "0.04em",
            margin: 0,
            fontWeight: 400,
            lineHeight:0.8,
            whiteSpace: "nowrap",
          }}
        >
          Lumen Arcana
        </h1>

        <div
          style={{
            position: "absolute",
            right: "-22px",
            top: "-8px",
            opacity: 0.95,
          }}
        >
          <Sparkle size={18} color="#E8B96A" />
        </div>

        <div
          style={{
            position: "absolute",
            right: "-6px",
            top: "-18px",
            opacity: 0.7,
          }}
        >
          <Sparkle size={9} color="#E8B96A" />
        </div>
      </div>

      {/* ── Subtitle ── */}
      <p
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: "18px",
          color: "rgba(255, 255, 255, 0.65)",
          letterSpacing: "0.03em",
          opacity:
            phase === "subtitle-in" || phase === "done" ? 1 : 0,
          transition: "opacity 700ms ease-in-out",
          margin: 0,
          fontWeight: 300,
          textAlign: "center",
          lineHeight: 1.4,
          width: "0",
          minWidth: "100%",
        }}
      >
        A quiet ritual for those who want to look inward.
      </p>
    </div>
  );
}
