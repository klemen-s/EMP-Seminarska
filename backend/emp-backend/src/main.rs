mod models;
mod routes;
mod services;

use actix_web::{get, web::Data, App, HttpResponse, HttpServer, Responder};
use env_logger::Env;
use routes::user_route::{delete_user, login, register};
use services::db::Database;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello Medium!")
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
    })
    .bind(("localhost", 5001))?
    .run()
    .await
}
