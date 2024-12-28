use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use std::fmt::Display;

#[derive(Debug, Serialize, Deserialize)]
pub struct Filter {
    pub min_price: f64,
    pub max_price: f64,
    #[serde(default)]
    pub colors: Vec<String>,
    #[serde(default)]
    pub sizes: Vec<String>,
    pub product_type: String,
    #[serde(default)]
    pub gender: Vec<String>,
}

impl Display for Filter {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "UserFilter {{ min_price: {:?}, max_price: {:?}, colors: {:?}, sizes: {:?}, product_type: {:?}, gender: {:?} }}",
           self.min_price, self.max_price, self.colors, self.sizes, self.product_type, self.gender)
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserFilter {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub _id: Option<ObjectId>,
    pub user_id: ObjectId,
    pub min_price: f64,
    pub max_price: f64,
    #[serde(default)]
    pub colors: Vec<String>,
    #[serde(default)]
    pub sizes: Vec<String>,
    pub product_type: String,
    #[serde(default)]
    pub gender: Vec<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct FilterId {
    pub filter_id: String,
}
