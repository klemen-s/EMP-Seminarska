import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();

  // Mock data (You can replace it with real API data)
  const product = {
    id,
    title: "Cool T-Shirt",
    imageUrl: 'https://www.allsaints.com/dw/image/v2/BHHD_PRD/on/demandware.static/-/Sites-allsaints-emea-master-catalog/default/dwdf676787/images/large/M059PB/162/M059PB-162-1.jpg?sw=837&sh=1046&sm=fit&q=70', // Replace with actual image URL
    price: "$25",
    sizes: ["XS", "S", "M", "L", "XL"],
  };

  // State to track selected size
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Product Image */}
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{product.price}</Text>

        {/* Size Options */}
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.sizesContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeBox,
                selectedSize === size && styles.selectedSizeBox, // Change background color when selected
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText, // Change text color when selected
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton}>
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
    height: 400, // Larger image
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
    backgroundColor: "#fff", // Default background
  },
  selectedSizeBox: {
    backgroundColor: "#000", // Highlight selected size
  },
  sizeText: {
    fontSize: 16,
    color: "#333", // Default text color
  },
  selectedSizeText: {
    color: "#fff", // Change text color when selected
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
});
