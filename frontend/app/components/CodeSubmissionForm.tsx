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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Code */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            C++ Code
          </label>
          <span
            className={`text-xs ${
              codeBytes > MAX_CODE_BYTES * 0.8
                ? "text-amber-500"
                : "text-gray-400"
            }`}
          >
            {(codeBytes / 1024).toFixed(1)} KB / 1024 KB
          </span>
        </div>
        <textarea
          className={`h-64 rounded-lg border bg-gray-50 p-3 font-mono text-sm text-gray-900 resize-y focus:outline-none focus:ring-2 ${
            codeError
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-indigo-300"
          }`}
          placeholder="Paste your C++ code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
        {codeError && (
          <p className="text-xs text-red-500">{codeError}</p>
        )}
      </div>

      {/* Explanation */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            Explanation
          </label>
          <span
            className={`text-xs ${
              explanationChars > MAX_EXPLANATION_CHARS * 0.9
                ? "text-amber-500"
                : "text-gray-400"
            }`}
          >
            {explanationChars} / {MAX_EXPLANATION_CHARS}
          </span>
        </div>
        <textarea
          className={`h-32 rounded-lg border bg-gray-50 p-3 text-sm text-gray-900 resize-y focus:outline-none focus:ring-2 ${
            explanationError
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-indigo-300"
          }`}
          placeholder="Describe what this code is supposed to do..."
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
        {explanationError && (
          <p className="text-xs text-red-500">{explanationError}</p>
        )}
      </div>

      {/* Language selector — MVP: C++ only */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Language</label>
        <select
          className="w-40 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={language}
          disabled
        >
          <option value="cpp">C++</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="self-start rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Reviewing…" : "Review Code"}
      </button>
    </form>
  );
}
