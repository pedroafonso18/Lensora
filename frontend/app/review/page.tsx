"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import CodeSubmissionForm from "@/app/components/CodeSubmissionForm";
import ReviewResults from "@/app/components/ReviewResults";
import Logo from "@/app/components/Logo";
import { ReviewRequest, ReviewResult } from "@/lib/types";

type State =
  | { status: "idle" }
  | { status: "loading"; phase: "agents" | "consistency" }
  | { status: "success"; result: ReviewResult }
  | { status: "error"; message: string };

/** Aperture spinner — the 5 rings converging */
function ApertureSpinner() {
  const rings = [
    { r: 32, dur: 3.5, rev: false, op: 0.25 },
    { r: 24, dur: 2.8, rev: true,  op: 0.35 },
    { r: 17, dur: 2.2, rev: false, op: 0.50 },
    { r: 11, dur: 1.7, rev: true,  op: 0.70 },
    { r: 5,  dur: 1.2, rev: false, op: 1.00 },
  ];
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx={40}
          cy={40}
          r={ring.r}
          stroke="#4f46e5"
          strokeWidth={1.5}
          strokeOpacity={ring.op}
          strokeDasharray={i < 3 ? "8 5" : undefined}
          fill="none"
          style={{
            transformOrigin: "40px 40px",
            animation: `${ring.rev ? "spin-ring-rev" : "spin-ring"} ${ring.dur}s linear infinite`,
          }}
        />
      ))}
      <circle cx={40} cy={40} r={2.5} fill="#06b6d4" />
    </svg>
  );
}

export default function ReviewPage() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function handleSubmit(req: ReviewRequest) {
    setState({ status: "loading", phase: "agents" });

    // Simulate the phase switch after a short delay for UX
    const phaseTimer = setTimeout(() => {
      setState((s) => s.status === "loading" ? { status: "loading", phase: "consistency" } : s);
    }, 4000);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      clearTimeout(phaseTimer);
      const data = await res.json();

      if (!res.ok) {
        setState({
          status: "error",
          message: data.error ?? `Unexpected error (HTTP ${res.status}).`,
        });
        return;
      }

      setState({ status: "success", result: data as ReviewResult });
    } catch {
      clearTimeout(phaseTimer);
      setState({
        status: "error",
        message: "Network error — could not reach the server. Please try again.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo
            className="text-indigo-500 group-hover:text-indigo-400 transition-colors"
            size={24}
          />
          <span className="text-base font-bold tracking-tight text-white">Lensora</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/account"
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Account
          </Link>
          <UserButton />
        </div>
      </header>

      {/* Split layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left — submission form */}
        <div className="lg:w-[44%] border-b lg:border-b-0 lg:border-r border-white/[0.06] p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-mono tracking-[0.15em] uppercase text-zinc-600">
              Code Submission
            </p>
          </div>
          <CodeSubmissionForm
            onSubmit={handleSubmit}
            loading={state.status === "loading"}
          />
        </div>

        {/* Right — results */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Idle */}
          {state.status === "idle" && (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <div className="opacity-20">
                <svg width={56} height={56} viewBox="0 0 56 56" fill="none" aria-hidden="true">
                  <circle cx={28} cy={28} r={25} stroke="#4f46e5" strokeWidth={1.5} />
                  <circle cx={28} cy={28} r={16} stroke="#4f46e5" strokeWidth={1.5} />
                  <circle cx={28} cy={28} r={8} stroke="#4f46e5" strokeWidth={1.5} />
                  <circle cx={28} cy={28} r={2.5} fill="#06b6d4" />
                </svg>
              </div>
              <p className="text-sm text-zinc-700">
                Submit code to see results.
              </p>
            </div>
          )}

          {/* Loading */}
          {state.status === "loading" && (
            <div className="h-full flex flex-col items-center justify-center gap-6 text-center">
              <ApertureSpinner />
              <div className="flex flex-col gap-1">
                <p className="text-sm text-zinc-300 font-medium">
                  {state.phase === "agents"
                    ? "Running 4 agents in parallel…"
                    : "Running consistency check…"}
                </p>
                <p className="text-xs text-zinc-600">This may take a few seconds.</p>
              </div>
            </div>
          )}

          {/* Error */}
          {state.status === "error" && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 flex items-start gap-3">
              <span className="text-red-400 text-base font-bold shrink-0 mt-0.5">✕</span>
              <div>
                <p className="font-semibold text-red-300 text-sm">Review failed</p>
                <p className="text-sm text-red-400/80 mt-0.5">{state.message}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {state.status === "success" && (
            <ReviewResults result={state.result} />
          )}
        </div>
      </div>
    </div>
  );
}
