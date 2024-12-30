import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useNavigation, Stack } from "expo-router";
import { Product } from "@/types";
import { CartDispatchContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';


export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const cartDispatch = useContext(CartDispatchContext);
  const auth = useContext(AuthContext);


  const handleCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to the cart!');
      return;
    }
    if (!selectedColor) {
      alert("Please select the product color...");
      return;
    }

    if (cartDispatch) {
      cartDispatch({
        type: "ADD",
        product: {
          productName: product?.productName,
          size: selectedSize,
          quantity: 1,
          imageUrl: product?.imageUrl,
          price: product?.price,
          color: selectedColor,
          id: product?.id,
        },
      });

    }

    setSelectedSize(null);
    setSelectedColor(null);
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5001/product?product_id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        const productData: Product = {
          id: data._id.$oid,
          imageUrl: data.url || 'default-image-url',
          productName: data.title,
          price: data.price,
          sizes: data.sizes,
          productType: data.product_type,
          colors: data.colors,
        };

        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (auth.userToken != null) {
      navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
    } else {
      navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
    }

    fetchProduct();
  }, [id, auth.userToken]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Stack
          screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />

        <Text style={styles.errorText}>Product not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack
        screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.productName}</Text>
        <Text style={styles.price}>{product.price}€</Text>
        <Text style={styles.productType}>{product.productType}</Text>

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

        <Text style={styles.sectionTitle}>Colors</Text>
        <View style={styles.sizesContainer}>
          {product.colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorBox,
                selectedColor === color && styles.selectedSizeBox,
              ]}
              onPress={() => setSelectedColor(color)}
            >
              <Text
                style={[
                  styles.sizeText,
                  selectedColor === color && styles.selectedSizeText,
                ]}
              >
                {color}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleCart}
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
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  productType: {
    fontSize: 12,
    marginBottom: 16,
    fontStyle: "italic"

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
  colorBox: {
    paddingHorizontal: 5,
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
