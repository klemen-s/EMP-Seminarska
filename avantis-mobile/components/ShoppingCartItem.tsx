import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';

interface ShoppingCartItemProps {
    productName: string;
    imageUrl: string;
    id: string;
    price: string;
    quantity: number;
    selectedSize: string; // Add selectedSize prop
    marginTop?: number;
    onRemove: (id: string, selectedSize: string) => void;
    onIncrease: (id: string, selectedSize: string) => void;
    onDecrease: (id: string, selectedSize: string) => void;
}

// This is displayed in the shopping cart...
export default function ShoppingCartItem({ 
    productName, 
    imageUrl, 
    id, 
    price, 
    quantity, 
    selectedSize, // Destructure selectedSize
    marginTop,
    onRemove,
    onIncrease,
    onDecrease,
}: ShoppingCartItemProps) {
    return (
        <View
            style={{
                width: '100%',
                maxHeight: 180,
                marginTop: marginTop ?? 20,
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
                <Text style={{ fontSize: 18, marginTop: 5 }}>Price: {price}</Text>
                <Text style={{ fontSize: 18, marginTop: 5 }}>Size: {selectedSize}</Text> 
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
                        fontWeight: '600',
                        textAlign: 'center',
                        marginBottom: 10,
                    }}
                    onPress={() => onRemove(id, selectedSize)}
                >
                    <Text style={{ fontWeight: '600', fontSize: 16 }}>Remove</Text>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#e0e0e0',
                            paddingVertical: 5,
                            paddingHorizontal: 15,
                            borderRadius: 5,
                            marginHorizontal: 5,
                        }}
                        onPress={() => onDecrease(id, selectedSize)}
                    >
                        <Text style={{ fontWeight: '600', fontSize: 16 }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{quantity}</Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#e0e0e0',
                            paddingVertical: 5,
                            paddingHorizontal: 15,
                            borderRadius: 5,
                            marginHorizontal: 5,
                        }}
                        onPress={() => onIncrease(id, selectedSize)}
                    >
                        <Text style={{ fontWeight: '600', fontSize: 16 }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}