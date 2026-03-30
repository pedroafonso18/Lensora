# Plan: Lensora Code Review SAAS Platform

## TL;DR
Build a code review SAAS platform where users upload C++ code with explanations, which gets analyzed by 5 specialized agents (Style, Functionality, Bug, Security, Consistency). The first 4 agents run in parallel, then a Consistency (Meta) Agent reviews their outputs for contradictions and conflicting recommendations. The MVP focuses on internal agent functions within Rust/Axum backend, React frontend for code submission, and stateless operation. Security is architected from the start with authentication, input validation, and secure code handling. Phase 2 adds Git integration and multi-language support.

---

## **PHASE 1: Backend Foundation & Agent Architecture**

### Steps (Backend)
1. **Define Agent Framework Architecture**
   - Create `src/agents/mod.rs` module structure with traits for agent interface
   - Define `Agent` trait with `review()` method returning structured results
	- Create agent result types: `StyleReview`, `FunctionalityReview`, `BugReview`, `SecurityReview`, `ConsistencyReview`
   - Dependencies: None (foundational)

2. **Implement Style Agent** (`src/agents/style.rs`)
   - Review for Clean Code principles: naming conventions, function length, DRY violations
   - Review for SOLID principles (Single Responsibility, Open/Closed, Liskov, Interface, Dependency Inversion)
   - C++ specific: check include guards, header/implementation split, const correctness, modern C++ patterns
   - Dependencies: Design from Step 1

3. **Implement Functionality Agent** (`src/agents/functionality.rs`)
   - Parse C++ code structure (functions, classes, logic flow)
   - Check for side effects in pure functions
   - Validate logic against user-provided explanation
   - Verify return values and parameter handling
   - Dependencies: Design from Step 1

4. **Implement Bug Agent** (`src/agents/bug.rs`)
   - Check for common C++ pitfalls: memory leaks, null pointer dereferences, off-by-one errors
   - Detect uninitialized variables, use-after-free patterns
   - Check for race conditions in multi-threaded code
   - Detect resource acquisition issues (RAII violations)
   - Dependencies: Design from Step 1

5. **Implement Security Agent** (`src/agents/security.rs`)
   - Check for buffer overflows, format string vulnerabilities, SQL injection patterns
   - Validate input sanitization, output escaping
   - Check for hardcoded secrets, credentials, API keys
   - Review authentication/authorization logic if present
   - Check for cryptographic misuse patterns
   - Verify secure random number generation
   - Dependencies: Design from Step 1

6. **Implement Consistency Agent (Meta Agent)** (`src/agents/consistency.rs`)
	- Consume outputs from Style, Functionality, Bug, and Security agents
	- Detect contradictory findings (for example: one agent approves a pattern another flags as risky)
	- Detect conflicting severity assessments across agents
	- Produce a normalized "conflict report" with final cross-agent notes
	- Dependencies: Results from Steps 2-5

7. **Create Review Orchestrator** (`src/agents/orchestrator.rs`)
   - Single entry point: `run_parallel_reviews(code: &str, explanation: &str) -> ReviewResult`
	- Execute Style, Functionality, Bug, and Security agents in parallel using Tokio tasks
	- Execute Consistency Agent after the first 4 complete
	- Aggregate results with timestamps and execution metadata
	- Dependencies: Agents from Steps 2-6

8. **Build HTTP API Layer** (`src/api/mod.rs`)
   - Create `/api/review` POST endpoint
   - Request: `{ code: String, explanation: String, language: String }`
	- Response: `{ style: StyleReview, functionality: FunctionalityReview, bug: BugReview, security: SecurityReview, consistency: ConsistencyReview, timestamp: DateTime }`
   - Add CORS headers for Next.js frontend
	- Dependencies: Orchestrator from Step 7

9. **Implement Input Validation & Sanitization** (`src/security/validation.rs`)
   - Validate code size limits (prevent DoS: max 1MB per request)
   - Validate explanation length (max 5000 chars)
   - Whitelist allowed language identifiers (start with "cpp")
   - Sanitize all inputs before passing to agents
   - Log suspicious inputs
   - Dependencies: None (security first)

10. **Add Structured Logging** (`src/logging.rs`)
   - Log all review requests with code size, user origin
   - Log review results and any errors
   - Track agent execution times for performance monitoring
   - Dependencies: None (can be added anytime)

11. **Update main.rs & Configuration**
	- Load `.env` for configuration (port, log level, request size limits)
	- Initialize Axum router with `/api/review` endpoint
	- Add health check endpoint `/health`
	- Dependencies: All above (Step 11 integrates everything)

**Parallel Execution**: Steps 2-5 (core agents) run in parallel; Step 6 depends on completion of 2-5; Step 7 depends on 2-6; Steps 8-10 can run in parallel with previous but must complete before Step 11.

---

## **PHASE 2: Frontend & User Interface**

### Steps (Frontend)
12. **Set up Next.js Project Structure** (`pages/`)
	- Initialize Next.js 14+ with React
	- Configure API routes to proxy backend requests
	- Create TypeScript types matching Rust API responses
	- Dependencies: None (parallel to Phase 1 but needs Phase 1 API ready before integration)

13. **Build Code Submission Form Component** (`pages/components/CodeSubmissionForm.tsx`)
	- Input fields: code textarea, explanation textarea, language selector
	- Character counters for both inputs
	- Language selector (MVP: C++ only)
	- Real-time validation feedback
	- Dependencies: None (independent component)

14. **Build Results Display Component** (`pages/components/ReviewResults.tsx`)
	- Tab interface or accordion for 5 agents
	- Display findings in organized format: severity levels, line numbers (if available)
	- Show execution timestamps and agent execution times
	- Copy-to-clipboard functionality for results
	- Dependencies: None (independent component)

15. **Create Main Review Page** (`pages/review/index.tsx`)
	- Integrate CodeSubmissionForm and ReviewResults
	- Manage state for code, results, loading state, errors
	- Show loading spinner during review processing
	- Handle API calls to `/api/review`
	- Dependencies: Components from Steps 13-14

16. **Add Error Handling & User Feedback**
	- Display user-friendly error messages
	- Handle network errors, server errors, timeout scenarios
	- Show rate limiting feedback if applicable
	- Dependencies: Step 15

**Parallel Execution**: Steps 12-14 can run in parallel; Step 15 depends on all of them; Step 16 depends on Step 15.

---

## **PHASE 3: Security & Authentication Hardening** (from start, enhance as needed)

### Steps (Security Implementation)
17. **Implement Authentication** (`src/auth/mod.rs`)
	- Add JWT token issuance and validation
	- Create `/auth/signup` and `/auth/login` endpoints
	- Implement middleware to protect `/api/review` endpoint
	- Use bcrypt for password hashing (add `bcrypt` crate)
	- Dependencies: Phase 1 complete

18. **Add Rate Limiting** (`src/security/rate_limiting.rs`)
	- Implement per-user rate limiting (e.g., 100 reviews/hour)
	- Use token bucket algorithm or in-memory counter
	- Return 429 status on limit exceeded
	- Dependencies: Auth from Step 17

19. **Implement Code Sandboxing & Isolation**
	- Add file size limits and type validation
	- Implement timeout for agent execution (e.g., 30s max)
	- Consider temp storage for code during processing (clean up after)
	- Dependencies: Phase 1 complete

20. **Add Security Logging & Audit Trail** (`src/security/audit.rs`)
	- Log all authentication attempts (success/failure)
	- Log review requests with user ID and code metadata
	- Store audit logs (file-based initially, DB later)
	- Dependencies: Logging from Phase 1

21. **Frontend Authentication UI** (`pages/auth/`, `pages/components/LoginForm.tsx`)
	- Login/signup pages
	- JWT token storage in secure httpOnly cookies
	- Auth guard for protected pages
	- Dependencies: Auth endpoints from Step 17

---

## **PHASE 4: Testing, Deployment & Monitoring**

### Steps
22. **Write Unit Tests** (`tests/agents/`, `tests/api/`)
	- Test each agent with sample C++ code (good and bad examples)
	- Test consistency agent conflict detection logic
	- Test orchestrator's parallel + consolidation execution flow
	- Test API validation and error handling
	- Test authentication and rate limiting
	- Dependencies: All implementation complete

23. **Write Integration Tests**
	- End-to-end tests for full review workflow
	- Test frontend + backend integration
	- Dependencies: All implementation complete

24. **Set up CI/CD Pipeline** (`.github/workflows/`)
	- Run tests on push/PR
	- Lint Rust code (clippy) and format (rustfmt)
	- Build Docker images
	- Dependencies: Tests from Steps 22-23

25. **Create Deployment Configuration**
	- Docker setup (Dockerfile, docker-compose.yml)
	- Environment configuration for prod/staging/dev
	- Database migration scripts (for Phase 5)
	- Dependencies: All implementation complete

---

## **PHASE 5: Future Enhancements** (Post-MVP)

- **Git Integration**: Detect diff, automatically seed "old code" vs "new code" distinction
- **Multi-Language Support**: Add agents for JavaScript, Python, Rust, Go, Java
- **Database Integration**: Persist reviews for user history, analytics
- **Advanced Features**: Explain findings using LLM, autofix suggestions, team collaboration
- **Webhook Integration**: GitHub/GitLab webhooks for CI/CD integration
- **Performance Optimization**: Caching, async processing queue, agent scaling

---

## **Relevant Files** (to be created)

### Backend Structure
- `src/main.rs` — Entry point, Axum router setup
- `src/agents/mod.rs` — Agent framework and traits
- `src/agents/style.rs` — Style agent implementation
- `src/agents/functionality.rs` — Functionality agent implementation
- `src/agents/bug.rs` — Bug agent implementation
- `src/agents/security.rs` — Security agent implementation
- `src/agents/consistency.rs` — Consistency (meta) agent implementation
- `src/agents/orchestrator.rs` — Orchestrator for parallel execution
- `src/api/mod.rs` — HTTP API endpoints
- `src/security/validation.rs` — Input validation and sanitization
- `src/security/rate_limiting.rs` — Rate limiting logic
- `src/security/audit.rs` — Audit logging
- `src/auth/mod.rs` — Authentication logic
- `src/logging.rs` — Structured logging
- `src/types.rs` — Shared types and data structures
- `Cargo.toml` — Add dependencies: jwt, bcrypt, log, env_logger, tokio, serde_json

### Frontend Structure
- `pages/review/index.tsx` — Main review page
- `pages/components/CodeSubmissionForm.tsx` — Form component
- `pages/components/ReviewResults.tsx` — Results display
- `pages/auth/login.tsx` — Login page
- `pages/auth/signup.tsx` — Signup page
- `pages/components/LoginForm.tsx` — Login form component
- `pages/api/review.ts` — Backend proxy endpoint
- `pages/api/auth/[...auth].ts` — Auth API wrapper

### Configuration
- `.env.example` — Example environment variables
- `docker-compose.yml` — Local dev environment
- `Dockerfile` — Production build
- `.github/workflows/ci.yml` — CI/CD pipeline

---

## **Verification Steps**

### Phase 1 (Backend)
1. **Unit Tests Pass**: Run `cargo test` — all agent tests pass with known C++ code samples
2. **Agent Accuracy**: Manually verify each agent detects issues in sample C++ code (buffer overflow, bad naming, etc.)
3. **API Endpoint Works**: POST to `/api/review` with test C++ code returns all 5 agent results
4. **Input Validation**: Attempt oversized requests, invalid language, special characters — all rejected gracefully
5. **Performance**: Single review completes in < 5 seconds
6. **Logging**: Verify logs contain review requests and agent execution details

### Phase 2 (Frontend)
7. **Form Submission**: Submit code + explanation from Next.js frontend -> backend processes -> results display
8. **Results Display**: All 5 agent findings show in separate sections with clear formatting
9. **Error Handling**: Test network error, timeout, server error scenarios -> user-friendly messages display

### Phase 3 (Security)
10. **Authentication**: Signup/login flow works; JWT tokens issued and validated
11. **Rate Limiting**: Exceed rate limit -> 429 response received
12. **Code Input Sanitization**: Malicious code doesn't cause backend crashes or injections
13. **Audit Logs**: Review all auth attempts and review requests logged with timestamps and user IDs

### Phase 4+ (Testing & Deployment)
14. **Tests Pass**: All unit and integration tests pass; code coverage > 70%
15. **CI/CD Pipeline**: Push to main branch triggers tests, builds, and deploys successfully
16. **Docker Build**: `docker-compose up` starts backend and frontend locally without errors

---

## **Key Architecture Decisions**

1. **Agents as Internal Rust Functions** (not microservices) — simpler deployment, MVP focused, lower infrastructure overhead. Can refactor to microservices in Phase 5.

2. **Stateless MVP** — No database; reviews computed on-the-fly. Phase 5 adds persistence.

3. **Parallel + Meta Execution** — Style, Functionality, Bug, and Security agents run concurrently (Tokio tasks), then the Consistency agent evaluates conflicts across their outputs.

4. **Security-First Architecture** — Authentication, input validation, sandboxing, and audit logging from the start, not bolt-on later.

5. **C++ Only MVP** — Narrower scope for quality; multi-language support in Phase 5.

6. **JWT + Stateless Auth** — Scalable, doesn't require session database; works well with REST API.

7. **Direct Code Upload** (not Git integration in MVP) — simpler UX & backend. Git integration Phase 2 for "diff detection".

---

## **Critical Dependencies**

| Dependency | Why Critical |
|-----------|-------------|
| Agent framework design (Step 1) | Blocks all agent implementations (Steps 2-6) |
| Agent implementations (Steps 2-6) | Blocks orchestrator (Step 7) |
| Orchestrator (Step 7) | Blocks API layer (Step 8) |
| Input validation (Step 9) | Must be done early to avoid security debt |
| Phase 1 completion | Blocks frontend testing (Phase 2) |
| Auth implementation (Step 17) | Blocks rate limiting hardening (Step 18) |

---

## **Non-Blocking Parallelism**

- Frontend (Phase 2) can start in parallel with backend once API contract is defined (Step 8)
- Logging (Step 10) can be added anytime after Phase 1 foundation
- Tests (Phase 4) can begin after each agent is implemented
