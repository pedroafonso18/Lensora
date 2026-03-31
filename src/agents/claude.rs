use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct Message {
    role: &'static str,
    content: String,
}

#[derive(Serialize)]
struct Request<'a> {
    model: &'static str,
    max_tokens: u32,
    system: &'a str,
    messages: Vec<Message>,
}

#[derive(Deserialize)]
struct ContentBlock {
    #[serde(rename = "type")]
    block_type: String,
    text: Option<String>,
}

#[derive(Deserialize)]
struct Response {
    content: Vec<ContentBlock>,
}

pub async fn call(
    client: &reqwest::Client,
    api_key: &str,
    system: &str,
    user_message: String,
) -> Result<String, String> {
    let request = Request {
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system,
        messages: vec![Message {
            role: "user",
            content: user_message,
        }],
    };

    let response = client
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .header("content-type", "application/json")
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    let body: Response = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse API response: {e}"))?;

    body.content
        .into_iter()
        .find(|b| b.block_type == "text")
        .and_then(|b| b.text)
        .ok_or_else(|| "No text content in Claude response".to_string())
}
