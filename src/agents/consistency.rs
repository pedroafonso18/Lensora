use super::{AllReviews, ConsistencyReview};

const PROMPT: &str = include_str!("../../agents/consistency.txt");

pub struct ConsistencyAgent {
    api_key: String,
    client: reqwest::Client,
}

impl ConsistencyAgent {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: reqwest::Client::new(),
        }
    }

    pub async fn run(&self, reviews: &AllReviews) -> Result<ConsistencyReview, String> {
        let user_message = serde_json::json!({
            "code": reviews.input.code,
            "explanation": reviews.input.explanation,
            "style_review": reviews.style,
            "functionality_review": reviews.functionality,
            "bug_review": reviews.bug,
            "security_review": reviews.security,
        })
        .to_string();

        let text =
            super::claude::call(&self.client, &self.api_key, PROMPT, user_message).await?;

        serde_json::from_str(&text)
            .map_err(|e| format!("Failed to parse ConsistencyReview from Claude response: {e}"))
    }
}
