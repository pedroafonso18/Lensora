"use client";

import { useState } from "react";
import { ReviewResult, Finding, Severity, ConsistencyReview } from "@/lib/types";

const TABS = ["Style", "Functionality", "Bug", "Security", "Consistency"] as const;
type Tab = (typeof TABS)[number];

const SEVERITY_STYLES: Record<Severity, { bg: string; text: string }> = {
  Info:     { bg: "bg-cyan-500/10  border border-cyan-500/20",   text: "text-cyan-400"   },
  Low:      { bg: "bg-emerald-500/10 border border-emerald-500/20", text: "text-emerald-400" },
  Medium:   { bg: "bg-yellow-500/10 border border-yellow-500/20", text: "text-yellow-400" },
  High:     { bg: "bg-orange-500/10 border border-orange-500/20", text: "text-orange-400" },
  Critical: { bg: "bg-red-500/10   border border-red-500/20",    text: "text-red-400"    },
};

function SeverityBadge({ severity }: { severity: Severity }) {
  const s = SEVERITY_STYLES[severity];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}
    >
      {severity}
    </span>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-zinc-900/50 p-4 flex flex-col gap-2.5">
      <div className="flex items-center gap-2 flex-wrap">
        <SeverityBadge severity={finding.severity} />
        {finding.line !== null && (
          <span className="text-xs font-mono text-zinc-600">Line {finding.line}</span>
        )}
        <span className="font-semibold text-zinc-100 text-sm">{finding.title}</span>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{finding.description}</p>
      {finding.recommendation && (
        <div className="rounded-lg border border-indigo-500/15 bg-indigo-500/5 px-3 py-2.5 text-xs text-indigo-300 leading-relaxed">
          <span className="font-semibold text-indigo-400">Recommendation — </span>
          {finding.recommendation}
        </div>
      )}
    </div>
  );
}

function AgentTab({ summary, findings }: { summary: string; findings: Finding[] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500 italic leading-relaxed">{summary}</p>
      {findings.length === 0 ? (
        <p className="text-sm text-emerald-400 font-medium">
          No findings — looks good.
        </p>
      ) : (
        findings.map((f, i) => <FindingCard key={i} finding={f} />)
      )}
    </div>
  );
}

function ConsistencyTab({ review }: { review: ConsistencyReview }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-zinc-500 italic leading-relaxed">{review.summary}</p>

      {review.conflicts.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono tracking-[0.12em] uppercase text-zinc-600">
            Conflicts
          </p>
          {review.conflicts.map((c, i) => (
            <div
              key={i}
              className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-zinc-100 text-sm">{c.title}</span>
                <span className="text-xs font-mono text-zinc-600">
                  {c.involved_agents.join(" · ")}
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{c.description}</p>
              <div className="rounded-lg border border-indigo-500/15 bg-indigo-500/5 px-3 py-2.5 text-xs text-indigo-300 leading-relaxed">
                <span className="font-semibold text-indigo-400">Resolution — </span>
                {c.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}

      {review.cross_agent_notes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono tracking-[0.12em] uppercase text-zinc-600">
            Cross-agent notes
          </p>
          <ul className="flex flex-col gap-2.5 mt-1">
            {review.cross_agent_notes.map((note, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-400 leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface Props {
  result: ReviewResult;
}

export default function ReviewResults({ result }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Style");

  const findingCounts: Record<string, number> = {
    Style:         result.style.findings.length,
    Functionality: result.functionality.findings.length,
    Bug:           result.bug.findings.length,
    Security:      result.security.findings.length,
    Consistency:   result.consistency.conflicts.length,
  };

  function copyResults() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono tracking-[0.12em] uppercase text-zinc-600">
          Review Results
        </p>
        <button
          onClick={copyResults}
          className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors border border-white/[0.08] rounded px-2.5 py-1 hover:border-white/20"
        >
          Copy JSON
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/[0.06]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono tracking-wide border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {tab.toUpperCase()}
            {findingCounts[tab] > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  activeTab === tab
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-white/[0.05] text-zinc-600"
                }`}
              >
                {findingCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-32 pt-2">
        {activeTab === "Style" && (
          <AgentTab summary={result.style.summary} findings={result.style.findings} />
        )}
        {activeTab === "Functionality" && (
          <AgentTab
            summary={result.functionality.summary}
            findings={result.functionality.findings}
          />
        )}
        {activeTab === "Bug" && (
          <AgentTab summary={result.bug.summary} findings={result.bug.findings} />
        )}
        {activeTab === "Security" && (
          <AgentTab
            summary={result.security.summary}
            findings={result.security.findings}
          />
        )}
        {activeTab === "Consistency" && (
          <ConsistencyTab review={result.consistency} />
        )}
      </div>
    </div>
  );
}
