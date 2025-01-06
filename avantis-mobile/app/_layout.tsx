import { useReducer, useContext, useEffect, useState, useRef } from "react";
import { Stack, useNavigation } from "expo-router";
import { TouchableOpacity, Image, View, AppState, AppStateStatus } from 'react-native';


import { cartReducer } from "@/reducers/CartReducer";
import { CartDispatchContext, CartContext } from "@/context/CartContext";

// to add auth context and reducers
import { authReducer } from "@/reducers/AuthReducer";
import { AuthContext, AuthDispatchContext } from "@/context/AuthContext";
import 'react-native-get-random-values';

export default function RootLayout() {
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);


  const [cartState, cartDispatch] = useReducer(cartReducer, { items: [], totalAmount: 0 });
  const [authState, authDispatch] = useReducer(authReducer, {
    isSignout: false,
    userToken: null,
    isLoading: true,
    userId: null
  });

  const auth = useContext(AuthContext);


  const headerOptions = {
    headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate('products/filter')}>
          <Image
            source={require('../assets/images/filter-icon.png')}
            style={{ width: 30, height: 30, marginRight: 15 }}
          />
        </TouchableOpacity>
        {auth.userToken != null ?
          (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('cart/index')}>
                <Image
                  source={require('../assets/images/shopping-cart-icon.png')}
                  style={{ width: 30, height: 30, marginRight: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('profile/profile_page')}>
                <Image
                  source={require('../assets/images/profile-icon.png')}
                  style={{ width: 30, height: 30, marginRight: 10 }}
                />
              </TouchableOpacity>
            </>) : (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('profile/sign_in')}>
                <Image
                  source={require('../assets/images/profile-icon.png')}
                  style={{ width: 30, height: 30, marginRight: 10 }}
                />
              </TouchableOpacity>
            </>
          )}
      </View>
    ),
    headerTitle: () => (
      <TouchableOpacity onPress={() => navigation.navigate('index')}>
        <Image
          source={require('../assets/images/home-icon.png')}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    ),
  }

  return (
    <AuthContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={authDispatch}>
        <CartContext.Provider value={cartState}>
          <CartDispatchContext.Provider value={cartDispatch}>
            <Stack>
              <Stack.Screen
                name="index"
                options={{ title: "Avantis", ...headerOptions }}
              />
              <Stack.Screen
                name="products/index"
                options={{ title: "Products", ...headerOptions }}
              />
              <Stack.Screen
                name="products/[id]"
                options={{ title: "Product Details", ...headerOptions }}
              />
              <Stack.Screen
                name="profile/login"
                options={{ title: 'Login', ...headerOptions }}
              />
              <Stack.Screen
                name="profile/register"
                options={{ title: 'Register', ...headerOptions }}
              />
              <Stack.Screen
                name="cart/index"
                options={{ title: 'Cart', ...headerOptions }}
              />
              <Stack.Screen
                name="profile/profile_page"
                options={{ title: 'Profile', ...headerOptions }}
              />
              <Stack.Screen
                name="profile/sign_in"
                options={{ title: 'Login/Register', ...headerOptions }}
              />
              <Stack.Screen
                name="products/filter"
                options={{ title: 'Filter', ...headerOptions }}
              />
            </Stack>
          </CartDispatchContext.Provider>
        </CartContext.Provider>
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>

  );


}