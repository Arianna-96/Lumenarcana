import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { loadHistory, type HistoryEntry } from "../data/history";
import { MAJOR_ARCANA } from "../data/cards";
import { CARD_IMAGES } from "../data/cardImages";
import imgCardBack from "../../assets/card-back.jpg";

type Tab = "readings" | "collection";

function formatDate(raw: string): string {
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return raw;
  }
}

interface GridCardProps {
  number: string;
  name: string;
  discovered: boolean;
  image?: string;
  onClick?: () => void;
}

function GridCard({ number, name, discovered, image, onClick }: GridCardProps) {
  const [hovered, setHovered] = useState(false);
  const isClickable = !!onClick && discovered;

  return (
    <div
      style={{ width: "100%", aspectRatio: "3 / 5", position: "relative" }}
      onClick={isClickable ? onClick : undefined}
    >
      {discovered ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "14px",
            overflow: "hidden",
            border: "1.5px solid #C9933A",
            background: "linear-gradient(160deg, #2A2A3C 0%, #1E1E30 50%, #2A2A3C 100%)",
            boxShadow: hovered && isClickable
              ? "0 0 28px rgba(201,147,58,0.45)"
              : "0 0 18px rgba(201,147,58,0.25)",
            cursor: isClickable ? "pointer" : "default",
            transform: hovered && isClickable ? "scale(1.04)" : "scale(1)",
            transition: "transform 180ms ease, box-shadow 180ms ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: image ? "0" : "10px 6px",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <>
              <span style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(9px, 1.3vw, 12px)", color: "#C9933A", letterSpacing: "0.1em" }}>
                {number}
              </span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", width: "100%" }}>
                <div style={{ width: "60%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,147,58,0.5), transparent)" }} />
                <span style={{ color: "#C9933A", fontSize: "10px", opacity: 0.65 }}>✦</span>
                <div style={{ width: "60%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,147,58,0.5), transparent)" }} />
              </div>
              <span style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(7px, 1vw, 9px)", color: "#C9933A", textAlign: "center", letterSpacing: "0.08em", lineHeight: 1.25 }}>
                {name}
              </span>
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1.5px solid rgba(201,147,58,0.10)",
          }}
        >
          <img
            src={imgCardBack}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",  borderRadius: "12px" }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(5, 3, 18, 0.62)",
            borderRadius: "12px",
          }} />
        </div>
      )}
    </div>
  );
}

interface CardModalProps {
  number: string;
  name: string;
  image?: string;
  onClose: () => void;
}

function CardModal({ number, name, image, onClose }: CardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTiltX(-(e.clientY - cy) * 0.025);
    setTiltY((e.clientX - cx) * 0.025);
    setMoving(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTiltX(0);
    setTiltY(0);
    setMoving(false);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fade-in-up 180ms ease-out forwards",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          perspective: "1000px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Card ── */}
        <div
          ref={cardRef}
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: moving ? "transform 80ms linear" : "transform 300ms ease-out",
            width: "clamp(200px, 38vw, 280px)",
            height: "clamp(333px, 63vw, 466px)",
            borderRadius: "12px",
            border: "2px solid #C9933A",
            overflow: "hidden",
            boxShadow: "0 12px 50px rgba(0,0,0,0.6), 0 0 30px rgba(201,147,58,0.2)",
            background: "linear-gradient(160deg, #2A2A3C 0%, #1E1E30 50%, #2A2A3C 100%)",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "clamp(16px, 2.5vw, 24px) clamp(12px, 2vw, 20px)",
            }}>
              <span style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(16px, 2.5vw, 22px)", color: "#C9933A", letterSpacing: "0.12em" }}>
                {number}
              </span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "100%" }}>
                <div style={{ width: "80%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,147,58,0.6), transparent)" }} />
                <span style={{ color: "#C9933A", fontSize: "clamp(20px, 3vw, 28px)", opacity: 0.65 }}>✦</span>
                <div style={{ width: "80%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,147,58,0.6), transparent)" }} />
              </div>
              <span style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(13px, 2vw, 18px)", color: "#C9933A", textAlign: "center", letterSpacing: "0.1em", lineHeight: 1.3 }}>
                {name}
              </span>
            </div>
          )}
        </div>

        {/* ── Nome sotto la carta, fuori ── */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <span style={{
            fontFamily: "'Italiana', serif",
            fontSize: "clamp(16px, 2.5vw, 24px)",
            color: "#E8B96A",
            letterSpacing: "0.1em",
          }}>
            {name}
          </span>
          <span style={{
            fontFamily: "'Italiana', serif",
            fontSize: "clamp(10px, 1.4vw, 16px)",
            color: "rgba(201,147,58,0.55)",
            letterSpacing: "0.18em",
          }}>
            {number}
          </span>
        </div>

        {/* ── Close button ── */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "-11px",
            right: "-11px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "rgba(28, 28, 44, 0.95)",
            border: "1px solid rgba(201,147,58,0.45)",
            color: "#C9933A",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
          aria-label="Close"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

function ReadingsTab({ entries }: { entries: HistoryEntry[] }) {
  const sorted = [...entries].reverse();

  if (sorted.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "18px", paddingTop: "20vh" }}>
        <span style={{ color: "#C9933A", fontSize: "22px", opacity: 0.25, letterSpacing: "0.45em" }}>✦ ✦ ✦</span>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(14px, 2.5vw, 17px)", color: "rgba(240,238,248,0.32)", textAlign: "center", fontStyle: "italic", fontWeight: 300, margin: 0 }}>
          Your readings will appear here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(36px, 5.5vh, 54px)" }}>
      {sorted.map((entry, i) => (
        <div
          key={`${entry.date}-${entry.cardId}-${i}`}
          style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "640px", width: "100%", margin: "0 auto" }}
        >
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "#C9933A", letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.58 }}>
            {formatDate(entry.date)}
          </span>

          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(20px, 3.2vw, 30px)", color: "#E8B96A", fontWeight: 400, letterSpacing: "0.05em" }}>
              {entry.cardName}
            </span>
            <span style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(12px, 1.6vw, 15px)", color: "rgba(201,147,58,0.5)", letterSpacing: "0.18em" }}>
              {entry.cardNumber}
            </span>
          </div>

          <p style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(15px, 2.3vw, 18px)", color: "#F0EEF8", lineHeight: 1.92, fontStyle: "italic", fontWeight: 400, margin: 0 }}>
            {entry.reflection}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "12px", color: "#C9933A", letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.68 }}>
              A question for you
            </span>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(13px, 1.8vw, 16px)", color: "rgba(240,238,248,0.42)", lineHeight: 1.85, fontStyle: "italic", fontWeight: 300, letterSpacing: "0.02em", margin: 0 }}>
              {entry.question}
            </p>
          </div>

          {i < sorted.length - 1 && (
            <div style={{ marginTop: "10px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,147,58,0.14), transparent)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function CollectionTab({ discoveredIds }: { discoveredIds: Set<number> }) {
  const count = discoveredIds.size;
  const [expandedCard, setExpandedCard] = useState<{ number: string; name: string; image?: string } | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(18px, 3vh, 28px)" }}>
      {expandedCard && (
        <CardModal
          number={expandedCard.number}
          name={expandedCard.name}
          image={expandedCard.image}
          onClose={() => setExpandedCard(null)}
        />
      )}

      <style>{`
        .arcana-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(8px, 1.8vw, 14px);
        }
        @media (min-width: 480px)  { .arcana-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 640px)  { .arcana-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 820px)  { .arcana-grid { grid-template-columns: repeat(5, 1fr); } }
      `}</style>

      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", color: "#A09CC0", letterSpacing: "0.22em", textAlign: "center", fontWeight: 300, margin: 0, textTransform: "uppercase" }}>
        {count} of 22 arcana discovered
      </p>

      <div className="arcana-grid">
        {MAJOR_ARCANA.map((card) => {
          const isDiscovered = discoveredIds.has(card.id);
          const image = isDiscovered ? CARD_IMAGES[card.id] : undefined;
          return (
            <GridCard
              key={card.id}
              number={card.number}
              name={card.name}
              discovered={isDiscovered}
              image={image}
              onClick={isDiscovered ? () => setExpandedCard({ number: card.number, name: card.name, image }) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

export function HistoryOverlay({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("readings");
  const entries = loadHistory();
  const discoveredIds = new Set(entries.map((e) => e.cardId));

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const tabBtn = (t: Tab, label: string) => {
    const active = tab === t;
    return (
      <button
        onClick={() => setTab(t)}
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: "12px",
          color: active ? "#C9933A" : "rgba(160,156,192,0.4)",
          letterSpacing: "0.28em",
          textTransform: "uppercase" as const,
          fontWeight: active ? 500 : 300,
          background: "none",
          border: "none",
          borderBottom: active ? "1px solid rgba(201,147,58,0.55)" : "1px solid transparent",
          cursor: "pointer",
          padding: "0 2px 10px",
          transition: "color 200ms, border-color 200ms",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(13, 11, 42, 0.95)",
        backdropFilter: "blur(18px)",
        display: "flex",
        flexDirection: "column",
        animation: "fade-in-up 320ms ease-out forwards",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(22px, 4vh, 40px) clamp(20px, 6vw, 56px) 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px", color: "#C9933A", lineHeight: 1, fontFamily: "serif" }}>☽</span>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "10px", color: "#C9933A", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.72 }}>
            Lumen Arcana
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#C9933A", opacity: 0.6, padding: "4px", display: "flex", alignItems: "center", transition: "opacity 150ms" }}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ display: "flex", gap: "clamp(22px, 4vw, 40px)", padding: "clamp(16px, 2.8vh, 26px) clamp(20px, 6vw, 56px) 0", borderBottom: "1px solid rgba(201,147,58,0.1)", flexShrink: 0 }}>
        {tabBtn("readings", "Readings")}
        {tabBtn("collection", "Collection")}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "clamp(22px, 3.5vh, 38px) clamp(20px, 6vw, 56px) clamp(48px, 8vh, 72px)" }}>
        {tab === "readings" ? (
          <ReadingsTab entries={entries} />
        ) : (
          <CollectionTab discoveredIds={discoveredIds} />
        )}
      </div>
    </div>
  );
}
