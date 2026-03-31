use tracing::info;

use super::{
    AllReviews, Agent, ReviewInput, ReviewResult,
    bug::BugAgent,
    consistency::ConsistencyAgent,
    functionality::FunctionalityAgent,
    security::SecurityAgent,
    style::StyleAgent,
};

/// Times a single agent future and logs its elapsed duration.
async fn timed<T>(
    name: &'static str,
    fut: impl std::future::Future<Output = Result<T, String>>,
) -> Result<T, String> {
    let start = std::time::Instant::now();
    let result = fut.await;
    let elapsed_ms = start.elapsed().as_millis() as u64;

    match &result {
        Ok(_) => info!(agent = name, elapsed_ms, "agent completed"),
        Err(e) => tracing::error!(agent = name, elapsed_ms, error = %e, "agent failed"),
    }

    result
}

/// Runs the 4 main agents in parallel, then the Consistency agent on their outputs.
/// Returns a ReviewResult or the first error encountered.
pub async fn run(api_key: &str, input: ReviewInput) -> Result<ReviewResult, String> {
    // Agents are bound to named variables so they outlive the futures that borrow them.
    let style_agent = StyleAgent::new(api_key.to_string());
    let functionality_agent = FunctionalityAgent::new(api_key.to_string());
    let bug_agent = BugAgent::new(api_key.to_string());
    let security_agent = SecurityAgent::new(api_key.to_string());

    info!("starting parallel agent review");

    // Run Style, Functionality, Bug, and Security agents concurrently.
    // tokio::try_join! short-circuits on the first Err, cancelling the remaining futures.
    let (style, functionality, bug, security) = tokio::try_join!(
        timed("style", style_agent.review(&input)),
        timed("functionality", functionality_agent.review(&input)),
        timed("bug", bug_agent.review(&input)),
        timed("security", security_agent.review(&input)),
    )?;

    // Bundle everything for the Consistency agent.
    let all_reviews = AllReviews {
        input,
        style,
        functionality,
        bug,
        security,
    };

    info!("starting consistency review");

    // Run the Consistency agent after all 4 have completed.
    let consistency_start = std::time::Instant::now();
    let consistency = ConsistencyAgent::new(api_key.to_string())
        .run(&all_reviews)
        .await?;
    info!(
        elapsed_ms = consistency_start.elapsed().as_millis() as u64,
        "consistency agent completed"
    );

    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    Ok(ReviewResult {
        style: all_reviews.style,
        functionality: all_reviews.functionality,
        bug: all_reviews.bug,
        security: all_reviews.security,
        consistency,
        timestamp,
    })
}
