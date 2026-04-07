import Link from "next/link";
import Logo from "@/app/components/Logo";

const LENSES = [
  {
    name: "Style",
    icon: "✦",
    tagline: "The Clean Code lens",
    description:
      "Naming conventions, function length, DRY violations, and SOLID principles. Modern C++ idioms and const correctness.",
  },
  {
    name: "Functionality",
    icon: "◎",
    tagline: "The Logic lens",
    description:
      "Strict verification that the code does exactly what you described — every gap between intent and implementation is a defect.",
  },
  {
    name: "Bug",
    icon: "⬡",
    tagline: "The Safety lens",
    description:
      "Memory leaks, null pointer dereferences, use-after-free, RAII violations, race conditions, and undefined behavior.",
  },
  {
    name: "Security",
    icon: "◈",
    tagline: "The Vulnerability lens",
    description:
      "Buffer overflows, injection patterns, hardcoded secrets, cryptographic misuse, and unsafe C string functions.",
  },
  {
    name: "Consistency",
    icon: "⬟",
    tagline: "The Meta lens",
    description:
      "Reads all four reviews and resolves contradictions. When agents disagree, it picks the higher-priority finding and explains why.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "—",
    description: "For individuals exploring Lensora.",
    features: ["50 reviews / month", "All 5 agents", "JSON export", "Email support"],
    cta: "Start 7-day trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "—",
    description: "For developers who review code daily.",
    features: ["Unlimited reviews", "All 5 agents", "JSON export", "Priority support"],
    cta: "Start 7-day trial",
    highlighted: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="text-indigo-600" size={26} />
          <span className="text-lg font-bold text-gray-900 tracking-tight">Lensora</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm text-gray-500 hover:text-gray-800 transition">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-medium text-cyan-700 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          7-day free trial · No commitment
        </div>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          See your code
          <span className="text-indigo-600"> differently.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-500 leading-relaxed">
          Five specialized AI agents review your C++ code simultaneously —
          each looking through a different lens. One pass. Every angle covered.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            Start free trial
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition">
            See how it works →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-center text-gray-500 mb-14">
            Paste your code, describe what it should do, get a full multi-agent review in seconds.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Submit your code", body: "Paste your C++ code and a short explanation of what it's supposed to do." },
              { step: "2", title: "Five agents review in parallel", body: "Style, Functionality, Bug, and Security agents run simultaneously, each focused on their domain." },
              { step: "3", title: "Consistency resolves conflicts", body: "A meta-agent reads all four reviews, detects contradictions, and surfaces the most important findings." },
            ].map(({ step, title, body }) => (
              <div key={step} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 5 lenses */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Five lenses. One codebase.
          </h2>
          <p className="text-center text-gray-500 mb-14">
            Each agent is purpose-built for its domain — no generic review, no missed angles.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LENSES.map((lens) => (
              <div
                key={lens.name}
                className="rounded-xl border border-gray-200 p-6 flex flex-col gap-3 hover:border-indigo-200 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl text-indigo-600">{lens.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{lens.name} Agent</p>
                    <p className="text-xs text-cyan-600 font-medium">{lens.tagline}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{lens.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Simple pricing
          </h2>
          <p className="text-center text-gray-500 mb-14">
            Every plan starts with a 7-day free trial. Credit card required.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-8 flex flex-col gap-6 ${
                  plan.highlighted
                    ? "border-indigo-600 bg-white shadow-md"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlighted && (
                  <span className="self-start rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    Most popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>
                <ul className="flex flex-col gap-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-cyan-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-center transition ${
                    plan.highlighted
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 mt-auto">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="text-gray-400" size={18} />
            <span className="text-sm text-gray-400">Lensora</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/sign-in" className="hover:text-gray-600 transition">Sign in</Link>
            <Link href="/sign-up" className="hover:text-gray-600 transition">Sign up</Link>
            <Link href="#pricing" className="hover:text-gray-600 transition">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
