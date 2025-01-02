use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

use super::cart::CartItem;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Order {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub _id: Option<ObjectId>,
    pub order_items: Vec<CartItem>,
    pub user_id: ObjectId,
}

#[derive(Deserialize, Debug)]
pub struct OrderQuery {
    pub order_id: String,
}
