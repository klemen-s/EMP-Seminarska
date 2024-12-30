import { FlatList, StyleSheet } from "react-native";
import { useState, useEffect, useContext } from "react";
import { getItemAsync } from "expo-secure-store";
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';
import OrderItem from "@/components/OrderItem";
import { useNavigation } from "expo-router";
import { AuthContext } from "@/context/AuthContext";


export default function Orders() {
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);

    const auth = useContext(AuthContext);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const userId = await getItemAsync("userId");

                const response = await fetch("http://localhost:5001/orders", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userId }),
                });

                const orders = await response.json();

                setOrders(orders);
            } catch (error) {
                console.log(error);
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
        <FlatList
            data={orders}
            renderItem={({ item, index }) => {
                return <OrderItem order={item} />;
            }}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={style.container}
        />
    );
}

const style = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 30,
    },
});