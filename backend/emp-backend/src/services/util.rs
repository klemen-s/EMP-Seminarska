use actix_web::{HttpRequest, HttpResponse};
use hmac::{Hmac, Mac};
use jwt::VerifyWithKey;
use sha2::Digest;
use sha2::Sha256;
use std::collections::BTreeMap;

pub fn sha256_helper(to_hash: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(to_hash);
    let hashed_password = format!("{:x}", hasher.finalize());
    hashed_password
}

pub fn extract_and_verify_token(
    req: &HttpRequest,
) -> Result<BTreeMap<String, String>, HttpResponse> {
    let auth_header = req.headers().get("Authorization");
    if auth_header.is_none() {
        return Err(HttpResponse::Unauthorized().body("Missing Authorization header... (Not logged in)"));
    }

    let auth_header = auth_header
        .unwrap()
        .to_str()
        .map_err(|_| HttpResponse::Unauthorized().body("Invalid Authorization header format..."))?;

    if !auth_header.starts_with("Bearer ") {
        return Err(HttpResponse::Unauthorized().body("Invalid Authorization header format..."));
    }

    let token = &auth_header[7..];

    // Verify the token
    let key: Hmac<Sha256> = Hmac::new_from_slice(b"nooneisgonnalookatthis").map_err(|e| {
        HttpResponse::InternalServerError().body(format!("Error creating HMAC key: {}", e))
    })?;

    let claims: BTreeMap<String, String> = token
        .verify_with_key(&key)
        .map_err(|e| HttpResponse::Unauthorized().body(format!("Invalid token: {}", e)))?;

    Ok(claims)
}
