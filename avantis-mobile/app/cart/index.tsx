import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShoppingCartItem from '../../components/ShoppingCartItem';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);


  // Fetch cart items from AsyncStorage
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleUpdateQuantity = async (id: string, selectedSize: string, operation: 'increase' | 'decrease') => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? {
              ...item,
              quantity:
                operation === 'increase'
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : item.quantity,
            }
          : item
      );
      updateCartStorage(updatedCart);
      return updatedCart;
    });
  };

  const handleRemoveItem = async (id: string, selectedSize: string) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => !(item.id === id && item.selectedSize === selectedSize));
      updateCartStorage(updatedCart);
      return updatedCart;
    });
  };

  const updateCartStorage = async (updatedCart: any[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error updating cart in AsyncStorage:', error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price.replace('$', '')) * item.quantity, 0).toFixed(2);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => `${item.id}-${item.selectedSize}`} // Use combination of id and selectedSize as key
        renderItem={({ item }) => (
          <ShoppingCartItem
            productName={item.productName}
            imageUrl={item.imageUrl}
            price={item.price}
            id={item.id}
            quantity={item.quantity}
            selectedSize={item.selectedSize} // Pass the selected size
            onRemove={(id, selectedSize) => handleRemoveItem(id, selectedSize)}
            onIncrease={(id, selectedSize) => handleUpdateQuantity(id, selectedSize, 'increase')}
            onDecrease={(id, selectedSize) => handleUpdateQuantity(id, selectedSize, 'decrease')}
          />
        )}
      />
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc', backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Total Price: {calculateTotalPrice()} €
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#000',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}
          onPress={() => alert('Proceed to Checkout')}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
