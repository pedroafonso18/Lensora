"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import CodeSubmissionForm from "@/app/components/CodeSubmissionForm";
import ReviewResults from "@/app/components/ReviewResults";
import Logo from "@/app/components/Logo";
import { ReviewRequest, ReviewResult } from "@/lib/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: ReviewResult }
  | { status: "error"; message: string };

export default function Home() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function handleSubmit(req: ReviewRequest) {
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

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
      setState({
        status: "error",
        message: "Network error — could not reach the server. Please try again.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="text-indigo-600" size={24} />
          <span className="text-lg font-bold text-gray-900">Lensora</span>
        </div>
        <UserButton />
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 flex flex-col gap-10">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">Submit Code for Review</h2>
          <CodeSubmissionForm
            onSubmit={handleSubmit}
            loading={state.status === "loading"}
          />
        </section>

        {/* Loading */}
        {state.status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-12 text-gray-500">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="text-sm">Running 5 agents in parallel… this may take a few seconds.</p>
          </div>
        )}

        {/* Error */}
        {state.status === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 flex items-start gap-3">
            <span className="mt-0.5 text-red-500 text-lg font-bold">✕</span>
            <div>
              <p className="font-semibold text-red-700 text-sm">Review failed</p>
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {state.status === "success" && (
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <ReviewResults result={state.result} />
          </section>
        )}
      </main>
    </div>
  );
}
