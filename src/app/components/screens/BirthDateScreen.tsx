import {
  useRef,
  useState,
  useEffect,
  KeyboardEvent,
} from "react";
import { getZodiacSign } from "../../data/zodiac";

interface BirthDateScreenProps {
  onComplete: (
    sign: string,
    day: number,
    month: number,
  ) => void;
}

export function BirthDateScreen({
  onComplete,
}: BirthDateScreenProps) {
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [ready, setReady] = useState(false);

  const d1Ref = useRef<HTMLInputElement>(null);
  const d2Ref = useRef<HTMLInputElement>(null);
  const m1Ref = useRef<HTMLInputElement>(null);
  const m2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    d1Ref.current?.focus();
  }, []);

  // Auto-advance when all 4 digits filled
  useEffect(() => {
    if (d1 && d2 && m1 && m2 && !ready) {
      const day = parseInt(d1 + d2);
      const month = parseInt(m1 + m2);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        setReady(true);
        setTimeout(() => {
          const sign = getZodiacSign(day, month);
          onComplete(sign, day, month);
        }, 500);
      }
    }
  }, [d1, d2, m1, m2, ready, onComplete]);

  const handleDigit =
    (
      setter: (v: string) => void,
      nextRef?: React.RefObject<HTMLInputElement | null>,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, "").slice(-1);
      setter(v);
      if (v && nextRef?.current) {
        nextRef.current.focus();
      }
    };

  const handleKeyDown =
    (
      setter: (v: string) => void,
      currentVal: string,
      prevRef?: React.RefObject<HTMLInputElement | null>,
    ) =>
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "Backspace" &&
        !currentVal &&
        prevRef?.current
      ) {
        prevRef.current.focus();
      }
    };

  const inputStyle: React.CSSProperties = {
    width: "60px",
    height: "80px",
    background: "rgba(0,0,0,0.32)",
    backdropFilter: "blur(2px)",
    border: "0.8px solid #C9933A55",
    borderRadius: "8px",
    textAlign: "center",
    color: "#F0EEF8",
    fontFamily: "'Italiana', serif",
    fontSize: "36px",
    fontWeight: 400,
    outline: "none",
    caretColor: "rgba(255,255,255,0.7)",
    transition: "border-color 200ms",
    MozAppearance: "textfield",
  };

  const inputFocusStyle = `
    input[type=text]::-webkit-inner-spin-button,
    input[type=text]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    .digit-input::placeholder {
      color: rgba(255,255,255,0.4);
      font-family: 'Italiana', serif;
      font-style: normal;
      font-size: 36px;
    }
    .digit-input:focus {
      border-color: #C9933A !important;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
    }
  `;

  return (
    <div
      className="flex flex-col items-center justify-center gap-8 px-6 text-center"
      style={{
        animation: "fade-in-up 1200ms ease-in-out forwards",
      }}
    >
      <style>{inputFocusStyle}</style>

      <div className="flex flex-col items-center gap-3">
        <h2
          style={{
            fontFamily: "'Italiana', serif",
            fontSize: "clamp(28px, 5vw, 44px)",
            color: "#e1e1e1",
            fontWeight: 400,
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          What's your date of birth?
        </h2>
        <p
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "clamp(14px, 2vw, 20px)",
            color: "#e1e1e1",
            fontWeight: 300,
            letterSpacing: "0.01em",
            margin: 0,
          }}
        >
          Your star sign adds a layer of meaning to every card
          you draw.
        </p>
      </div>

      {/* Date inputs */}
      <div className="flex items-center gap-3">
        {/* Day */}
        <input
          ref={d1Ref}
          type="text"
          inputMode="numeric"
          value={d1}
          onChange={handleDigit(setD1, d2Ref)}
          onKeyDown={handleKeyDown(setD1, d1)}
          className="digit-input"
          style={inputStyle}
          maxLength={1}
          placeholder="d"
        />
        <input
          ref={d2Ref}
          type="text"
          inputMode="numeric"
          value={d2}
          onChange={handleDigit(setD2, m1Ref)}
          onKeyDown={handleKeyDown(setD2, d2, d1Ref)}
          className="digit-input"
          style={inputStyle}
          maxLength={1}
          placeholder="d"
        />

        {/* Separator — plain white star, no glow */}
        <span
          style={{
            color: "white",
            fontSize: "20px",
            fontFamily: "sans-serif",
            lineHeight: 1,
            opacity: 0.9,
            userSelect: "none",
          }}
        >
          ✦
        </span>

        {/* Month */}
        <input
          ref={m1Ref}
          type="text"
          inputMode="numeric"
          value={m1}
          onChange={handleDigit(setM1, m2Ref)}
          onKeyDown={handleKeyDown(setM1, m1, d2Ref)}
          className="digit-input"
          style={inputStyle}
          maxLength={1}
          placeholder="m"
        />
        <input
          ref={m2Ref}
          type="text"
          inputMode="numeric"
          value={m2}
          onChange={handleDigit(setM2)}
          onKeyDown={handleKeyDown(setM2, m2, m1Ref)}
          className="digit-input"
          style={inputStyle}
          maxLength={1}
          placeholder="m"
        />
      </div>

      {/* Ready indicator */}
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 300ms",
          color: "rgba(255,255,255,0.7)",
          fontSize: "12px",
          animation: ready
            ? "twinkle 0.8s ease-in-out infinite"
            : "none",
        }}
      >
        ✦ ✦ ✦
      </div>
    </div>
  );
}