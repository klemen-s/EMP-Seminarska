import { Stack } from "expo-router";
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export default function RootLayout() {
  const navigation = useNavigation();

  useEffect(() => {
    let subscription;
    const subscribe = () => {
      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const totalForce = Math.sqrt(x * x + y * y + z * z);
        if (totalForce > 1.5) { 
          console.log("test");
          navigation.goBack();
        }
      });
      Accelerometer.setUpdateInterval(1000);
    };

    subscribe();
    return () => subscription && subscription.remove();
  }, [navigation]);

  const headerOptions = {
    headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate('products/filter')}>
          <Image
            source={require('../assets/images/filter-icon.png')}
            style={{ width: 30, height: 30, marginRight: 20 }}
          />
        </TouchableOpacity>
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
  };

  return (
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
        name="products/filter" 
        options={{ title: 'Filter', ...headerOptions }} 
      />
    </Stack>
  );
}