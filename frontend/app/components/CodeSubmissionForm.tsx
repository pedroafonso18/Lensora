"use client";

import { useState } from "react";
import { ReviewRequest } from "@/lib/types";

const MAX_EXPLANATION_CHARS = 5000;
const MAX_CODE_BYTES = 1_048_576;

interface Props {
  onSubmit: (req: ReviewRequest) => void;
  loading: boolean;
}

export default function CodeSubmissionForm({ onSubmit, loading }: Props) {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const language = "cpp";

  const codeBytes = new TextEncoder().encode(code).length;
  const explanationChars = explanation.length;

  const codeError =
    codeBytes > MAX_CODE_BYTES
      ? `Code is too large (${(codeBytes / 1024).toFixed(1)} KB). Max is 1 MB.`
      : null;

  const explanationError =
    explanationChars > MAX_EXPLANATION_CHARS
      ? `Explanation is too long (${explanationChars} / ${MAX_EXPLANATION_CHARS} characters).`
      : null;

  const canSubmit =
    code.trim().length > 0 &&
    explanation.trim().length > 0 &&
    !codeError &&
    !explanationError &&
    !loading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ code, explanation, language });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Code */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono tracking-[0.12em] uppercase text-zinc-500">
            C++ Code
          </label>
          <span
            className={`text-xs font-mono ${
              codeBytes > MAX_CODE_BYTES * 0.8 ? "text-amber-400" : "text-zinc-600"
            }`}
          >
            {(codeBytes / 1024).toFixed(1)} KB / 1024 KB
          </span>
        </div>
        <textarea
          className={`h-72 rounded-lg border bg-zinc-950 p-4 font-mono text-sm text-zinc-200 resize-y focus:outline-none focus:ring-1 placeholder:text-zinc-700 transition-colors ${
            codeError
              ? "border-red-500/40 focus:ring-red-500/40"
              : "border-white/[0.08] focus:ring-indigo-500/40 focus:border-indigo-500/40"
          }`}
          placeholder="Paste your C++ code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
        {codeError && (
          <p className="text-xs text-red-400">{codeError}</p>
        )}
      </div>

      {/* Explanation */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono tracking-[0.12em] uppercase text-zinc-500">
            Explanation
          </label>
          <span
            className={`text-xs font-mono ${
              explanationChars > MAX_EXPLANATION_CHARS * 0.9
                ? "text-amber-400"
                : "text-zinc-600"
            }`}
          >
            {explanationChars} / {MAX_EXPLANATION_CHARS}
          </span>
        </div>
        <textarea
          className={`h-28 rounded-lg border bg-zinc-950 p-4 text-sm text-zinc-200 resize-y focus:outline-none focus:ring-1 placeholder:text-zinc-700 transition-colors ${
            explanationError
              ? "border-red-500/40 focus:ring-red-500/40"
              : "border-white/[0.08] focus:ring-indigo-500/40 focus:border-indigo-500/40"
          }`}
          placeholder="Describe what this code is supposed to do..."
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
        {explanationError && (
          <p className="text-xs text-red-400">{explanationError}</p>
        )}
      </div>

      {/* Language badge */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono tracking-[0.12em] uppercase text-zinc-500">
          Language
        </span>
        <span className="rounded border border-white/[0.08] px-2.5 py-1 text-xs font-mono text-zinc-400">
          C++
        </span>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Analyzing…" : "Analyze code →"}
      </button>
    </form>
  );
}
