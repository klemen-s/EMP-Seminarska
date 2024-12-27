use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Filter {
    pub _id: ObjectId,
    pub min_price: Option<String>,
    pub max_price: Option<String>,
    pub colors: Option<Vec<String>>,
    pub sizes: Option<Vec<String>>,
    pub product_type: Option<Vec<String>>,
    pub user_id: ObjectId,
}
