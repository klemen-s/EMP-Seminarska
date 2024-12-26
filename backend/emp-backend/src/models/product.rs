use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Product {
    pub _id: ObjectId,
    pub name: String,
    pub price: String,
    pub gender: String,
    pub size: Vec<String>,
}
