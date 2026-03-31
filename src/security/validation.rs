use crate::api::ReviewRequest;
use tracing::warn;

const MAX_CODE_BYTES: usize = 1_048_576; // 1 MB
const MAX_EXPLANATION_CHARS: usize = 5_000;
const ALLOWED_LANGUAGES: &[&str] = &["cpp"];

/// Validates and sanitizes a review request before it reaches the orchestrator.
/// Returns Ok(()) if the request is acceptable, or Err with a user-facing message.
pub fn validate(req: &ReviewRequest) -> Result<(), String> {
    // --- Code ---
    if req.code.trim().is_empty() {
        return Err("Code must not be empty.".to_string());
    }

    let code_bytes = req.code.len();
    if code_bytes > MAX_CODE_BYTES {
        warn!(code_bytes, max = MAX_CODE_BYTES, "code submission exceeds size limit");
        return Err(format!(
            "Code is too large ({} bytes). Maximum allowed size is {} bytes (1 MB).",
            code_bytes, MAX_CODE_BYTES
        ));
    }

    // Warn when submission is large but within limits (80% threshold).
    if code_bytes > MAX_CODE_BYTES * 4 / 5 {
        warn!(
            code_bytes,
            pct = format!("{:.0}%", code_bytes as f64 / MAX_CODE_BYTES as f64 * 100.0),
            "large code submission"
        );
    }

    // --- Explanation ---
    if req.explanation.trim().is_empty() {
        return Err("Explanation must not be empty.".to_string());
    }

    let explanation_chars = req.explanation.chars().count();
    if explanation_chars > MAX_EXPLANATION_CHARS {
        return Err(format!(
            "Explanation is too long ({} characters). Maximum allowed length is {} characters.",
            explanation_chars, MAX_EXPLANATION_CHARS
        ));
    }

    // --- Language ---
    let lang = req.language.trim().to_lowercase();
    if !ALLOWED_LANGUAGES.contains(&lang.as_str()) {
        warn!(language = req.language, "unsupported language requested");
        return Err(format!(
            "Unsupported language {:?}. Supported languages: {}.",
            req.language,
            ALLOWED_LANGUAGES.join(", ")
        ));
    }

    Ok(())
}
