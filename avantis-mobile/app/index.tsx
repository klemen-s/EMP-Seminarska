import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Link, useNavigation, Stack } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';


export default function Index() {
  const navigation = useNavigation();

  const [gender, setGender] = useState('men');
  const auth = useContext(AuthContext);
  const [quote, setQuote] = useState("");

  function rand_quote(quotes) {
    return quotes[~~(quotes.length * Math.random())];
  }

  useEffect(() => {
    if (auth.userToken != null) {
      navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
    } else {
      navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
    }

    async function getQuotes() {
      let rapidApiKey = process.env.RAPIDAPI_KEY;

      try {
        const data = null;

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
          if (this.readyState === this.DONE) {
            let data = this.responseText;

            const json = JSON.parse(data);
            const quotes = json.filter((quote) => {
              return quote.quote.length < 50
            })
            const quote = rand_quote(quotes);
            setQuote(quote.quote);
          }
        });

        xhr.open('GET', 'https://the-personal-quotes.p.rapidapi.com/quotes/tags/happiness');
        xhr.setRequestHeader('x-rapidapi-key', rapidApiKey || '');
        xhr.setRequestHeader('x-rapidapi-host', 'the-personal-quotes.p.rapidapi.com');

        xhr.send(data);
      } catch (error) {
        console.log(error);
      }

    }

    getQuotes();
  }, [auth.userToken]);

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />
      <Image
        source={require('../assets/images/avantis-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.shopForText}>Shop for {gender.split(",").map((g) => g.charAt(0).toUpperCase() + g.slice(1)).join(" and ")}</Text>
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
          style={[styles.genderButton, gender === 'men,women' && styles.selectedButton, styles.rightButton]}
          onPress={() => setGender("men,women")}
        >
          <Image
            source={require('../assets/images/other-icon.png')}
            style={[styles.icon, gender === 'men,women' && styles.selectedIcon]}
          />
        </TouchableOpacity>
      </View>
      <Link href={`/products?gender=${gender}`} style={styles.button}>
        Go shop
      </Link>
      <Text>{quote}</Text>
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
