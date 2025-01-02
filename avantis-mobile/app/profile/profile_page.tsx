import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack, useNavigation, Link } from 'expo-router';
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';
import { AuthContext, AuthDispatchContext } from '@/context/AuthContext';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';


export default function ProfilePage() {
  const router = useRouter();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


  const auth = useContext(AuthContext);
  const authDispatch = useContext(AuthDispatchContext);

  async function logoutHandler() {
    await deleteItemAsync("userId");
    await deleteItemAsync("userToken");
    authDispatch ? authDispatch({ type: "SIGN_OUT" }) : null;

    router.replace("/");
  }

  useEffect(() => {
    if (auth.userToken != null) {
      navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
    } else {
      navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
    }

    async function userData() {
      const userName = await getItemAsync("name");
      const userEmail = await getItemAsync("email");

      setName(userName!);
      setEmail(userEmail!);
    }

    userData();

  }, [auth.userToken]);



  return (
    <View style={styles.container}>
      <Stack
        screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>Please write our support team, if you want your account deleted:</Text>
        <Text style={{ marginTop: 15, fontWeight: "bold" }}>support@avantis.com</Text>
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <Link href="/profile/orders">Order history</Link>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterButton} onPress={logoutHandler}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    fontSize: 18,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 10,
    color: "white"
  },
});
