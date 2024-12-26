use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Order {
    pub _id: ObjectId,
    pub order_items: Vec<ObjectId>,
    pub user_id: ObjectId,
}
