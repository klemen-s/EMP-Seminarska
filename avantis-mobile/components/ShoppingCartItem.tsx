import { useContext } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';

import { ShoppingCartItemProps } from '@/types';
import { CartDispatchContext } from '@/context/CartContext';

// This is displayed in the shopping cart...
export default function ShoppingCartItem({
    id,
    productName,
    imageUrl,
    price,
    quantity,
    size,
    color
}: ShoppingCartItemProps) {
    const cartDispatch = useContext(CartDispatchContext);

    function handleRemoveItem() {
        if (cartDispatch) {
            cartDispatch({ type: "REMOVE", product: { id: id, size: size, color: color } })
        }
        else {
            alert("Internal problem: Could not remove item...")
        };
    }


    return (
        <View
            style={{
                width: '100%',
                maxHeight: 180,
                marginTop: 20,
                backgroundColor: '#f9f9f9',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Image
                style={{
                    width: 100,
                    height: 100,
                    resizeMode: 'cover',
                    marginRight: 10,
                }}
                source={{ uri: imageUrl }}
            />
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: '600' }}>{productName}</Text>
                <Text style={{ fontSize: 18, marginTop: 5, fontWeight: "bold" }}>Price: {price}€</Text>
                <Text style={{ fontSize: 18, marginTop: 5 }}>Size: {size}</Text>
                <Text style={{ fontSize: 18, marginTop: 5 }}>Color: {color}</Text>
            </View>
            <View
                style={{
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: '#ffcccc',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderRadius: 5,
                        marginBottom: 10,
                    }}
                    onPress={handleRemoveItem}
                >
                    <Text style={{
                        fontWeight: '600', fontSize: 16, textAlign: 'center',
                    }}>Remove</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{quantity}</Text>
            </View>
        </View>
    );
}