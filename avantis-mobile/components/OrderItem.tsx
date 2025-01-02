import { Text, View, Image, FlatList } from "react-native";


export default function OrderItem({ order }) {
    return (
        <View style={{ marginVertical: 30, minHeight: 150 }}>
            <Text style={{ marginBottom: 10, fontWeight: 500 }}>
                Order Id: {order.order_id}
            </Text>
            <FlatList
                data={order.orderItems}
                renderItem={({ item }) => {
                    return (
                        <View
                            style={{
                                width: 320,
                                marginBottom: 10,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: " black",
                            }}
                        >
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={{ height: "100%", width: 80, resizeMode: "cover" }}
                            />
                            <View
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    height: "100%",
                                    width: "100%",
                                    marginLeft: 10,
                                    padding: 10,
                                    flex: 1,
                                }}
                            >
                                <Text style={{ fontSize: 15, fontWeight: 500 }}>
                                    {item.productName}
                                </Text>
                                <Text style={{ fontSize: 12 }}>Quantity: {item.quantity}</Text>
                                <Text style={{ fontSize: 12 }}>Size: {item.size}</Text>
                                <Text style={{ fontSize: 12 }}>Price: {item.price}€</Text>
                            </View>
                        </View>
                    );
                }}
                style={{ marginBottom: 15 }}
                keyExtractor={(item, index) => index}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Total: {order.totalAmount}€</Text>

        </View>
    );
}