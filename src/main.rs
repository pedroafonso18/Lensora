mod agents;
mod api;
mod logging;
mod security;

use axum::{routing::{get, post}, Router};
use tower_http::cors::CorsLayer;
use tracing::info;

#[tokio::main]
async fn main() {
    logging::init();
    dotenvy::dotenv().ok();

    let api_key = std::env::var("API_KEY")
        .expect("API_KEY must be set in .env");

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string());

    let addr = format!("0.0.0.0:{port}");

    let state = api::AppState { api_key };

    // CorsLayer::permissive() allows all origins. Restrict this in production.
    let app = Router::new()
        .route("/health", get(|| async { "ok" }))
        .route("/api/review", post(api::review_handler))
        .with_state(state)
        .layer(CorsLayer::permissive());

    info!(addr = %addr, "server starting");

    let listener = tokio::net::TcpListener::bind(&addr).await
        .unwrap_or_else(|e| panic!("failed to bind to {addr}: {e}"));

    axum::serve(listener, app).await.unwrap();
}
