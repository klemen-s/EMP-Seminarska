use crate::models::user::{CreateUser, DeleteUser, LoginUser};
use crate::services::db::Database;
use crate::services::util::extract_and_verify_token;
use actix_web::{
    post,
    web::{Data, Json},
    HttpRequest, HttpResponse,
};

#[post("/register")]
pub async fn register(db: Data<Database>, user: Json<CreateUser>) -> HttpResponse {
    match db.create_user(user.into_inner()).await {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(err) => {
            if err.as_response_error().status_code() == actix_web::http::StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}

#[post("/login")]
pub async fn login(db: Data<Database>, user: Json<LoginUser>) -> HttpResponse {
    match db.login_user(user.into_inner()).await {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(err) => {
            if err.as_response_error().status_code() == actix_web::http::StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}

#[post("/delete-user")]
pub async fn delete_user(
    req: HttpRequest,
    db: Data<Database>,
    user_id: Json<DeleteUser>,
) -> HttpResponse {
    let claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };

    match db.delete_user(user_id.into_inner()._id).await {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(err) => {
            if err.as_response_error().status_code() == actix_web::http::StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}
