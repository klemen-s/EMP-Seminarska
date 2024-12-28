use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub _id: Option<ObjectId>,
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct CreateUser {
    pub name: String,
    pub email: String,
    pub password: String,
    pub confirm_password: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserId {
    pub user_id: String,
}
