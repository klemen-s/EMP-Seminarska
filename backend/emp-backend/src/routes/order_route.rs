use crate::models::order::{Order, OrderQuery};
use crate::models::user::UserId;
use crate::services::db::Database;
use crate::services::util::extract_and_verify_token;

use actix_web::{
    get,
    http::StatusCode,
    post,
    web::{Data, Json, Query},
    HttpRequest, HttpResponse,
};

#[get("/orders")]
pub async fn get_user_orders(
    req: HttpRequest,
    db: Data<Database>,
    query_param: Query<UserId>,
) -> HttpResponse {
    let _claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };

    match db.get_orders(query_param.user_id.clone()).await {
        Ok(orders) => HttpResponse::Ok().json(orders),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}

#[get("/order")]
pub async fn get_user_order(
    req: HttpRequest,
    db: Data<Database>,
    query_param: Query<OrderQuery>,
) -> HttpResponse {
    let _claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };

    match db.get_order(query_param.order_id.clone()).await {
        Ok(order) => HttpResponse::Ok().json(order),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}

#[post("/order")]
pub async fn post_user_order(
    req: HttpRequest,
    db: Data<Database>,
    order: Json<Order>,
) -> HttpResponse {
    let _claims = match extract_and_verify_token(&req) {
        Ok(claims) => claims,
        Err(err) => return err,
    };

    match db.create_order(order.into_inner()).await {
        Ok(_) => HttpResponse::Ok().json("New order created..."),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}
