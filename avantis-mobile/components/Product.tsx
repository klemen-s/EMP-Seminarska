import React from 'react';
import { Image, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { ProductProps } from '@/types';

// This is displayed on "product" page...
export default function Product({ productName, imageUrl, id, price, marginTop }: ProductProps) {
    return (
        <View
            style={{
                width: '100%',
                maxHeight: 700,
                marginTop: marginTop ?? 150
            }}
        >
            <Image
                style={{
                    width: '100%',
                    height: 400,
                    resizeMode: 'cover',
                }}
                source={{ uri: imageUrl }}
            />
            <View
                style={{
                    backgroundColor: "#d3d3d3",
                    height: 90,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    paddingVertical: 10,
                }}
            >
                <Text style={{ fontSize: 25, fontWeight: '600' }}>{productName}</Text>
                <Text style={{ fontSize: 20, marginTop: 5 }}>{price}€</Text>
            </View>
            <Link
                href={`/products/${id}`}
                style={{
                    backgroundColor: "#e0e0e0",
                    width: '100%',
                    fontSize: 20,
                    textAlign: "center",
                    paddingVertical: 15,
                    borderRadius: 1,
                    borderTopColor: "#999999",
                    borderTopWidth: 1,
                    borderBottomColor: "#999999",
                    borderBottomWidth: 1,
                }}>
                Details
            </Link>
        </View>
    );
};