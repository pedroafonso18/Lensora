"use client";

import { useEffect, useRef, useState } from "react";

const AGENTS = [
  {
    index: "01",
    name: "Style Agent",
    tagline: "The Clean Code lens",
    color: "#4f46e5",
    description:
      "Naming conventions, function length, DRY violations, and SOLID principles. Modern C++ idioms and const correctness.",
    finding: { line: 1, label: "Unclear naming", severity: "Medium" },
    code: [
      { text: "void proc(int* p, int n) {", highlight: true },
      { text: "    for(int i=0;i<n;i++)" },
      { text: "        p[i] *= 2;" },
      { text: "}" },
    ],
  },
  {
    index: "02",
    name: "Bug Agent",
    tagline: "The Safety lens",
    color: "#6366f1",
    description:
      "Memory leaks, null pointer dereferences, use-after-free, RAII violations, race conditions, and undefined behavior.",
    finding: { line: 3, label: "Dangling pointer returned", severity: "Critical" },
    code: [
      { text: "int* getBuffer() {" },
      { text: "    int arr[256] = {};" },
      { text: "    return arr;  // ← stack memory", highlight: true },
      { text: "}" },
    ],
  },
  {
    index: "03",
    name: "Security Agent",
    tagline: "The Vulnerability lens",
    color: "#818cf8",
    description:
      "Buffer overflows, injection patterns, hardcoded secrets, cryptographic misuse, and unsafe C string functions.",
    finding: { line: 2, label: "Unbounded strcpy", severity: "High" },
    code: [
      { text: "void handle(const char* input) {" },
      { text: "    char buf[64];", highlight: true },
      { text: "    strcpy(buf, input);  // ← no bounds", highlight: true },
      { text: "}" },
    ],
  },
  {
    index: "04",
    name: "Functionality Agent",
    tagline: "The Logic lens",
    color: "#22d3ee",
    description:
      "Strict verification that the code does exactly what you described — every gap between intent and implementation is a defect.",
    finding: { line: 3, label: "Integer division truncates result", severity: "High" },
    code: [
      { text: "double average(vector<int>& v) {" },
      { text: "    int sum = 0;" },
      { text: "    for (auto x : v) sum += x;" },
      { text: "    return sum / v.size();  // ← int ÷ int", highlight: true },
      { text: "}" },
    ],
  },
  {
    index: "05",
    name: "Consistency Agent",
    tagline: "The Meta lens",
    color: "#06b6d4",
    description:
      "Reads all four reviews and resolves contradictions. When agents disagree, it picks the higher-priority finding and explains why.",
    finding: { line: 4, label: "Unified recommendation applied", severity: "Info" },
    code: [
      { text: "// Bug:   \"avoid raw pointers\"" },
      { text: "// Style: \"prefer modern C++ idioms\"" },
      { text: "// → Same root cause — resolved:" },
      { text: "void process(std::span<int> data) {", highlight: true },
      { text: "    /* ... */" },
      { text: "}" },
    ],
  },
] as const;

const SEVERITY_COLOR: Record<string, string> = {
  Critical: "#ef4444",
  High:     "#f97316",
  Medium:   "#eab308",
  Low:      "#22c55e",
  Info:     "#06b6d4",
};

export default function ScrollLensSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [agentProgress, setAgentProgress] = useState(0);

  useEffect(() => {
    const handle = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const scrolledIn = Math.max(0, -rect.top);
      const raw = scrolledIn / scrollable; // 0 → 1
      const clamped = Math.min(1, Math.max(0, raw));

      const idx = Math.min(4, Math.floor(clamped * 5));
      const prog = (clamped * 5) % 1;

      setActiveIndex(idx);
      setAgentProgress(prog);
    };

    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const agent = AGENTS[activeIndex];

  return (
    <div
      ref={containerRef}
      /* 500vh total: 5 agents × 100vh each */
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Subtle top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

        {/* Background agent number — depth layer */}
        <div
          className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="text-[22vw] font-black leading-none tracking-tighter"
            style={{
              color: agent.color,
              opacity: 0.04,
              transition: "color 0.5s ease",
            }}
          >
            {agent.index}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center px-8 lg:px-20 max-w-7xl mx-auto w-full">
          {/* Agent panels — stacked, only active is visible */}
          <div className="relative w-full">
            {AGENTS.map((a, i) => {
              const isActive = i === activeIndex;
              const isPast = i < activeIndex;
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? "translateY(0)"
                      : isPast
                      ? "translateY(-32px)"
                      : "translateY(32px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  {/* Left: text */}
                  <div className="flex-1 flex flex-col gap-5">
                    {/* Counter */}
                    <p
                      className="text-xs font-mono tracking-[0.2em] uppercase"
                      style={{ color: a.color }}
                    >
                      {a.index} / 05 &mdash; {a.tagline}
                    </p>

                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                      {a.name}
                    </h2>

                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                      {a.description}
                    </p>

                    {/* Finding callout */}
                    <div
                      className="flex items-center gap-3 rounded-lg px-4 py-3 w-fit"
                      style={{
                        background: `${a.color}12`,
                        border: `1px solid ${a.color}30`,
                      }}
                    >
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{
                          background: `${SEVERITY_COLOR[a.finding.severity]}22`,
                          color: SEVERITY_COLOR[a.finding.severity],
                        }}
                      >
                        {a.finding.severity}
                      </span>
                      <span className="text-xs text-zinc-300 font-mono">
                        Line {a.finding.line} &mdash; {a.finding.label}
                      </span>
                    </div>
                  </div>

                  {/* Right: code block */}
                  <div className="flex-1 w-full lg:max-w-md">
                    <div
                      className="rounded-xl overflow-hidden border"
                      style={{ borderColor: `${a.color}22` }}
                    >
                      {/* Code toolbar */}
                      <div
                        className="flex items-center gap-2 px-4 py-2.5 border-b"
                        style={{
                          background: `${a.color}0a`,
                          borderColor: `${a.color}18`,
                        }}
                      >
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        </div>
                        <span className="ml-2 text-xs text-zinc-500 font-mono">
                          main.cpp
                        </span>
                      </div>
                      {/* Lines */}
                      <div className="bg-zinc-950/80 p-5 font-mono text-sm leading-7">
                        {a.code.map((line, li) => (
                          <div
                            key={li}
                            className="flex gap-4"
                            style={
                              "highlight" in line && line.highlight
                                ? {
                                    background: `${a.color}14`,
                                    borderLeft: `2px solid ${a.color}`,
                                    paddingLeft: "8px",
                                    marginLeft: "-8px",
                                    borderRadius: "0 4px 4px 0",
                                  }
                                : {}
                            }
                          >
                            <span className="text-zinc-600 w-5 shrink-0 text-right select-none">
                              {li + 1}
                            </span>
                            <span
                              style={{
                                color: "highlight" in line && line.highlight ? a.color : "#a1a1aa",
                              }}
                            >
                              {line.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div className="relative z-10 flex items-center justify-center gap-2 pb-10">
          {AGENTS.map((a, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === activeIndex ? 24 : 6,
                height: 6,
                background: i === activeIndex ? a.color : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* Scroll hint — only shown at start */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500"
          style={{ opacity: agentProgress < 0.3 && activeIndex === 0 ? 0.4 : 0 }}
          aria-hidden="true"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
            scroll
          </span>
          <div className="w-px h-6 bg-zinc-600" />
        </div>
      </div>
    </div>
  );
}
