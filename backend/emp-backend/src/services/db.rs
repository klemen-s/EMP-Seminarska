use crate::models::order::Order;
use crate::models::product::Product;
use crate::models::user::{CreateUser, LoginUser, User};
use crate::services::util::sha256_helper;

use actix_web::error::ErrorBadRequest;
use actix_web::Error as WebError;
use bson::doc;
use bson::oid::ObjectId;
use chrono::{Duration, Utc};
use futures_util::TryStreamExt;
use hmac::{Hmac, Mac};
use jwt::SignWithKey;
use mongodb::results::{DeleteResult, InsertOneResult};
use mongodb::{Client, Collection};
use sha2::Sha256;
use std::collections::BTreeMap;

pub struct Database {
    order: Collection<Order>,
    product: Collection<Product>,
    user: Collection<User>,
}

impl Database {
    pub async fn init() -> Self {
        let uri = "mongodb://localhost:27017";
        let client = Client::with_uri_str(uri).await.unwrap();
        let db = client.database("avantis");

        let order: Collection<Order> = db.collection("order");
        let product: Collection<Product> = db.collection("product");
        let user: Collection<User> = db.collection("user");

        Database {
            order,
            product,
            user,
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // Order
    //////////////////////////////////////////////////////////////////////////////////////////
    pub async fn create_order(&self, order: Order) -> Result<InsertOneResult, WebError> {
        let result = self
            .order
            .insert_one(order)
            .await
            .ok()
            .expect("Error creating order...");

        Ok(result)
    }

    pub async fn delete_order(&self, order_id: &str) -> Result<DeleteResult, WebError> {
        let result = self
            .order
            .delete_one(doc! {
                "_id": ObjectId::parse_str(order_id).expect("Failed to parse order_id")
            })
            .await
            .ok()
            .expect("Error deleteing order...");

        Ok(result)
    }
    //////////////////////////////////////////////////////////////////////////////////////////
    // Product
    //////////////////////////////////////////////////////////////////////////////////////////
    pub async fn create_product(&self, product: Product) -> Result<InsertOneResult, WebError> {
        let result = self
            .product
            .insert_one(product)
            .await
            .ok()
            .expect("Error creating product...");

        Ok(result)
    }

    pub async fn delete_product(&self, product_id: &str) -> Result<DeleteResult, WebError> {
        let result = self
            .product
            .delete_one(doc! {
                "_id": ObjectId::parse_str(product_id).expect("Failed to parse product_id")
            })
            .await
            .ok()
            .expect("Error deleting product...");

        Ok(result)
    }

    pub async fn get_products(&self, gender: &str) -> Result<Vec<Product>, WebError> {
        let mut result = self
            .product
            .find(doc! {"gender": gender})
            .await
            .ok()
            .expect("Error getting products...");
        let mut products = Vec::new();

        while let Some(product) = result
            .try_next()
            .await
            .ok()
            .expect("Could not get all of the products...")
        {
            products.push(product);
        }
        Ok(products)
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // User
    //////////////////////////////////////////////////////////////////////////////////////////
    pub async fn create_user(&self, user: CreateUser) -> Result<InsertOneResult, WebError> {
        if user.password != user.confirm_password {
            return Err(ErrorBadRequest("Passwords do not match...").into());
        }

        let existing_email = self
            .user
            .find_one(doc! {"email": user.email.clone()})
            .await
            .map_err(|e| {
                ErrorBadRequest(format!(
                    "Problem querying database for email {}: {}",
                    user.email, e
                ))
            })?;

        if let Some(_) = existing_email {
            return Err(ErrorBadRequest("Email already exists...").into());
        }

        let hashed_password = sha256_helper(&user.password.into_bytes());

        let new_user = User {
            _id: None,
            name: user.name,
            email: user.email,
            password: hashed_password,
        };

        let result = self
            .user
            .insert_one(new_user)
            .await
            .ok()
            .expect("Could not insert new user to database...");

        Ok(result)
    }

    pub async fn login_user(&self, user: LoginUser) -> Result<String, WebError> {
        let existing_user: Option<User> = self
            .user
            .find_one(doc! {"email": user.email.clone()})
            .await
            .map_err(|e| {
                ErrorBadRequest(format!(
                    "Problem querying database for email {}: {}",
                    user.email, e
                ))
            })?;

        if existing_user.is_none() {
            return Err(ErrorBadRequest("User not found").into());
        }

        let db_user: User = existing_user.unwrap();

        // Check if correct password
        if db_user.password != sha256_helper(&user.password.into_bytes()) {
            return Err(ErrorBadRequest("Invalid password").into());
        }

        // Generate JWT
        let key: Hmac<Sha256> = Hmac::new_from_slice(b"nooneisgonnalookatthis").map_err(|e| {
            actix_web::error::ErrorInternalServerError(format!("Error creating HMAC key: {}", e))
        })?;

        let mut claims: BTreeMap<&str, &str> = BTreeMap::new();
        let user_id = &db_user._id.unwrap().to_hex();

        claims.insert("id", user_id);
        claims.insert("name", &db_user.name);
        claims.insert("email", &db_user.email);

        // Expires in 1 week
        let exp = Utc::now() + Duration::weeks(1);
        let exp_str = exp.to_rfc3339();
        claims.insert("exp", &exp_str);

        let token_str: String = claims.sign_with_key(&key).map_err(|e| {
            actix_web::error::ErrorInternalServerError(format!("Error signing JWT: {}", e))
        })?;

        Ok(token_str)
    }

    pub async fn delete_user(&self, user_id: String) -> Result<DeleteResult, WebError> {
        let result = self
            .user
            .delete_one(doc! {
                "_id": ObjectId::parse_str(user_id).expect("Failed to parse user_id")
            })
            .await
            .ok()
            .expect("Error deleting user...");

        Ok(result)
    }
}
