use crate::models::filters::Filter;
use crate::models::product::ProductIdQuery;
use crate::services::db::Database;
use actix_web::web::Json;
use actix_web::{
    get,
    http::StatusCode,
    post,
    web::{Data, Query},
    HttpResponse,
};

#[post("/products")]
pub async fn get_products_by_filter(db: Data<Database>, filter: Json<Filter>) -> HttpResponse {
    match db.filter_products(filter.0).await {
        Ok(product) => HttpResponse::Ok().json(product),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}

#[get("/product")]
pub async fn get_product(db: Data<Database>, query_param: Query<ProductIdQuery>) -> HttpResponse {
    match db.get_product(query_param.product_id.clone()).await {
        Ok(product) => HttpResponse::Ok().json(product),
        Err(err) => {
            if err.as_response_error().status_code() == StatusCode::BAD_REQUEST {
                HttpResponse::BadRequest().body(err.to_string())
            } else {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}
