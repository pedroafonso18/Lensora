use super::{Agent, BugReview, ReviewInput};

const PROMPT: &str = include_str!("../../agents/bug.txt");

pub struct BugAgent {
    api_key: String,
    client: reqwest::Client,
}

impl BugAgent {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: reqwest::Client::new(),
        }
    }
}

#[async_trait::async_trait]
impl Agent for BugAgent {
    type Output = BugReview;

    fn name(&self) -> &'static str {
        "Bug"
    }

    async fn review(&self, input: &ReviewInput) -> Result<BugReview, String> {
        let user_message = serde_json::json!({
            "code": input.code,
            "explanation": input.explanation,
        })
        .to_string();

        let text = super::claude::call(&self.client, &self.api_key, PROMPT, user_message).await?;

        serde_json::from_str(&text)
            .map_err(|e| format!("Failed to parse BugReview from Claude response: {e}"))
    }
}
