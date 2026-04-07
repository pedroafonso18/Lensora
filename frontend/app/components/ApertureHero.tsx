"use client";

import { useEffect, useRef } from "react";

/**
 * Five concentric rings representing the five agents.
 * Each ring rotates at a different speed. On scroll, rings drift apart.
 * Uses two nested <g> elements per ring so CSS rotation and JS translation
 * don't fight over the same `transform` property.
 */

const RINGS = [
  { r: 158, dur: 90,  rev: false, sw: 1,   op: 0.12, color: "#4f46e5", dashes: "28 18 8 18" },
  { r: 122, dur: 65,  rev: true,  sw: 1,   op: 0.22, color: "#4f46e5", dashes: "18 12 6 12" },
  { r: 88,  dur: 44,  rev: false, sw: 1.5, op: 0.35, color: "#6366f1", dashes: undefined     },
  { r: 57,  dur: 30,  rev: true,  sw: 1.5, op: 0.55, color: "#818cf8", dashes: undefined     },
  { r: 28,  dur: 18,  rev: false, sw: 2,   op: 0.85, color: "#06b6d4", dashes: undefined     },
] as const;

const CX = 190;
const CY = 190;

export default function ApertureHero() {
  // Outer <g> refs — these receive scroll-driven translation via SVG transform attr
  const outerRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const handle = () => {
      const sy = window.scrollY;
      outerRefs.current.forEach((g, i) => {
        if (!g) return;
        // Index 2 (middle ring) stays fixed; outer/inner rings drift away
        const factor = (i - 2) * 0.13;
        const dx = factor * sy * (i % 2 === 0 ? 1 : -0.8);
        const dy = factor * sy * 0.38;
        g.setAttribute("transform", `translate(${dx.toFixed(2)},${dy.toFixed(2)})`);
      });
    };

    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Background radial glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 380,
          height: 380,
          background:
            "radial-gradient(circle at center, rgba(79,70,229,0.18) 0%, transparent 68%)",
          animation: "glow-pulse 4s ease-in-out infinite",
        }}
      />

      <svg
        width={380}
        height={380}
        viewBox="0 0 380 380"
        fill="none"
        aria-hidden="true"
      >
        {RINGS.map((ring, i) => (
          <g
            key={i}
            ref={(el) => {
              outerRefs.current[i] = el;
            }}
          >
            {/* Inner g: CSS rotation — origin at SVG circle centre */}
            <g
              style={{
                transformOrigin: `${CX}px ${CY}px`,
                animation: `${ring.rev ? "spin-ring-rev" : "spin-ring"} ${ring.dur}s linear infinite`,
              }}
            >
              <circle
                cx={CX}
                cy={CY}
                r={ring.r}
                stroke={ring.color}
                strokeWidth={ring.sw}
                strokeOpacity={ring.op}
                strokeDasharray={ring.dashes}
                fill="none"
              />
            </g>
          </g>
        ))}

        {/* Cardinal focus marks */}
        {(
          [
            [CX, 14, CX, 36],
            [CX, 344, CX, 366],
            [14, CY, 36, CY],
            [344, CY, 366, CY],
          ] as [number, number, number, number][]
        ).map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
        ))}

        {/* Focal dot */}
        <circle cx={CX} cy={CY} r={3.5} fill="#06b6d4" />
        <circle
          cx={CX}
          cy={CY}
          r={8}
          stroke="#06b6d4"
          strokeWidth={1}
          strokeOpacity={0.3}
          fill="none"
        />
      </svg>
    </div>
  );
}
