"use client";

import Link from "next/link";
import Logo from "@/app/components/Logo";

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

async function startCheckout(priceId: string) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="text-indigo-600" size={24} />
          <span className="text-lg font-bold text-gray-900">Lensora</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3 text-center">
          Choose your plan
        </h1>
        <p className="text-gray-500 mb-12 text-center">
          Every plan starts with a 7-day free trial. Credit card required.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl w-full">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 bg-white flex flex-col gap-6 ${
                plan.highlighted ? "border-indigo-600 shadow-md" : "border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <span className="self-start rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Most popular
                </span>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-cyan-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => plan.priceId && startCheckout(plan.priceId)}
                disabled={!plan.priceId}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.highlighted
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Start 7-day trial
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
