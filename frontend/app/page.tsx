import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import ApertureHero from "@/app/components/ApertureHero";
import ScrollLensSection from "@/app/components/ScrollLensSection";
import ScrollReveal from "@/app/components/ScrollReveal";
import Logo from "@/app/components/Logo";

const PLANS = [
  {
    name: "Starter",
    description: "For individuals exploring Lensora.",
    features: ["50 reviews / month", "All 5 agents", "JSON export", "Email support"],
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For developers who review code daily.",
    features: ["Unlimited reviews", "All 5 agents", "JSON export", "Priority support"],
    highlighted: true,
  },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Upload",
    body: "Paste your C++ code and a plain-English explanation of what it's supposed to do.",
  },
  {
    n: "02",
    title: "Analyze",
    body: "Four agents run in parallel. Then the Consistency agent reviews all four outputs and resolves conflicts.",
  },
  {
    n: "03",
    title: "Review",
    body: "A structured report with findings, severity levels, and recommendations — one per agent.",
  },
];

const WHY = [
  {
    title: "Parallel execution",
    body: "Style, Bug, Security, and Functionality agents run concurrently. Results in seconds, not minutes.",
  },
  {
    title: "Cross-agent consistency",
    body: "A fifth meta-agent reads all four outputs and resolves conflicting recommendations before you ever see them.",
  },
  {
    title: "C++ specialised",
    body: "Every agent prompt is written specifically for C++. Not a generic linter. Not a wrapper. A specialist.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Fixed nav — unauthenticated */}
      <NavBar
        right={
          <>
            <Link
              href="/sign-in"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Start free trial
            </Link>
          </>
        }
      />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 px-8 lg:px-20 overflow-hidden">
        {/* Faint radial gradient top-left */}
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(79,70,229,0.08) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-8 py-24">
          {/* Left */}
          <div className="flex-1 flex flex-col gap-7">
            <p
              className="text-xs font-mono tracking-[0.2em] uppercase text-indigo-400"
              style={{ animation: "fade-up 0.5s ease-out both" }}
            >
              C++ Code Review Platform
            </p>

            <h1
              className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
              style={{ animation: "fade-up 0.55s ease-out 0.1s both" }}
            >
              See your code
              <br />
              <span className="text-indigo-400">differently.</span>
            </h1>

            <p
              className="text-lg text-zinc-400 leading-relaxed max-w-lg"
              style={{ animation: "fade-up 0.55s ease-out 0.2s both" }}
            >
              Five specialized agents. Parallel execution. One definitive review.
            </p>

            <div
              className="flex items-center gap-5 pt-2"
              style={{ animation: "fade-up 0.55s ease-out 0.3s both" }}
            >
              <Link
                href="/sign-up"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-950/50"
              >
                Start free trial →
              </Link>
              <Link
                href="/sign-in"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Right: animated aperture */}
          <div
            className="flex-1 flex justify-center lg:justify-end"
            style={{ animation: "fade-up 0.7s ease-out 0.15s both" }}
          >
            <ApertureHero />
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #09090b)",
          }}
          aria-hidden="true"
        />
      </section>

      {/* ── FIVE LENSES (SCROLL-LOCKED) ───────────────────────────── */}
      <ScrollLensSection />

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="px-8 lg:px-20 py-28 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-indigo-400 mb-4">
              How it works
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-16">
              Three steps.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
            {HOW_IT_WORKS.map(({ n, title, body }, i) => (
              <ScrollReveal key={n} delay={i * 100} className="relative">
                {/* Connector line between cards */}
                {i < 2 && (
                  <div className="hidden sm:block absolute top-4 left-full w-full h-px bg-white/[0.06] z-10" />
                )}
                <div className="pr-8 lg:pr-16">
                  <p className="text-xs font-mono text-zinc-600 mb-4">{n}</p>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY LENSORA ───────────────────────────────────────────── */}
      <section className="px-8 lg:px-20 py-28 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-16">
              Built for precision.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WHY.map(({ title, body }, i) => (
              <ScrollReveal key={title} delay={i * 90}>
                <div className="rounded-xl border border-white/[0.06] p-6 flex flex-col gap-3 hover:border-indigo-500/30 transition-colors duration-300 h-full">
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="pricing" className="px-8 lg:px-20 py-28 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
              Simple pricing.
            </h2>
            <p className="text-zinc-500 mb-14">
              Two tiers. No surprises. 7-day free trial on both.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLANS.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 100}>
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
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
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
                  <Link
                    href="/sign-up"
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-center transition-colors ${
                      plan.highlighted
                        ? "bg-indigo-600 text-white hover:bg-indigo-500"
                        : "border border-white/[0.12] text-zinc-300 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    Start 7-day trial
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <p className="text-center text-xs text-zinc-600 mt-6">
              Credit card required. Cancel anytime.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-8 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="text-zinc-600" size={18} />
            <span className="text-sm text-zinc-600">© 2026 Lensora</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-600">
            <Link href="/sign-in" className="hover:text-zinc-400 transition-colors">
              Sign in
            </Link>
            <Link href="/sign-up" className="hover:text-zinc-400 transition-colors">
              Sign up
            </Link>
            <Link href="#pricing" className="hover:text-zinc-400 transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
