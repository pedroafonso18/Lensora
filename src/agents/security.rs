use super::{Agent, ReviewInput, SecurityReview};

const PROMPT: &str = include_str!("../../agents/security.txt");

pub struct SecurityAgent {
    api_key: String,
    client: reqwest::Client,
}

impl SecurityAgent {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: reqwest::Client::new(),
        }
    }
}

#[async_trait::async_trait]
impl Agent for SecurityAgent {
    type Output = SecurityReview;

    fn name(&self) -> &'static str {
        "Security"
    }

    async fn review(&self, input: &ReviewInput) -> Result<SecurityReview, String> {
        let user_message = serde_json::json!({
            "code": input.code,
            "explanation": input.explanation,
        })
        .to_string();

        let text = super::claude::call(&self.client, &self.api_key, PROMPT, user_message).await?;

        serde_json::from_str(&text)
            .map_err(|e| format!("Failed to parse SecurityReview from Claude response: {e}"))
    }
}
