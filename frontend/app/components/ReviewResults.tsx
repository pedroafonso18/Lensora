"use client";

import { useState } from "react";
import {
  ReviewResult,
  Finding,
  Severity,
  ConsistencyReview,
} from "@/lib/types";

const TABS = ["Style", "Functionality", "Bug", "Security", "Consistency"] as const;
type Tab = (typeof TABS)[number];

const SEVERITY_STYLES: Record<Severity, string> = {
  Info: "bg-blue-100 text-blue-700",
  Low: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[severity]}`}
    >
      {severity}
    </span>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <SeverityBadge severity={finding.severity} />
        {finding.line !== null && (
          <span className="text-xs text-gray-400">Line {finding.line}</span>
        )}
        <span className="font-semibold text-gray-800 text-sm">{finding.title}</span>
      </div>
      <p className="text-sm text-gray-600">{finding.description}</p>
      {finding.recommendation && (
        <div className="rounded bg-indigo-50 px-3 py-2 text-xs text-indigo-800">
          <span className="font-semibold">Recommendation: </span>
          {finding.recommendation}
        </div>
      )}
    </div>
  );
}

function AgentTab({ summary, findings }: { summary: string; findings: Finding[] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600 italic">{summary}</p>
      {findings.length === 0 ? (
        <p className="text-sm text-green-600 font-medium">No findings — looks good.</p>
      ) : (
        findings.map((f, i) => <FindingCard key={i} finding={f} />)
      )}
    </div>
  );
}

function ConsistencyTab({ review }: { review: ConsistencyReview }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-600 italic">{review.summary}</p>

      {review.conflicts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-700">Conflicts</h3>
          {review.conflicts.map((c, i) => (
            <div key={i} className="rounded-lg border border-orange-200 bg-orange-50 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-800 text-sm">{c.title}</span>
                <span className="text-xs text-gray-400">
                  {c.involved_agents.join(" · ")}
                </span>
              </div>
              <p className="text-sm text-gray-600">{c.description}</p>
              <div className="rounded bg-indigo-50 px-3 py-2 text-xs text-indigo-800">
                <span className="font-semibold">Resolution: </span>
                {c.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}

      {review.cross_agent_notes.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-700">Cross-agent Notes</h3>
          <ul className="flex flex-col gap-2">
            {review.cross_agent_notes.map((note, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
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
    Style: result.style.findings.length,
    Functionality: result.functionality.findings.length,
    Bug: result.bug.findings.length,
    Security: result.security.findings.length,
    Consistency: result.consistency.conflicts.length,
  };

  function copyResults() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Review Results</h2>
        <button
          onClick={copyResults}
          className="text-xs text-indigo-600 hover:underline"
        >
          Copy JSON
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {findingCounts[tab] > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  activeTab === tab
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {findingCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-32">
        {activeTab === "Style" && (
          <AgentTab summary={result.style.summary} findings={result.style.findings} />
        )}
        {activeTab === "Functionality" && (
          <AgentTab summary={result.functionality.summary} findings={result.functionality.findings} />
        )}
        {activeTab === "Bug" && (
          <AgentTab summary={result.bug.summary} findings={result.bug.findings} />
        )}
        {activeTab === "Security" && (
          <AgentTab summary={result.security.summary} findings={result.security.findings} />
        )}
        {activeTab === "Consistency" && (
          <ConsistencyTab review={result.consistency} />
        )}
      </div>
    </div>
  );
}
