use mongodb::bson::{oid::ObjectId, Bson};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Cart {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub _id: Option<ObjectId>,
    pub products: Vec<CartItem>,
    pub user_id: ObjectId,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AddCartItems {
    pub products: Vec<CartItem>,
    pub user_id: ObjectId,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct CartItem {
    pub size: String,
    pub quantity: u32,
    pub color: String,
    pub product_id: ObjectId,
}

impl Into<Bson> for CartItem {
    fn into(self) -> Bson {
        let mut doc = bson::Document::new();
        doc.insert("size", self.size);
        doc.insert("quantity", self.quantity);
        doc.insert("product_id", self.product_id);
        Bson::Document(doc)
    }
}


#[derive(Debug, Deserialize, Serialize)]
pub struct ContextCartItem {
    pub size: String,
    pub quantity: u32,
    pub color: String,
    #[serde(rename(serialize = "imageUrl", deserialize = "image_url"))]
    pub image_url: String,
    pub price: f64,
    pub product_id: ObjectId,
}
