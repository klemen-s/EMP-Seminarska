import { FlatList, StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useContext } from "react";
import { getItemAsync } from "expo-secure-store";
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';
import OrderItem from "@/components/OrderItem";
import { Link, useNavigation } from "expo-router";
import { AuthContext } from "@/context/AuthContext";


export default function Orders() {
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);

    const auth = useContext(AuthContext);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const userId = await getItemAsync("userId");
                const jwt = await getItemAsync("userToken");

                const response = await fetch(`http://localhost:5001/orders?user_id=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${jwt}`
                    },
                });
                const data = await response.json();

                const orders = data.map((order) => {
                    const orderItems = order.order_items.map((orderItem) => {
                        const productDetails = order.product_details.filter((product) => orderItem.product_id.$oid === product._id.$oid);
                        return {
                            id: orderItem.product_id.$oid,
                            quantity: orderItem.quantity,
                            size: orderItem.size,
                            color: orderItem.color,
                            productName: productDetails[0].title,
                            price: productDetails[0].price,
                            productType: productDetails[0].product_type,
                            gender: productDetails[0].gender,
                            imageUrl: productDetails[0].url
                        }
                    })
                    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

                    return {
                        order_id: order._id.$oid,
                        orderItems: orderItems,
                        totalAmount: totalAmount,
                    }
                })

                setOrders(orders);
            } catch (error) {
                console.log(error);
                alert(`Something went wrong while getting user's orders: ${error}`);
                return;
            }
        }

        if (auth.userToken != null) {
            navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
        } else {
            navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
        }

        fetchOrders();
    }, []);

    return (
        orders.length !== 0 ? (
            <FlatList
                data={orders}
                renderItem={({ item }) => {
                    return <OrderItem order={item} />;
                }}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={style.container}
            />
        ) : (
            <View style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}><Text>No order history yet. Order some <Link style={{ color: "blue" }} href="/products?gender=men,women">products.</Link></Text></View>
        )
    );
}

const style = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
});