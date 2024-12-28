use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Product {
    pub _id: Option<ObjectId>,
    pub title: String,
    pub price: f64,
    pub gender: String,
    pub sizes: Vec<String>,
    pub colors: Vec<String>,
    pub product_type: String,
}

#[derive(Deserialize, Debug)]
pub struct ProductIdQuery {
    pub product_id: String,
}
