use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};

use crate::agents::{orchestrator, ReviewInput};
use crate::security::validation;
use tracing::{error, info, warn};

#[derive(Clone)]
pub struct AppState {
    pub api_key: String,
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

pub async fn review_handler(
    State(state): State<AppState>,
    Json(body): Json<ReviewRequest>,
) -> impl IntoResponse {
    info!(
        code_bytes = body.code.len(),
        language = %body.language,
        "review request received"
    );

    if let Err(e) = validation::validate(&body) {
        warn!(reason = %e, "validation failed");
        return (StatusCode::BAD_REQUEST, Json(ErrorResponse { error: e })).into_response();
    }

    let input = ReviewInput {
        code: body.code,
        explanation: body.explanation,
        language: body.language,
    };

    let start = std::time::Instant::now();

    match orchestrator::run(&state.api_key, input).await {
        Ok(result) => {
            info!(elapsed_ms = start.elapsed().as_millis() as u64, "review completed");
            (StatusCode::OK, Json(result)).into_response()
        }
        Err(e) => {
            error!(error = %e, "review failed");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse { error: e }),
            )
                .into_response()
        }
    }
}
