use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Cart {
    pub _id: ObjectId,
    pub products: Vec<ObjectId>,
    pub user_id: ObjectId,
}
