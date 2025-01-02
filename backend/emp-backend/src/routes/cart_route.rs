use crate::models::{cart::AddCartItems, user::UserId};
use crate::services::db::Database;
use crate::services::util::extract_and_verify_token;

use actix_web::{
    delete, get,
    http::StatusCode,
    post,
    web::{Data, Json, Query},
    HttpRequest, HttpResponse,
};

#[get("/cart")]
pub async fn fetch_cart(
    req: HttpRequest,
    db: Data<Database>,
    user_id: Query<UserId>,
) -> HttpResponse {
    let _claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };

    match db.fetch_cart(user_id.into_inner().user_id).await {
        Ok(cart_items) => HttpResponse::Ok().json(cart_items),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().json(err.to_string())
            } else {
                HttpResponse::InternalServerError().json(err.to_string())
            }
        }
    }
}

#[post("/cart")]
pub async fn add_cart_item(
    req: HttpRequest,
    db: Data<Database>,
    cart_data: Json<AddCartItems>,
) -> HttpResponse {
    let _claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };

    match db.add_cart_item(cart_data.into_inner()).await {
        Ok(_) => HttpResponse::Ok().json("Items added to cart..."),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().json(err.to_string())
            } else {
                HttpResponse::InternalServerError().json(err.to_string())
            }
        }
    }
}

#[delete("/cart")]
pub async fn remove_cart_item(
    req: HttpRequest,
    db: Data<Database>,
    cart_data: Json<AddCartItems>,
) -> HttpResponse {
    let _claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };

    match db.delete_cart_item(cart_data.into_inner()).await {
        Ok(_) => HttpResponse::Ok().json("Items quantity decreased or item removed from cart..."),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().json(err.to_string())
            } else {
                HttpResponse::InternalServerError().json(err.to_string())
            }
        }
    }
}
