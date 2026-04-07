# Lensora — Pages Design Specification

## Design Philosophy

Lensora is a dark-mode-first, technically precise SaaS. The aesthetic is **not bland** — it uses motion, depth, and kinetic scroll effects as core design elements, not decorations. Every page should feel like it was built for developers who notice when something is done well.

**Inspiration sources:**
- Minimal, purposeful layouts (no clutter, no filler sections)
- Parallax and scroll-driven animation (elements enter, transform, and respond to the user)
- Non-standard compositions — don't default to centered text + button on every section
- Bold typographic hierarchy — one thing dominates, everything else is subordinate

**Design tokens (already defined in PLAN.md):**
- Background: `#09090B` (near-black, zinc-950 equivalent)
- Primary: `#4F46E5` (indigo-600)
- Accent: `#06B6D4` (cyan-500)
- Text primary: `#FAFAFA`
- Text muted: `#71717A` (zinc-500)
- Font: Geist (sans for UI, mono for code)
- Border: `rgba(255,255,255,0.06)` — barely-visible, used for card edges

---

## Page 1 — Landing Page (`/`)

The most important page. It needs to immediately communicate: *what this is, why it's better, and what to do next.* Every section should feel intentional and kinetic.

### Section 1 — Hero

**Layout:** Full viewport height. Dark background. No distractions.

**Composition:**
- Left-aligned headline and CTA (not centered — centering is default, left is intentional)
- Right side: the Lensora aperture logo, large (300–400px), slowly rotating on its own axis as an idle animation. On scroll, it fractures into 5 separate lens rings that drift apart — one per agent (Style, Bug, Security, Functionality, Consistency). Each ring has a subtle glow in the brand palette.
- A faint radial gradient behind the logo — indigo bleeding into transparent — gives depth without adding content.

**Copy:**
- Eyebrow (small caps, muted): `C++ Code Review Platform`
- Headline (large, bold, ~5xl–7xl): `See your code differently.`
- Sub-headline (muted, ~lg): `Five specialized agents. Parallel execution. One definitive review.`
- CTA button: `Start free trial →` — filled indigo with a subtle hover glow
- Secondary link: `Sign in` — plain text, muted

**Animations:**
- On load: headline fades + slides up (stagger: eyebrow → headline → sub → CTA)
- The aperture logo starts rotating slowly (CSS animation, ~60s full rotation) the moment the page loads
- On first scroll: logo rings separate with a spring/ease-out motion (Framer Motion or GSAP)

---

### Section 2 — "Five Lenses" Scroll Experience

This is the centrepiece of the landing page. **Do not build this as a normal section.** This should be a scroll-locked (or scroll-driven) horizontal or vertical reveal where each of the 5 agents appears one by one as the user scrolls.

**Mechanic:** The section is pinned (`position: sticky` or ScrollTrigger pin). As the user scrolls through ~500vh of scroll distance, the 5 agents are revealed sequentially. The background agent counter (`01 / 05`) updates as each one appears.

**Per-agent reveal:**
- A large number (`01`, `02`...) in the background, muted and oversized (~20vw), acts as a depth layer
- Agent name in bold: `Style Agent`, `Bug Agent`, etc.
- One-sentence description, tight and precise
- A small icon or the relevant lens ring from the logo, glowing in the accent color
- A code snippet (short, 4–6 lines of C++) fades in below — showing what that agent catches. The specific finding is highlighted with a colored underline or glow.

**Transition between agents:** The previous agent's content slides out (left or up) while the next one slides in. The background number cross-fades.

**Exit:** Once all 5 are shown, the section unpins and the user continues scrolling normally into the next section.

---

### Section 3 — How It Works

**Layout:** Three columns, horizontal, with a faint vertical connector line between them.

**Copy + composition:**
- Column 1: `Upload` — paste your C++ code and a plain-English explanation of what it's supposed to do
- Column 2: `Analyze` — 4 agents run in parallel (show a small branching diagram — one input node → 4 output nodes). Then the Consistency agent reviews all 4 outputs.
- Column 3: `Review` — a structured report with findings, severity levels, and recommendations per agent

**Animation:** On scroll-enter, columns stagger in from below (100ms delay between each). The connector line draws itself left-to-right as the section enters viewport.

**Visual note:** Use thin monospace labels (`01 / Upload`, `02 / Analyze`, `03 / Review`) as eyebrows above each column. Keeps the technical feel.

---

### Section 4 — Why Lensora

**Layout:** Full-width, dark background. Headline left, 3 feature blocks below (can be a 3-column grid or a horizontal scroll on mobile).

**Headline:** `Built for precision.`

**Three blocks:**
- **Parallel execution** — "Style, Bug, Security, and Functionality agents run concurrently. Results in seconds, not minutes."
- **Cross-agent consistency** — "A fifth meta-agent reads all four outputs and resolves conflicting recommendations before you ever see them."
- **C++ specialised** — "Every agent prompt is written specifically for C++. Not a generic linter. Not a wrapper. A specialist."

**Visual:** Each block has a faint border (the barely-visible border from design tokens), no background fill, tight padding. On hover, border color shifts to indigo with a transition. No icons — the copy is the signal.

**Animation:** Blocks fade and translate up on scroll-enter, staggered.

---

### Section 5 — Pricing

Two cards, side by side. This section should feel clean and unambiguous.

**Cards:**

| | Starter | Professional |
|---|---|---|
| Price | `$X/mo` | `$Y/mo` |
| Reviews | 50/month | Unlimited |
| Agents | All 5 | All 5 |
| Trial | 7-day free | 7-day free |
| CTA | `Start free trial` | `Start free trial` |

**Visual:**
- Both cards have the same faint border
- Professional card has a subtle indigo glow on the border and an `Most popular` badge (small, top-right, filled indigo)
- 7-day trial note below both cards in muted text: `Credit card required. Cancel anytime.`

**Animation:** Cards slide up on scroll-enter. The Professional card's border glow pulses once on enter.

---

### Section 6 — Footer

Minimal. One row.

- Left: Lensora logo (small) + `© 2026 Lensora`
- Right: `Sign in` · `Sign up` · `Pricing`

No social links, no newsletter, no extra columns. Technical products don't need bloated footers.

---

## Page 2 — Review App (`/review`)

The working product. Protected by Clerk + Stripe middleware. This page is a tool, not a marketing page — the design should reflect that. Utility > decoration, but still polished.

**Layout:** Split view on desktop. Left column (~45%): code submission form. Right column (~55%): results display.

On mobile: stacked (form first, results below after submission).

### Left — Code Submission Form

- `Code` textarea: monospace font (Geist Mono), dark background, subtle border. Byte counter at bottom-right (`4,200 / 50,000 bytes`)
- `Explanation` textarea: regular font, smaller. Char counter at bottom-right.
- Language selector: locked to `C++` in MVP (rendered as a read-only badge, not a dropdown)
- Submit button: full-width, indigo, `Analyze code →`
- Validation errors appear inline below the relevant field, in red (`#EF4444`), small

### Right — Results Display

**Idle state:** A faint placeholder with the Lensora logo and "Submit code to see results." — centered, muted. Not an empty white void.

**Loading state:** A custom spinner matching the aperture logo — the 5 lens rings rotating and converging. Below it: `Running 4 agents in parallel…` updating to `Running consistency check…` once the first 4 complete.

**Results state:**
- 5 tabs across the top (Style / Bug / Security / Functionality / Consistency). Each tab shows a finding count badge.
- Active tab underline uses the accent cyan color.
- Per-finding card: severity badge (Critical / High / Medium / Low / Info) + line number + description + recommendation. Severity badge colors: red / orange / yellow / blue / zinc.
- `Copy as JSON` button top-right, ghost style.

---

## Page 3 — Sign In (`/sign-in`)

**Layout:** Centered card on a full-viewport dark background. The aperture logo sits above the card, small (60px), with a faint glow.

**Card content (Clerk `<SignIn />` component):**
- Styled to match dark theme — override Clerk's default white card with dark background, matching border
- Heading above the Clerk component (not inside): `Welcome back.`
- Below the card: `Don't have an account?` + `Sign up →` link

**Background:** Subtle radial gradient behind the card (indigo, very low opacity, ~5%). Not loud — just enough to break the flat black.

**Animation:** Card fades and scales up from ~95% on load (single entry animation, no scroll).

---

## Page 4 — Sign Up (`/sign-up`)

Same layout and animation as Sign In. Differences:

- Heading: `Start your free trial.`
- Sub-heading (muted, below heading): `7 days free. Credit card required. Cancel anytime.`
- Below the Clerk component: `Already have an account?` + `Sign in →` link

**Note:** After sign-up, Stripe checkout is triggered — the transition from sign-up to checkout should feel seamless (immediate redirect, no intermediate page).

---

## Page 5 — Pricing (`/pricing`)

A standalone pricing page for users who arrive directly (not via the landing page). Shares the pricing section design from the landing page but with more breathing room.

**Layout:**
- Top: headline + sub-headline, centered
  - Headline: `Simple pricing.`
  - Sub: `Two tiers. No surprises. 7-day free trial on both.`
- Below: the two pricing cards (same as landing page section 5)
- Below cards: FAQ — 3–4 common questions in an accordion. Muted border, no background on answers.

**FAQ content (example):**
- *What happens after the trial?* → You're charged for the selected plan. Cancel before the trial ends and you won't be charged.
- *What counts as a review?* → One submission of code through the review form.
- *Can I switch plans?* → Yes, via the Stripe Customer Portal in your account page.
- *Is C++ the only supported language?* → For now, yes. More languages are planned.

---

## Page 6 — Account (`/account`)

Dashboard-style. Authenticated users only.

**Layout:** Centered container, max-width ~640px. Not a full dashboard — it's a settings/billing page.

**Sections:**

### User Info
- Avatar (from Clerk) + name + email, displayed as a row
- Muted label: `Managed by Clerk`

### Current Plan
- Plan name (`Starter` or `Professional`) as a badge
- Trial status if active: `Trial ends April 14, 2026` — in amber, subtle
- For Starter: usage counter (deferred to Phase 5 when DB is available — omit until then)
- For Starter: `Upgrade to Professional →` link below the plan badge, in indigo

### Billing Management
- One button: `Manage billing →` — opens Stripe Customer Portal
- Ghost style (outline, not filled)
- Below: `You can change or cancel your plan from the Stripe portal.` in muted text

**No animations needed here** — this is a utility page. Keep it clean and functional.

---

## Cross-Page Patterns

### Navigation Bar
- Present on all pages except sign-in and sign-up
- Height: 64px, dark background with a `backdrop-blur` + faint bottom border
- Left: Lensora logo (SVG aperture + wordmark)
- Right: contextual
  - Unauthenticated: `Sign in` (ghost) + `Start free trial` (filled indigo)
  - Authenticated: `Review` link + Clerk `<UserButton />` (avatar dropdown)
- On scroll: nav picks up a slightly higher opacity background (smooth transition, not a hard jump)

### Error States
- All pages: network/auth errors shown as a toast notification (top-right, dark card, red left border)
- Form validation: inline, below the relevant field, never blocking the form itself

### Loading States
- Prefer skeleton loaders (faint animated shimmer) over spinners for content-heavy areas
- Use the aperture spinner only for the main review loading state (it's a brand moment)

### Motion principles
- **Enter animations:** translate-y (20px → 0) + opacity (0 → 1), ease-out, 300–400ms
- **Stagger delay:** 80–120ms between siblings
- **Scroll triggers:** fire when element is 15% into viewport
- **Parallax depth:** max 40px of displacement — enough to feel, not enough to distract
- **Spring physics:** use spring easing for the aperture logo ring separation (feels physical, not mechanical)
- Respect `prefers-reduced-motion` — disable all motion for users who opt out
