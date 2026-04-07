use tracing::{info, warn};

/// Emitted on every successful review request that passes auth + validation.
pub fn log_review_request(
    user_id: &str,
    code_bytes: usize,
    language: &str,
    subscription_tier: &str,
) {
    info!(
        user_id,
        code_bytes,
        language,
        subscription_tier,
        "audit: review request"
    );
}

/// Emitted when a request is rejected due to a missing or invalid auth token.
pub fn log_unauthorized(reason: &str) {
    warn!(reason, "audit: 401 unauthorized");
}

/// Emitted when a request is rejected due to rate limiting (future Starter tier).
pub fn log_rate_limited(user_id: &str) {
    warn!(user_id, "audit: 429 rate limited");
}
