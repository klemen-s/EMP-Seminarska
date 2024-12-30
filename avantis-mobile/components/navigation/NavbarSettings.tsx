import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

export const getHeaderOptionsLoggedIn = (navigation: NavigationProp<any>) => ({
  headerRight: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => navigation.navigate('products/filter')}>
        <Image
          source={require('@/assets/images/filter-icon.png')}
          style={{ width: 30, height: 30, marginRight: 15 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('cart/index')}>
        <Image
          source={require('@/assets/images/shopping-cart-icon.png')}
          style={{ width: 30, height: 30, marginRight: 20 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('profile/profile_page')}>
        <Image
          source={require('@/assets/images/profile-icon.png')}
          style={{ width: 30, height: 30, marginRight: 10 }}
        />
      </TouchableOpacity>
    </View>
  ),
  headerTitle: () => (
    <TouchableOpacity onPress={() => navigation.navigate('index')}>
      <Image
        source={require('@/assets/images/home-icon.png')}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
  ),
});

export const getHeaderOptionsLoggedOut = (navigation: NavigationProp<any>) => ({
  headerRight: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => navigation.navigate('products/filter')}>
        <Image
          source={require('@/assets/images/filter-icon.png')}
          style={{ width: 30, height: 30, marginRight: 15 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('profile/sign_in')}>
        <Image
          source={require('@/assets/images/profile-icon.png')}
          style={{ width: 30, height: 30, marginRight: 10 }}
        />
      </TouchableOpacity>
    </View>
  ),
  headerTitle: () => (
    <TouchableOpacity onPress={() => navigation.navigate('index')}>
      <Image
        source={require('@/assets/images/home-icon.png')}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
  ),
});