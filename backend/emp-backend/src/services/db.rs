use crate::models::cart::AddCartItems;
use crate::models::cart::Cart;
use crate::models::cart::CartItem;
use crate::models::filters::Filter;
use crate::models::filters::FilterId;
use crate::models::filters::UserFilter;
use crate::models::order::Order;
use crate::models::product::Product;
use crate::models::user::UserId;
use crate::models::user::{CreateUser, LoginUser, User};
use crate::services::util::sha256_helper;

use actix_web::error::ErrorBadRequest;
use actix_web::error::ErrorInternalServerError;
use actix_web::Error as WebError;
use bson::oid::ObjectId;
use bson::{doc, Document};
use chrono::{Duration, Utc};
use futures_util::TryStreamExt;
use hmac::{Hmac, Mac};
use jwt::SignWithKey;
use mongodb::results::UpdateResult;
use mongodb::results::{DeleteResult, InsertOneResult};
use mongodb::{Client, Collection};
use sha2::Sha256;
use std::collections::BTreeMap;

const DEFAULT_MAX_PRICE: f64 = f64::MAX;

pub struct Database {
    order: Collection<Order>,
    product: Collection<Product>,
    user: Collection<User>,
    cart: Collection<Cart>,
    user_filter: Collection<UserFilter>,
}

impl Database {
    pub async fn init() -> Self {
        let uri = "mongodb://localhost:27017";
        let client = Client::with_uri_str(uri).await.unwrap();
        let db = client.database("avantis");

        let order: Collection<Order> = db.collection("orders");
        let product: Collection<Product> = db.collection("products");
        let user: Collection<User> = db.collection("users");
        let cart: Collection<Cart> = db.collection("carts");
        let user_filter: Collection<UserFilter> = db.collection("user_filters");

        Database {
            order,
            product,
            user,
            cart,
            user_filter,
        }
    }
    /// MARK: Order
    //////////////////////////////////////////////////////////////////////////////////////////
    // Order
    //////////////////////////////////////////////////////////////////////////////////////////
    pub async fn create_order(&self, order: Order) -> Result<InsertOneResult, WebError> {
        let result = self.order.insert_one(order).await.map_err(|e| {
            return actix_web::error::ErrorInternalServerError(format!(
                "Error creating order: {}",
                e
            ));
        })?;

        Ok(result)
    }

    pub async fn get_orders(&self, user_id: String) -> Result<Vec<Document>, WebError> {
        let parsed_user_id = ObjectId::parse_str(&user_id).expect("Failed to parse user_id");
        let pipeline = vec![
            doc! {
                "$match": {
                    "user_id": parsed_user_id
                },
            },
            doc! {
                "$lookup": {
                    "from": "products",
                    "localField": "order_items.product_id",
                    "foreignField": "_id",
                    "as": "product_details"
                }
            },
        ];

        let cursor = self.order.aggregate(pipeline).await.map_err(|e| {
            actix_web::error::ErrorInternalServerError(format!("Error getting orders: {}", e))
        })?;

        let order_docs: Vec<Document> = cursor.try_collect().await.map_err(|e| {
            actix_web::error::ErrorInternalServerError(format!("Error collecting orders: {}", e))
        })?;

        Ok(order_docs)
    }

    pub async fn get_order(&self, order_id: String) -> Result<Document, WebError> {
        let parsed_order_id = ObjectId::parse_str(&order_id).expect("Failed to parse order_id");

        let pipeline = vec![
            doc! {
                "$match": {
                    "_id": parsed_order_id
                }
            },
            doc! {
                "$lookup": {
                    "from": "products",
                    "localField": "order_items.product_id",
                    "foreignField": "_id",
                    "as": "product_details"
                }
            },
        ];

        let mut cursor = self.order.aggregate(pipeline).await.map_err(|e| {
            actix_web::error::ErrorInternalServerError(format!("Error getting order: {}", e))
        })?;

        let order_doc: Option<Document> = cursor.try_next().await.map_err(|e| {
            actix_web::error::ErrorInternalServerError(format!("Error collecting order: {}", e))
        })?;

        if let Some(order) = order_doc {
            return Ok(order);
        } else {
            return Err(ErrorBadRequest(format!(
                "No order with that id in database..."
            )));
        }
    }

    /// MARK: Product
    //////////////////////////////////////////////////////////////////////////////////////////
    // Product
    //////////////////////////////////////////////////////////////////////////////////////////
    pub async fn filter_products(&self, filter: Filter) -> Result<Vec<Product>, WebError> {
        let mut query = Document::new();

        if filter.max_price > 0.0 {
            query.insert(
                "price",
                doc! {
                    "$gte": filter.min_price,
                    "$lte": filter.max_price
                },
            );
        }

        if filter.min_price > 0.0 {
            query.insert(
                "price",
                doc! {
                    "$gte": filter.min_price,
                    "$lte": DEFAULT_MAX_PRICE
                },
            );
        }

        if filter.min_price > 0.0 && filter.max_price > 0.0 {
            query.insert(
                "price",
                doc! {
                    "$gte": filter.min_price,
                    "$lte": filter.max_price
                },
            );
        }

        if !filter.colors.is_empty() {
            query.insert("colors", doc! { "$in": &filter.colors });
        }

        if !filter.sizes.is_empty() {
            query.insert("sizes", doc! { "$in": &filter.sizes });
        }

        if !filter.product_type.is_empty() {
            query.insert("product_type", &filter.product_type);
        }

        if !filter.gender.is_empty() {
            query.insert("gender", doc! { "$in": &filter.gender });
        }

        let cursor = self.product.find(query).await.map_err(|e| {
            actix_web::error::ErrorInternalServerError(format!(
                "Error getting products with filter. Error: {}",
                e
            ))
        })?;

        let products: Vec<Product> = cursor.try_collect().await.map_err(|e| {
            actix_web::error::ErrorInternalServerError(format!(
                "Error collecting filtered products: {}",
                e
            ))
        })?;

        Ok(products)
    }

    pub async fn get_product(&self, product_id: String) -> Result<Product, WebError> {
        let db_product: Option<Product> = self
            .product
            .find_one(
                doc! {"_id": ObjectId::parse_str(product_id).expect("Failed to parse product_id")},
            )
            .await
            .map_err(|e| {
                return ErrorBadRequest(format!("Problem querying database for product: {}", e));
            })?;

        if let Some(product) = db_product {
            return Ok(product);
        } else {
            return Err(ErrorBadRequest(format!(
                "No product with that id in database..."
            )));
        }
    }

    /// MARK: User
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
        let query = self
            .user
            .delete_one(doc! {
                "_id": ObjectId::parse_str(user_id).expect("Failed to parse user_id")
            })
            .await;

        match query {
            Ok(res) => Ok(res),
            Err(err) => Err(ErrorInternalServerError(format!(
                "Problem while deleting user: {}",
                err
            ))),
        }
    }

    /// MARK: Cart
    //////////////////////////////////////////////////////////////////////////////////////////
    // Cart
    //////////////////////////////////////////////////////////////////////////////////////////
    pub async fn create_cart(&self, user_id: ObjectId) -> Result<(), WebError> {
        let query = self
            .cart
            .insert_one(Cart {
                _id: None,
                products: Vec::new(),
                user_id,
            })
            .await;

        match query {
            Ok(_) => Ok(()),
            Err(err) => Err(ErrorInternalServerError(err)),
        }
    }

    pub async fn delete_cart(&self, user_id: String) -> Result<(), WebError> {
        let id = ObjectId::parse_str(user_id).expect("Could not parse cart_id");
        let query = self.cart.delete_one(doc! {"user_id": id}).await;

        match query {
            Ok(_) => Ok(()),
            Err(err) => Err(ErrorInternalServerError(err)),
        }
    }

    pub async fn add_cart_item(&self, data: AddCartItems) -> Result<UpdateResult, WebError> {
        let user_id = data.user_id;
        let products: Vec<CartItem> = data.products;

        let mut last_update_result: Option<UpdateResult> = None;

        for product in products {
            let query = self
                .cart
                .update_one(
                    doc! {
                        "user_id": &user_id,
                        "products": {
                            "$elemMatch": {
                                "product_id": &product.product_id,
                                "size": &product.size
                            }
                        }
                    },
                    doc! {
                        "$inc": {
                            "products.$.quantity": product.quantity
                        }
                    },
                )
                .await;

            match query {
                Ok(update_result) => {
                    last_update_result = Some(update_result.clone());
                    if update_result.matched_count == 0 {
                        // if no matching product was found, push new product
                        self.cart
                            .update_one(
                                doc! {"user_id": &user_id},
                                doc! {"$push": {"products": product}},
                            )
                            .await
                            .map_err(|e| {
                                ErrorInternalServerError(format!(
                                    "Error pushing product to cart: {}",
                                    e
                                ))
                            })?;
                    }
                }
                Err(err) => {
                    return Err(ErrorInternalServerError(format!(
                        "Error updating product in cart: {}",
                        err
                    )))
                }
            }
        }

        match last_update_result {
            Some(result) => Ok(result),
            None => Err(ErrorInternalServerError("No updates were performed")),
        }
    }

    pub async fn delete_cart_item(&self, data: AddCartItems) -> Result<UpdateResult, WebError> {
        let user_id = data.user_id;
        let product: &CartItem = &data.products[0];

        let cart = self
            .cart
            .find_one(doc! {
                "user_id": &user_id,
                "products": {
                    "$elemMatch": {
                        "product_id": &product.product_id,
                        "size": &product.size
                    }
                }
            })
            .await
            .map_err(|e| {
                ErrorInternalServerError(format!(
                    "Error when trying to find the product in user's cart: {}",
                    e
                ))
            })?;

        if let Some(cart_doc) = cart {
            let products: Vec<CartItem> = cart_doc.products;
            let matching_products: Vec<CartItem> = products
                .into_iter()
                .filter(|p| (p.product_id == product.product_id) && (p.size == product.size))
                .collect();

            let p = &matching_products[0];

            let new_quantity = p.quantity - product.quantity;
            if new_quantity == 0 {
                let query = self
                    .cart
                    .update_one(
                        doc! {
                            "user_id": user_id
                        },
                        doc! {"$pull": {"products": {"product_id": p.product_id, "quantity": p.quantity}}},
                    )
                    .await;

                match query {
                    Ok(res) => Ok(res),
                    Err(err) => Err(ErrorInternalServerError(format!(
                        "Error decrementing product quantity in cart: {}",
                        err
                    ))),
                }
            } else {
                let query = self
                    .cart
                    .update_one(
                        doc! {
                            "user_id": &user_id,
                            "products.product_id": &product.product_id,
                            "products.size": &product.size
                        },
                        doc! {
                            "$set": {
                                "products.$.quantity": new_quantity
                            }
                        },
                    )
                    .await;

                return match query {
                    Ok(res) => Ok(res),
                    Err(err) => Err(ErrorInternalServerError(format!(
                        "Error decrementing product quantity in cart: {}",
                        err
                    ))),
                };
            }
        } else {
            return Err(ErrorInternalServerError(
                "Cart for this user does not exist ",
            ));
        }
    }

    // MARK: Filter profile
    //////////////////////////////////////////////////////////////////////////////////////////
    // Filter profile
    //////////////////////////////////////////////////////////////////////////////////////////

    pub async fn db_get_filter_profiles(&self, user: UserId) -> Result<Vec<UserFilter>, WebError> {
        let cursor = self
            .user_filter
              .find(doc! {"user_id": ObjectId::parse_str(user.user_id).expect("Failed to parse user_id")})
            .await
            .map_err(|e| {
                return actix_web::error::ErrorInternalServerError(format!(
                    "Error getting user filter profiles: {}",
                    e
                ));
            })?;

        let filters: Vec<UserFilter> = cursor.try_collect().await.map_err(|e| {
            actix_web::error::ErrorInternalServerError(format!(
                "Error collecting user filter profiles: {}",
                e
            ))
        })?;

        Ok(filters)
    }

    pub async fn db_create_filter_profile(&self, user_filter: UserFilter) -> Result<(), WebError> {
        let query = self.user_filter.insert_one(user_filter).await;

        match query {
            Ok(_) => Ok(()),
            Err(err) => Err(ErrorInternalServerError(err)),
        }
    }

    pub async fn db_delete_filter_profile(&self, filter: FilterId) -> Result<(), WebError> {
        let query = self
            .user_filter
            .delete_one(
                doc! {"_id": ObjectId::parse_str(filter.filter_id).expect("Failed to parse filter_id")},
            )
            .await;

        match query {
            Ok(_) => Ok(()),
            Err(err) => Err(ErrorInternalServerError(err)),
        }
    }
}
