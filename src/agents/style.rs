use super::{Agent, ReviewInput, StyleReview};

const PROMPT: &str = include_str!("../../agents/style.txt");

pub struct StyleAgent {
    api_key: String,
    client: reqwest::Client,
}

impl StyleAgent {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: reqwest::Client::new(),
        }
    }
}

#[async_trait::async_trait]
impl Agent for StyleAgent {
    type Output = StyleReview;

    fn name(&self) -> &'static str {
        "Style"
    }

    async fn review(&self, input: &ReviewInput) -> Result<StyleReview, String> {
        let user_message = serde_json::json!({
            "code": input.code,
            "explanation": input.explanation,
        })
        .to_string();

        let text = super::claude::call(&self.client, &self.api_key, PROMPT, user_message).await?;

        serde_json::from_str(&text)
            .map_err(|e| format!("Failed to parse StyleReview from Claude response: {e}"))
    }
}
