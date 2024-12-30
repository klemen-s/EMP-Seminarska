use crate::models::cart::AddCartItems;
use crate::services::db::Database;
use crate::services::util::extract_and_verify_token;

use actix_web::{
    delete,
    http::StatusCode,
    post,
    web::{Data, Json},
    HttpRequest, HttpResponse,
};

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
