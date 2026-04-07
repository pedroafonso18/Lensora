# ── Stage 1: Build ────────────────────────────────────────────────
FROM rust:1.87-slim AS builder

WORKDIR /app

# Install system dependencies for reqwest (TLS)
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Cache dependencies separately from source code
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo 'fn main() {}' > src/main.rs && cargo build --release && rm -rf src

# Build the real binary
COPY src/ ./src/
COPY agents/ ./agents/
RUN touch src/main.rs && cargo build --release

# ── Stage 2: Runtime ──────────────────────────────────────────────
FROM debian:bookworm-slim AS runtime

WORKDIR /app

# Runtime dependencies
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the compiled binary
COPY --from=builder /app/target/release/Lensora ./server

# Non-root user for security
RUN useradd -m -u 1001 lensora
USER lensora

EXPOSE 3000

CMD ["./server"]
