import React, { useState, useContext, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import ShoppingCartItem from '@/components/ShoppingCartItem';
import { useNavigation, useRouter, Stack } from 'expo-router';
import { ObjectId } from "bson";
import { getItemAsync } from "expo-secure-store";
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';
import { CartContext, CartDispatchContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';


export default function CartScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const cart = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const auth = useContext(AuthContext);

  const [checkoutError, setCheckoutError] = useState(false);
  const [isCartEmpty, setIsCartEmpty] = useState(true);


  async function handleCheckout() {
    if (cart.items.length === 0) {
      setCheckoutError(true);
    } else {
      setCheckoutError(false);
    }

    try {

      let userId = await getItemAsync("userId");
      let jwt = await getItemAsync("userToken");

      if (cartDispatch) {
        const order_items = cart.items.map((item) => {
          return {
            size: item.size,
            quantity: item.quantity,
            color: item.color,
            product_id: new ObjectId(item.id)
          }

        })
        const res = await fetch("http://localhost:5001/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            user_id: new ObjectId(userId!), order_items: order_items
          }),
        });


        await res.json();

        cartDispatch({ type: "CHECKOUT" });
        router.replace("/profile/orders");
      }
    } catch (error) {
      setCheckoutError(true);
    }
  }

  useEffect(() => {
    if (cart.items.length === 0) setIsCartEmpty(true);
    else setIsCartEmpty(false);

    if (auth.userToken != null) {
      navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
    } else {
      navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
    }
  }, [cart, auth.userToken]);

  return (

    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />
      {!isCartEmpty && (
        <FlatList
          data={cart.items}
          keyExtractor={(item) => `${item.id}-${item.size}-${item.color}`}
          renderItem={({ item }) => (
            <ShoppingCartItem
              id={item.id}
              productName={item.name}
              imageUrl={item.imageUrl}
              price={item.price}
              quantity={item.quantity}
              size={item.size}
              color={item.color}
            />
          )}
        />)}
      {isCartEmpty && (
        <View
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Cart is empty.</Text>
        </View>
      )}
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc', backgroundColor: '#f9f9f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Total Price: {cart.totalAmount} €
        </Text>
        {checkoutError && (
          <Text
            style={{
              textAlign: "left",
              width: 250,
              marginVertical: 5,
              color: "red",
            }}
          >
            An error occured, please try again.
          </Text>
        )}
        {!isCartEmpty && <TouchableOpacity
          style={{
            backgroundColor: '#000',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}
          onPress={handleCheckout}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Checkout</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
}
