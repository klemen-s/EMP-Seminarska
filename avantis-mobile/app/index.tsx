import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
  const [gender, setGender] = useState('men');

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require('../assets/images/avantis-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.shopForText}>Shop for {gender.charAt(0).toUpperCase() + gender.slice(1)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'men' && styles.selectedButton, styles.leftButton]}
          onPress={() => setGender('men')}
        >
          <Image
            source={require('../assets/images/man-icon.png')}
            style={[styles.icon, gender === 'men' && styles.selectedIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'women' && styles.selectedButton, styles.middleButton]}
          onPress={() => setGender('women')}
        >
          <Image
            source={require('../assets/images/woman-icon.png')}
            style={[styles.icon, gender === 'women' && styles.selectedIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'other' && styles.selectedButton, styles.rightButton]}
          onPress={() => setGender('other')}
        >
          <Image
            source={require('../assets/images/other-icon.png')}
            style={[styles.icon, gender === 'other' && styles.selectedIcon]}
          />
        </TouchableOpacity>
      </View>
      <Link href={`/products?gender=${gender}`} style={styles.button}>
        Go shop
      </Link>
    </View >
  );
}

const styles = StyleSheet.create({
  "button": {
    backgroundColor: 'white',
    width: 130,
    height: 35,
    margin: 20,
    shadowColor: 'black',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 34
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    tintColor: 'black',
  },
  shopForText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  genderButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  middleButton: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  rightButton: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#000',
  },
  icon: {
    width: 24,
    height: 24,
  },
  selectedIcon: {
    tintColor: '#fff',
  }
});
