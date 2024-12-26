use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Filter {
    pub _id: ObjectId,
    pub min_price: String,
    pub max_price: String,
    pub colors: Vec<String>,
    pub sizes: Vec<String>,
    pub product_type: Vec<String>,
    pub user_id: ObjectId,
}
