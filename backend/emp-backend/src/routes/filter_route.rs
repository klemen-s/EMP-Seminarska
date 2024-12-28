use crate::models::filters::{FilterId, UserFilter};
use crate::services::db::Database;
use crate::services::util::extract_and_verify_token;

use actix_web::{
    delete,
    http::StatusCode,
    post,
    web::{Data, Json},
    HttpRequest, HttpResponse,
};

#[post("/filter-profile")]
pub async fn create_user_filter_profile(
    req: HttpRequest,
    db: Data<Database>,
    user_filter_profile: Json<UserFilter>,
) -> HttpResponse {
    let _claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };
    match db
        .db_create_filter_profile(user_filter_profile.into_inner())
        .await
    {
        Ok(_) => HttpResponse::Ok().json("Created new filter profile for user..."),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}

#[delete("/filter-profile")]
pub async fn delete_user_filter_profile(
    req: HttpRequest,
    db: Data<Database>,
    filter_id: Json<FilterId>,
) -> HttpResponse {
    let _claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };

    match db.db_delete_filter_profile(filter_id.into_inner()).await {
        Ok(_) => HttpResponse::Ok().json("Deleted filter profile for user..."),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}
