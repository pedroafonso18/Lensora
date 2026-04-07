use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};

use crate::agents::{orchestrator, ReviewInput};
use crate::security::{audit, clerk_auth, validation};
use tracing::{error, info, warn};

#[derive(Clone)]
pub struct AppState {
    pub api_key: String,
    /// The Clerk JWKS endpoint, e.g. https://<frontend-api>.clerk.accounts.dev/.well-known/jwks.json
    pub clerk_jwks_url: String,
}

#[derive(Deserialize)]
pub struct ReviewRequest {
    pub code: String,
    pub explanation: String,
    pub language: String,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

/// Extracts the Bearer token from the Authorization header.
fn extract_bearer(headers: &HeaderMap) -> Option<&str> {
    headers
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
}

pub async fn review_handler(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<ReviewRequest>,
) -> impl IntoResponse {
    // --- Auth ---
    let token = match extract_bearer(&headers) {
        Some(t) => t,
        None => {
            audit::log_unauthorized("missing Authorization header");
            return (
                StatusCode::UNAUTHORIZED,
                Json(ErrorResponse { error: "Missing Bearer token".to_string() }),
            )
                .into_response();
        }
    };

    let claims = match clerk_auth::verify(token, &state.clerk_jwks_url).await {
        Ok(c) => c,
        Err(e) => {
            audit::log_unauthorized(&e);
            return (
                StatusCode::UNAUTHORIZED,
                Json(ErrorResponse { error: "Invalid or expired token".to_string() }),
            )
                .into_response();
        }
    };

    let user_id = &claims.sub;
    let subscription_tier = claims
        .metadata
        .subscription_status
        .as_deref()
        .unwrap_or("none");

    info!(
        user_id,
        code_bytes = body.code.len(),
        language = %body.language,
        "review request received"
    );

    // --- Validation ---
    if let Err(e) = validation::validate(&body) {
        warn!(user_id, reason = %e, "validation failed");
        return (StatusCode::BAD_REQUEST, Json(ErrorResponse { error: e })).into_response();
    }

    // --- Audit ---
    audit::log_review_request(user_id, body.code.len(), &body.language, subscription_tier);

    let input = ReviewInput {
        code: body.code,
        explanation: body.explanation,
        language: body.language,
    };

    let start = std::time::Instant::now();

    match orchestrator::run(&state.api_key, input).await {
        Ok(result) => {
            info!(
                user_id,
                elapsed_ms = start.elapsed().as_millis() as u64,
                "review completed"
            );
            (StatusCode::OK, Json(result)).into_response()
        }
        Err(e) => {
            error!(user_id, error = %e, "review failed");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse { error: e }),
            )
                .into_response()
        }
    }
}
