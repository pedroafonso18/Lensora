# Plan: Lensora Code Review SAAS Platform

## TL;DR
Build a code review SaaS platform where users upload C++ code with explanations, which gets analyzed by 5 specialized agents (Style, Functionality, Bug, Security, Consistency). The first 4 agents run in parallel, then a Consistency (Meta) Agent reviews their outputs for contradictions and conflicting recommendations. Authentication is handled by Clerk, payments by Stripe (Starter / Professional tiers, 7-day trial with CC). The MVP focuses on the Rust/Axum backend, a Next.js App Router frontend with a landing page and protected review app, and stateless operation. Phase 3 handles security hardening, Phase 4 testing and deployment.

---

## **PHASE 1: Backend Foundation & Agent Architecture** ✓

### Steps (Backend)
1. **Define Agent Framework Architecture** (`src/agents/mod.rs`) ✓
2. **Implement Style Agent** (`src/agents/style.rs`) ✓
3. **Implement Functionality Agent** (`src/agents/functionality.rs`) ✓
4. **Implement Bug Agent** (`src/agents/bug.rs`) ✓
5. **Implement Security Agent** (`src/agents/security.rs`) ✓
6. **Implement Consistency Agent** (`src/agents/consistency.rs`) ✓
7. **Create Review Orchestrator** (`src/agents/orchestrator.rs`) ✓
8. **Build HTTP API Layer** (`src/api/mod.rs`) ✓
9. **Implement Input Validation & Sanitization** (`src/security/validation.rs`) ✓
10. **Add Structured Logging** (`src/logging.rs`) ✓
11. **Update main.rs & Configuration** ✓

---

## **PHASE 2: Frontend & User Interface** ✓

### Steps (Frontend)
12. **Set up Next.js Project Structure** (`frontend/`) ✓
    - Next.js App Router, TypeScript, Tailwind CSS
    - TypeScript types matching Rust API responses (`frontend/lib/types.ts`)
    - Proxy API route hiding backend from browser (`frontend/app/api/review/route.ts`)

13. **Build Code Submission Form Component** (`frontend/app/components/CodeSubmissionForm.tsx`) ✓
    - Code textarea with byte counter, explanation textarea with char counter
    - Real-time validation feedback, language selector (C++ only)

14. **Build Results Display Component** (`frontend/app/components/ReviewResults.tsx`) ✓
    - Tab interface for 5 agents with finding counts per tab
    - Severity badges, line numbers, recommendations, copy-to-JSON

15. **Create Main Review Page** (`frontend/app/page.tsx`) ✓
    - State machine: idle → loading → success/error
    - Loading spinner, error messages, results display

16. **Add Error Handling & User Feedback** ✓
    - Network errors, backend errors, validation failures all handled with user-friendly messages

---

## **PHASE 2B: Visual Identity, Auth & Monetization**

### Overview
- **Auth**: Clerk (managed — no custom JWT/bcrypt needed)
- **Payments**: Stripe — Starter (rate-limited) and Professional (unlimited), 7-day trial with CC required
- **Routing**: `/` landing page, `/review` protected app, `/sign-in`, `/sign-up`, `/pricing`, `/account`
- **Clerk user metadata** stores the Stripe customer ID — no DB required for billing in this phase
- **Middleware** chain: Clerk auth check → active Stripe subscription check → allow or redirect

### Steps

17. **Define Visual Identity & Design System**
    - Color palette: Indigo primary (`#4F46E5`), Cyan accent (`#06B6D4`), neutral grays
    - Font: Geist (Next.js default) — clean, technical, modern
    - Logo: SVG lens/aperture motif (concentric rings with a focal point, evoking an optical lens)
    - Slogan: to be finalised — candidates: *"See your code differently"* / *"Five lenses. One codebase."* / *"Code review from every angle."*
    - Update `tailwind.config.ts` with design tokens
    - Update `globals.css` with base styles and CSS variables

18. **Build Landing Page** (`frontend/app/page.tsx`)
    - Replace current app home; move review app to `/review`
    - **Hero**: headline + slogan + primary CTA (Start free trial → `/sign-up`)
    - **How it works**: 5 agents presented as "5 lenses" — each lens explained with icon + description
    - **Why Lensora**: parallel execution, cross-agent consistency check, C++ specialisation
    - **Pricing**: Starter vs Professional cards with trial callout, links to `/sign-up`
    - **Footer**: minimal, links to sign in / sign up
    - Fully responsive (mobile-first)
    - Dependencies: Step 17 (visual identity)

19. **Integrate Clerk Auth** (`frontend/`)
    - Install `@clerk/nextjs`
    - Wrap root layout with `<ClerkProvider>`
    - Configure `middleware.ts` using `clerkMiddleware()` — protect `/review` and `/account`
    - Sign in page at `/sign-in` using Clerk's `<SignIn />` component
    - Sign up page at `/sign-up` using Clerk's `<SignUp />` component
    - User button in app header (shows avatar, sign out option)
    - Dependencies: Step 18 (routing restructure)

20. **Integrate Stripe Payments** (`frontend/app/api/stripe/`)
    - Install `stripe` (server) and `@stripe/stripe-js` (client)
    - Create Stripe products: **Starter** (rate-limited, e.g. 50 reviews/month) and **Professional** (unlimited)
    - Configure 7-day free trial with credit card required on both tiers
    - Checkout session endpoint (`/api/stripe/checkout`) — creates a Stripe Checkout session and redirects
    - Webhook handler (`/api/stripe/webhook`) — handles `customer.subscription.created`, `updated`, `deleted`; stores Stripe customer ID and subscription status in Clerk user metadata
    - Customer portal endpoint (`/api/stripe/portal`) — opens Stripe Customer Portal for self-service plan changes and cancellation
    - Dependencies: Step 19 (need Clerk user ID to attach to Stripe customer)

21. **Subscription Gate & Middleware** (`frontend/middleware.ts`)
    - Extend Clerk middleware to also verify active Stripe subscription (read from Clerk metadata)
    - Unauthenticated → redirect to `/sign-in`
    - Authenticated but no active subscription → redirect to `/pricing`
    - Active subscription (Starter or Professional) → allow through to `/review`
    - Dependencies: Steps 19-20

22. **Account & Billing Pages**
    - Account page (`/account`): display user info (from Clerk), current plan, trial status
    - Billing management: button that calls `/api/stripe/portal` to open Stripe Customer Portal
    - Show "Upgrade to Professional" prompt for Starter users
    - Dependencies: Steps 19-21

23. **Starter Tier Rate Limiting** *(requires DB — deferred to Phase 5)*
    - Track review count per user per billing period
    - Return `429` with remaining quota info when Starter limit is exceeded
    - Show usage counter in UI for Starter users
    - **Dependency**: Phase 5 database integration; skip until DB is available

**Parallel Execution**: Step 17 blocks nothing; Steps 18-19 can overlap; Step 20 depends on 19; Step 21 depends on 19-20; Step 22 depends on 19-21.

---

## **PHASE 3: Security Hardening**

> Note: User authentication is fully handled by Clerk (Phase 2B). This phase focuses on backend security, sandboxing, and audit logging.

### Steps

24. **Backend Auth Middleware** (`src/api/mod.rs`)
    - Verify Clerk session tokens on the `/api/review` endpoint
    - Extract user ID from token and attach to request context for logging
    - Return `401` for missing or invalid tokens
    - Dependencies: Phase 2B complete

25. **Add Rate Limiting** (`src/security/rate_limiting.rs`)
    - Per-user rate limiting for Starter tier (requires DB from Phase 5 for persistence)
    - In-memory counter acceptable for single-instance MVP
    - Return `429` with `Retry-After` header on limit exceeded
    - Dependencies: Auth middleware from Step 24

26. **Implement Agent Execution Timeout** 
    - Wrap each agent call with a `tokio::time::timeout` (e.g. 30s per agent)
    - Return a structured error if any agent times out
    - Prevent runaway LLM calls from blocking the server
    - Dependencies: Phase 1 complete

27. **Add Security Audit Logging** (`src/security/audit.rs`)
    - Log all review requests with user ID, code size, language, and timestamp
    - Log subscription tier at time of request
    - Log all `401`/`429` responses with user ID and reason
    - Dependencies: Auth middleware from Step 24

28. **Frontend Security Hardening**
    - Set `Content-Security-Policy` headers in `next.config.ts`
    - Ensure all API routes validate Clerk session server-side
    - Sanitize any rendered user content (code/explanation displayed back in UI)
    - Dependencies: Phase 2B complete

---

## **PHASE 4: Testing, Deployment & Monitoring**

### Steps

29. **Write Unit Tests** (`tests/agents/`, `tests/api/`)
    - Test each agent with sample C++ code (good and bad examples)
    - Test consistency agent conflict detection logic
    - Test orchestrator parallel + consolidation execution flow
    - Test input validation and error handling

30. **Write Integration Tests**
    - End-to-end tests for full review workflow
    - Test Clerk auth middleware (valid token, expired token, missing token)
    - Test Stripe webhook handler with mock events

31. **Set up CI/CD Pipeline** (`.github/workflows/`)
    - Run tests on push/PR
    - Lint Rust (clippy) and format (rustfmt)
    - Build and lint frontend (next build, eslint)
    - Build Docker images

32. **Create Deployment Configuration**
    - `Dockerfile` for Rust backend
    - `frontend/Dockerfile` for Next.js frontend
    - `docker-compose.yml` for local full-stack dev
    - Environment configuration for prod/staging/dev
    - Document all required env vars (Clerk keys, Stripe keys, API key)

---

## **PHASE 5: Future Enhancements** (Post-MVP)

- **Database Integration**: Persist reviews for user history, analytics, Starter usage tracking
- **Starter Rate Limiting**: Implement Step 23 once DB is available
- **GitHub OAuth**: Add GitHub login via Clerk OAuth (deferred from Phase 2B)
- **Git Integration**: Detect diff, automatically seed "old code" vs "new code" distinction
- **Multi-Language Support**: Add agents for JavaScript, Python, Rust, Go, Java
- **Advanced Features**: Autofix suggestions, team collaboration, review history
- **Webhook Integration**: GitHub/GitLab webhooks for CI/CD integration
- **Performance Optimization**: Caching, async processing queue, agent scaling

---

## **Relevant Files**

### Backend (`src/`)
- `src/main.rs` — Entry point, Axum router ✓
- `src/agents/mod.rs` — Agent framework and types ✓
- `src/agents/style.rs` — Style agent ✓
- `src/agents/functionality.rs` — Functionality agent ✓
- `src/agents/bug.rs` — Bug agent ✓
- `src/agents/security.rs` — Security agent ✓
- `src/agents/consistency.rs` — Consistency agent ✓
- `src/agents/orchestrator.rs` — Parallel orchestrator ✓
- `src/agents/claude.rs` — Shared Claude API client ✓
- `src/api/mod.rs` — HTTP API endpoints ✓
- `src/security/validation.rs` — Input validation ✓
- `src/security/rate_limiting.rs` — Rate limiting (Phase 3)
- `src/security/audit.rs` — Audit logging (Phase 3)
- `src/logging.rs` — Structured logging ✓

### Frontend (`frontend/`)
- `frontend/lib/types.ts` — TypeScript types ✓
- `frontend/app/page.tsx` — Landing page (Phase 2B)
- `frontend/app/review/page.tsx` — Review app (move from current page.tsx)
- `frontend/app/sign-in/page.tsx` — Clerk sign in
- `frontend/app/sign-up/page.tsx` — Clerk sign up
- `frontend/app/pricing/page.tsx` — Pricing page
- `frontend/app/account/page.tsx` — Account & billing
- `frontend/app/api/review/route.ts` — Backend proxy ✓
- `frontend/app/api/stripe/checkout/route.ts` — Stripe checkout
- `frontend/app/api/stripe/webhook/route.ts` — Stripe webhooks
- `frontend/app/api/stripe/portal/route.ts` — Stripe customer portal
- `frontend/app/components/CodeSubmissionForm.tsx` ✓
- `frontend/app/components/ReviewResults.tsx` ✓
- `frontend/middleware.ts` — Clerk + subscription gate

### Configuration
- `.env.example` — Backend env vars ✓
- `frontend/.env.local.example` — Frontend env vars (Clerk, Stripe keys)
- `docker-compose.yml` — Local full-stack dev (Phase 4)
- `Dockerfile` — Backend production build (Phase 4)
- `frontend/Dockerfile` — Frontend production build (Phase 4)
- `.github/workflows/ci.yml` — CI/CD pipeline (Phase 4)

---

## **Verification Steps**

### Phase 1 (Backend) ✓
1. `cargo test` passes
2. POST `/api/review` returns all 5 agent results
3. Oversized / invalid requests rejected with 400
4. Logs show agent execution times

### Phase 2 (Frontend) ✓
5. Submit code → results display in 5 tabs
6. Validation feedback shown in real time
7. Network/server errors display user-friendly messages

### Phase 2B (Identity, Auth & Monetization)
8. Landing page renders correctly on mobile and desktop
9. Sign up → Stripe checkout → active subscription stored in Clerk metadata
10. `/review` redirects to `/sign-in` when unauthenticated
11. `/review` redirects to `/pricing` when authenticated but not subscribed
12. Active subscriber can access `/review` and submit reviews
13. Stripe Customer Portal opens from `/account` and subscription changes are reflected

### Phase 3 (Security Hardening)
14. `/api/review` returns `401` with missing or invalid Clerk token
15. Agent timeout returns structured error after 30s
16. Audit logs capture user ID and subscription tier on every review request

### Phase 4 (Testing & Deployment)
17. All unit and integration tests pass; coverage > 70%
18. CI/CD pipeline triggers on push and passes
19. `docker-compose up` starts full stack locally without errors

---

## **Key Architecture Decisions**

1. **Agents as LLM-powered Rust functions** — all 5 agents call the Claude API; Consistency agent receives all 4 prior outputs and resolves conflicts.

2. **Stateless backend MVP** — no database; reviews computed on-the-fly. Phase 5 adds persistence.

3. **Parallel + Meta Execution** — Style, Functionality, Bug, and Security agents run concurrently (Tokio `try_join!`), then the Consistency agent evaluates conflicts.

4. **Clerk for auth** — managed solution handles user storage, sessions, and JWTs. No custom auth code in the backend for MVP; backend validates Clerk tokens in Phase 3.

5. **Stripe for payments** — Starter (rate-limited) and Professional (unlimited) tiers. 7-day trial with CC required. Stripe customer ID stored in Clerk user metadata — no DB needed for billing in MVP.

6. **Next.js as API proxy** — backend URL never exposed to the browser; all frontend-to-backend calls go through Next.js API routes.

7. **Ocular / lens visual identity** — indigo + cyan palette, aperture SVG logo, minimal clean aesthetic. Selling point: multiple specialized agents = multiple lenses on your code.

8. **C++ only MVP** — narrower scope for quality; multi-language support in Phase 5.

---

## **Critical Dependencies**

| Dependency | Why Critical |
|---|---|
| Phase 1 complete | Backend must be running for frontend integration |
| Clerk integration (Step 19) | Blocks subscription gate (Step 21) and Stripe customer creation (Step 20) |
| Stripe webhooks (Step 20) | Must be live before subscription gate is tested end-to-end |
| Middleware (Step 21) | Blocks protected routes from being testable |
| DB (Phase 5) | Blocks Starter rate limiting (Step 23) and review history |

---

## **Non-Blocking Parallelism**

- Visual identity (Step 17) can be defined independently of all other work
- Landing page (Step 18) can be built before Clerk/Stripe are wired in, using static CTAs
- Clerk and Stripe setup (Steps 19-20) can be done in parallel once routing is established
- Phase 3 security hardening can begin after Phase 2B auth is live
