"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/app/components/Logo";
import ScrollReveal from "@/app/components/ScrollReveal";

const PLANS = [
  {
    name: "Starter",
    description: "For individuals exploring Lensora.",
    features: ["50 reviews / month", "All 5 agents", "JSON export", "Email support"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For developers who review code daily.",
    features: ["Unlimited reviews", "All 5 agents", "JSON export", "Priority support"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    highlighted: true,
  },
];

const FAQ = [
  {
    q: "What happens after the trial?",
    a: "You're charged for the selected plan. Cancel before the trial ends and you won't be charged.",
  },
  {
    q: "What counts as a review?",
    a: "One submission of code through the review form. Each submission triggers all five agents.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes, at any time via the Stripe Customer Portal in your account page.",
  },
  {
    q: "Is C++ the only supported language?",
    a: "For now, yes. More languages are planned for a future release.",
  },
];

async function startCheckout(priceId: string) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-medium text-zinc-200">{q}</span>
        <span
          className="text-zinc-600 shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0" }}
      >
        <p className="text-sm text-zinc-500 leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-8 py-4 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo
            className="text-indigo-500 group-hover:text-indigo-400 transition-colors"
            size={24}
          />
          <span className="text-base font-bold tracking-tight text-white">Lensora</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-8 py-20">
        {/* Heading */}
        <div className="text-center mb-16 max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Simple pricing.
          </h1>
          <p className="text-zinc-500">
            Two tiers. No surprises. 7-day free trial on both.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full mb-6">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 80}>
              <div
                className={`rounded-xl border p-8 flex flex-col gap-6 h-full transition-colors duration-300 ${
                  plan.highlighted
                    ? "border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-500/60"
                    : "border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {plan.highlighted && (
                  <span className="self-start rounded-full bg-indigo-600/20 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-400">
                    Most popular
                  </span>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-zinc-400"
                    >
                      <span className="text-cyan-500 text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => plan.priceId && startCheckout(plan.priceId)}
                  disabled={!plan.priceId}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    plan.highlighted
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "border border-white/[0.12] text-zinc-300 hover:border-white/30 hover:text-white"
                  }`}
                >
                  Start 7-day trial
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <p className="text-xs text-zinc-600 mb-20">
          Credit card required. Cancel anytime.
        </p>

        {/* FAQ */}
        <ScrollReveal className="w-full max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-2">
            Frequently asked questions
          </h2>
          <div className="mt-4">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
