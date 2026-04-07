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

#[cfg(test)]
mod tests {
    use super::*;

    fn req(code: &str, explanation: &str, language: &str) -> ReviewRequest {
        ReviewRequest {
            code: code.to_string(),
            explanation: explanation.to_string(),
            language: language.to_string(),
        }
    }

    // ── Happy path ───────────────────────────────────────────────────

    #[test]
    fn valid_cpp_request_passes() {
        let r = req("int main() {}", "Entry point", "cpp");
        assert!(validate(&r).is_ok());
    }

    #[test]
    fn language_case_insensitive() {
        assert!(validate(&req("int x;", "Decl", "CPP")).is_ok());
        assert!(validate(&req("int x;", "Decl", "C++")).is_err()); // only "cpp" is allowed
    }

    // ── Code validation ──────────────────────────────────────────────

    #[test]
    fn empty_code_rejected() {
        let err = validate(&req("", "Explanation", "cpp")).unwrap_err();
        assert!(err.contains("Code must not be empty"));
    }

    #[test]
    fn whitespace_only_code_rejected() {
        let err = validate(&req("   \n\t  ", "Explanation", "cpp")).unwrap_err();
        assert!(err.contains("Code must not be empty"));
    }

    #[test]
    fn oversized_code_rejected() {
        let big = "x".repeat(MAX_CODE_BYTES + 1);
        let err = validate(&req(&big, "Explanation", "cpp")).unwrap_err();
        assert!(err.contains("too large"));
    }

    #[test]
    fn max_size_code_accepted() {
        let at_limit = "x".repeat(MAX_CODE_BYTES);
        assert!(validate(&req(&at_limit, "Explanation", "cpp")).is_ok());
    }

    // ── Explanation validation ───────────────────────────────────────

    #[test]
    fn empty_explanation_rejected() {
        let err = validate(&req("int x;", "", "cpp")).unwrap_err();
        assert!(err.contains("Explanation must not be empty"));
    }

    #[test]
    fn whitespace_explanation_rejected() {
        let err = validate(&req("int x;", "  \n  ", "cpp")).unwrap_err();
        assert!(err.contains("Explanation must not be empty"));
    }

    #[test]
    fn oversized_explanation_rejected() {
        // chars > MAX_EXPLANATION_CHARS
        let long = "a".repeat(MAX_EXPLANATION_CHARS + 1);
        let err = validate(&req("int x;", &long, "cpp")).unwrap_err();
        assert!(err.contains("too long"));
    }

    #[test]
    fn max_explanation_accepted() {
        let at_limit = "a".repeat(MAX_EXPLANATION_CHARS);
        assert!(validate(&req("int x;", &at_limit, "cpp")).is_ok());
    }

    // ── Language validation ──────────────────────────────────────────

    #[test]
    fn unsupported_language_rejected() {
        let err = validate(&req("fn main() {}", "Entry", "rust")).unwrap_err();
        assert!(err.contains("Unsupported language"));
        assert!(err.contains("cpp"));
    }

    #[test]
    fn empty_language_rejected() {
        let err = validate(&req("int x;", "Decl", "")).unwrap_err();
        assert!(err.contains("Unsupported language"));
    }

    // ── Unicode in explanation ───────────────────────────────────────

    #[test]
    fn unicode_explanation_char_count_not_byte_count() {
        // "é" is 2 bytes but 1 char — 5000 of them should pass
        let unicode = "é".repeat(MAX_EXPLANATION_CHARS);
        assert!(validate(&req("int x;", &unicode, "cpp")).is_ok());

        // 5001 chars should fail
        let too_long = "é".repeat(MAX_EXPLANATION_CHARS + 1);
        assert!(validate(&req("int x;", &too_long, "cpp")).is_err());
    }
}
