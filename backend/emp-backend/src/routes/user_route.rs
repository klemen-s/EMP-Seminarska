use crate::models::user::{CreateUser, LoginUser, UserId};
use crate::services::db::Database;
use crate::services::util::extract_and_verify_token;
use actix_web::delete;
use actix_web::{
    http::StatusCode,
    post,
    web::{Data, Json},
    HttpRequest, HttpResponse,
};
use bson::Bson;

#[post("/register")]
pub async fn register(db: Data<Database>, user: Json<CreateUser>) -> HttpResponse {
    let user = match db.create_user(user.into_inner()).await {
        Ok(user) => user,
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                return HttpResponse::BadRequest().json(err.to_string());
            } else {
                return HttpResponse::InternalServerError().json(err.to_string());
            }
        }
    };

    // Create cart
    let insert_id = match user.inserted_id {
        Bson::ObjectId(oid) => oid,
        _ => {
            return HttpResponse::InternalServerError()
                .json("Failed to convert inserted_id to ObjectId")
        }
    };
    let cart = db.create_cart(insert_id).await;
    match cart {
        Ok(_) => HttpResponse::Ok().json("New user and user's cart created..."),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                return HttpResponse::BadRequest().json(err.to_string());
            } else {
                return HttpResponse::InternalServerError().json(err.to_string());
            }
        }
    }
}

#[post("/login")]
pub async fn login(db: Data<Database>, user: Json<LoginUser>) -> HttpResponse {
    match db.login_user(user.into_inner()).await {
        Ok(jwt) => HttpResponse::Ok().json(jwt),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().json(err.to_string())
            } else {
                HttpResponse::InternalServerError().json(err.to_string())
            }
        }
    }
}

#[delete("/delete-user")]
pub async fn delete_user(
    req: HttpRequest,
    db: Data<Database>,
    user_id: Json<UserId>,
) -> HttpResponse {
    let _claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };

    let user_id: String = user_id.into_inner().user_id;

    let _ = match db.delete_cart(user_id.clone()).await {
        Ok(_) => (),
        Err(err) => {
            return HttpResponse::InternalServerError()
                .json(format!("Could not delete user cart: {}", err))
        }
    };

    match db.delete_user(user_id).await {
        Ok(_) => HttpResponse::Ok().json("User and cart deleted..."),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().json(err.to_string())
            } else {
                HttpResponse::InternalServerError().json(err.to_string())
            }
        }
    }
}
