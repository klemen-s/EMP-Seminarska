import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const products = [
    {
      id: "1",
      imageUrl:
        "https://www.allsaints.com/dw/image/v2/BHHD_PRD/on/demandware.static/-/Sites-allsaints-emea-master-catalog/default/dw1a451423/images/large/M015TB/9527/M015TB-9527-1.jpg?sw=837&sh=1046&sm=fit&q=70",
      productName: "Product 1",
      price: "$10",
      sizes: ["XS", "S", "M", "L"],
    },
    {
      id: "2",
      imageUrl:
        "https://www.allsaints.com/dw/image/v2/BHHD_PRD/on/demandware.static/-/Sites-allsaints-emea-master-catalog/default/dwdf676787/images/large/M059PB/162/M059PB-162-1.jpg?sw=837&sh=1046&sm=fit&q=70",
      productName: "Product 2",
      price: "$20",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "3",
      imageUrl:
        "https://www.allsaints.com/dw/image/v2/BHHD_PRD/on/demandware.static/-/Sites-allsaints-emea-master-catalog/default/dwcc868fca/images/large/W014QB/5/W014QB-5-1.jpg?sw=837&sh=1046&sm=fit&q=70",
      productName: "Product 3",
      price: "$30",
      sizes: ["XS", "M", "XL"],
    },
  ];

  const product = products.find((item) => item.id === id); 

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found!</Text>
      </View>
    );
  }

  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.productName}</Text>
        <Text style={styles.price}>{product.price}</Text>

        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.sizesContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeBox,
                selectedSize === size && styles.selectedSizeBox,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            if (!selectedSize) {
              alert('Please select a size before adding to the cart!');
              return;
            }
            const addToCart = async () => {
              try {
                const cart = JSON.parse(await AsyncStorage.getItem('cart')) || [];
                const existingItemIndex = cart.findIndex(item => item.id === product.id && item.selectedSize === selectedSize);
                if (existingItemIndex > -1) {
                  cart[existingItemIndex].quantity += 1;
                } else {
                  cart.push({ ...product, selectedSize, quantity: 1 });
                }
                await AsyncStorage.setItem('cart', JSON.stringify(cart));
                Alert.alert(
                  'Product added to cart!',
                  '',
                  [
                    { text: 'OK' },
                    { text: 'Go to Cart', onPress: () => navigation.navigate('cart/index') }
                  ]
                );
              } catch (error) {
                console.error('Error adding to cart:', error);
                alert('Failed to add product to cart. Please try again.');
              }
            };
            addToCart(); // Call the function
          }}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
    marginTop: 16,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: "#333",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sizesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  sizeBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  selectedSizeBox: {
    backgroundColor: "#000",
  },
  sizeText: {
    fontSize: 16,
    color: "#333",
  },
  selectedSizeText: {
    color: "#fff",
  },
  addToCartButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
