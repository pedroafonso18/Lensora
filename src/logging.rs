use tracing_subscriber::{fmt, EnvFilter};

/// Initialises the global tracing subscriber.
/// Log level is controlled via the RUST_LOG environment variable.
/// Defaults to `info` for this crate if RUST_LOG is not set.
pub fn init() {
    fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("lensora=info")),
        )
        .with_target(false)
        .init();
}
