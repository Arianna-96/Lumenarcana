import { useEffect, useRef } from "react";
import svgPaths from "../../imports/svg-kfcetp19nf";
import imgNoiseTexture from "../../assets/noise-texture.png";
import imgNoiseTexture1 from "../../assets/noise-texture-2.png";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  isSpark: boolean;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
    isSpark: Math.random() < 0.12,
  }));
}

const STARS = generateStars(120);

export function Background() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ background: "#05040F", zIndex: 0 }}
    >
      {/* Deep base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, #080620 0%, #05040F 70%)",
        }}
      />

      {/* Animated blob 1 — muted purple */}
      <div
        className="absolute animate-blob-1"
        style={{
          width: "70vw",
          height: "60vh",
          top: "-10%",
          left: "-10%",
          background:
            "radial-gradient(ellipse at center, #1c1060 0%, #0e0830 45%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(90px)",
          opacity: 0.7,
          willChange: "transform",
        }}
      />

      {/* Animated blob 2 — muted indigo */}
      <div
        className="absolute animate-blob-2"
        style={{
          width: "60vw",
          height: "55vh",
          top: "20%",
          right: "-15%",
          background:
            "radial-gradient(ellipse at center, #122480 0%, #090f40 45%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(110px)",
          opacity: 0.6,
          willChange: "transform",
        }}
      />

      {/* Animated blob 3 — muted violet */}
      <div
        className="absolute animate-blob-3"
        style={{
          width: "50vw",
          height: "50vh",
          bottom: "-5%",
          left: "20%",
          background:
            "radial-gradient(ellipse at center, #2a1a7a 0%, #130855 45%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(100px)",
          opacity: 0.55,
          willChange: "transform",
        }}
      />

      {/* Figma SVG background curves */}
      <div className="absolute inset-0" style={{ opacity: 0.25 }}>
        {/* Top horizontal sweep */}
        <div className="absolute" style={{ top: "-5%", left: "-20%", width: "140%", height: "40%" }}>
          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3274 651">
            <g filter="url(#bg_filter1)">
              <path d={svgPaths.p20bde080} stroke="#250391" strokeLinecap="round" strokeWidth="34" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="651" id="bg_filter1" width="3274" x="0" y="-1.90735e-06">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="46" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Bottom horizontal sweep */}
        <div className="absolute" style={{ bottom: "-5%", left: "-20%", width: "140%", height: "30%" }}>
          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3274 440">
            <g filter="url(#bg_filter2)">
              <path d={svgPaths.p5283c00} stroke="#250391" strokeLinecap="round" strokeWidth="34" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="440" id="bg_filter2" width="3274" x="0" y="1.90735e-06">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="46" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* Dark semi-transparent overlay — tones down all colour layers */}
    

      {/* Noise texture overlay — reduced */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url('${imgNoiseTexture}')`,
          backgroundSize: "2048px 2048px",
          opacity: 0.18,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `url('${imgNoiseTexture1}')`,
          backgroundSize: "2048px 2048px",
          opacity: 0.07,
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0">
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationName: "twinkle",
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              ["--star-min" as string]: `${star.opacity * 0.2}`,
              ["--star-max" as string]: `${star.opacity}`,
            }}
          >
            {star.isSpark ? (
              <span
                style={{
                  display: "block",
                  color: "#6B8AFF",
                  fontSize: `${star.size * 4 + 4}px`,
                  lineHeight: 1,
                  opacity: star.opacity,
                }}
              >
                ✦
              </span>
            ) : (
              <div
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  borderRadius: "50%",
                  background: Math.random() > 0.5 ? "#6B8AFF" : "#F0EEF8",
                  opacity: star.opacity,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}