mod models;
mod routes;
mod services;

use actix_web::{get, web::Data, App, HttpResponse, HttpServer, Responder};
use routes::cart_route::{add_cart_item, remove_cart_item};
use routes::filter_route::{get_user_filter_profiles,create_user_filter_profile, delete_user_filter_profile};
use routes::order_route::{get_user_order, get_user_orders, post_user_order};
use routes::product_route::{get_product, get_products_by_filter};
use routes::user_route::{delete_user, login, register};
use services::db::Database;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    let db = Database::init().await;
    let db_data = Data::new(db);
    HttpServer::new(move || {
        App::new()
            .app_data(db_data.clone())
            .service(hello)
            .service(login)
            .service(register)
            .service(delete_user)
            .service(get_products_by_filter)
            .service(get_product)
            .service(get_user_orders)
            .service(get_user_order)
            .service(post_user_order)
            .service(add_cart_item)
            .service(remove_cart_item)
            .service(get_user_filter_profiles)
            .service(create_user_filter_profile)
            .service(delete_user_filter_profile)
    })
    .bind(("localhost", 5001))?
    .run()
    .await
}
