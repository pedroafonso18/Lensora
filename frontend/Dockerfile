# ── Stage 1: Dependencies ─────────────────────────────────────────
FROM node:24-slim AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: Build ────────────────────────────────────────────────
FROM node:24-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Env vars that must be present at build time (public ones only)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID
ARG NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=$NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID \
    NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=$NEXT_PUBLIC_STRIPE_PRO_PRICE_ID \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build

# ── Stage 3: Runtime ──────────────────────────────────────────────
FROM node:24-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Non-root user
RUN useradd -m -u 1001 nextjs
USER nextjs

# Copy built output
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

EXPOSE 4000

ENV PORT=4000 \
    HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
