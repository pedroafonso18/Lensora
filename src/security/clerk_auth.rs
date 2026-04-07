/// Clerk JWT verification using the JWKS endpoint.
///
/// Clerk issues RS256-signed JWTs. We fetch the public key from the JWKS endpoint
/// (derived from the publishable key / frontend API URL) and validate the token.
use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode, decode_header};
use serde::Deserialize;
use tracing::debug;

/// Minimal claims we care about from a Clerk session token.
#[derive(Debug, Deserialize)]
pub struct ClerkClaims {
    /// Clerk user ID (sub claim).
    pub sub: String,
    /// Subscription status stored in public metadata by the Stripe webhook.
    #[serde(default)]
    pub metadata: ClerkPublicMetadata,
}

#[derive(Debug, Deserialize, Default)]
pub struct ClerkPublicMetadata {
    #[serde(rename = "subscriptionStatus")]
    pub subscription_status: Option<String>,
}

/// A single key from the JWKS response.
#[derive(Deserialize)]
struct JwkKey {
    kid: String,
    n: String,
    e: String,
}

#[derive(Deserialize)]
struct JwksResponse {
    keys: Vec<JwkKey>,
}

/// Fetches the JWKS from Clerk and validates `token`.
/// Returns the decoded claims on success, or an error string.
pub async fn verify(token: &str, jwks_url: &str) -> Result<ClerkClaims, String> {
    // Decode the header to get the key ID we should look up.
    let header = decode_header(token).map_err(|e| format!("invalid JWT header: {e}"))?;
    let kid = header
        .kid
        .ok_or_else(|| "JWT missing kid header".to_string())?;

    debug!(kid = %kid, "verifying Clerk JWT");

    // Fetch the JWKS.
    let resp = reqwest::get(jwks_url)
        .await
        .map_err(|e| format!("JWKS fetch failed: {e}"))?;

    let jwks: JwksResponse = resp
        .json()
        .await
        .map_err(|e| format!("JWKS parse error: {e}"))?;

    // Find the matching key.
    let jwk = jwks
        .keys
        .iter()
        .find(|k| k.kid == kid)
        .ok_or_else(|| format!("JWKS has no key with kid={kid}"))?;

    // Build the decoding key from the RSA public key components.
    let decoding_key = DecodingKey::from_rsa_components(&jwk.n, &jwk.e)
        .map_err(|e| format!("failed to build decoding key: {e}"))?;

    let mut validation = Validation::new(Algorithm::RS256);
    // Clerk JWTs don't include an `aud` claim by default.
    validation.set_audience(&["lensora"]);
    validation.validate_aud = false;

    let token_data = decode::<ClerkClaims>(token, &decoding_key, &validation)
        .map_err(|e| format!("JWT verification failed: {e}"))?;

    Ok(token_data.claims)
}
