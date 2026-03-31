use super::{Agent, FunctionalityReview, ReviewInput};

const PROMPT: &str = include_str!("../../agents/functionality.txt");

pub struct FunctionalityAgent {
    api_key: String,
    client: reqwest::Client,
}

impl FunctionalityAgent {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: reqwest::Client::new(),
        }
    }
}

#[async_trait::async_trait]
impl Agent for FunctionalityAgent {
    type Output = FunctionalityReview;

    fn name(&self) -> &'static str {
        "Functionality"
    }

    async fn review(&self, input: &ReviewInput) -> Result<FunctionalityReview, String> {
        let user_message = serde_json::json!({
            "code": input.code,
            "explanation": input.explanation,
        })
        .to_string();

        let text = super::claude::call(&self.client, &self.api_key, PROMPT, user_message).await?;

        serde_json::from_str(&text)
            .map_err(|e| format!("Failed to parse FunctionalityReview from Claude response: {e}"))
    }
}
