import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { setItemAsync } from "expo-secure-store";
import { AuthContext, AuthDispatchContext } from "@/context/AuthContext";
import { useNavigation, useRouter, Stack, Link } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';


export default function LoginScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authDispatch = useContext(AuthDispatchContext);
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.userToken != null) {
      navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
    } else {
      navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
    }
  }, [auth.userToken]);

  async function handleLogin() {
    try {
      if (authDispatch) {
        const res = await fetch("http://localhost:5001/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(`Network error: ${data}`);
        }

        const jwt = await res.json();
        const decoded: { id: string, name: string, email: string } = jwtDecode(jwt);

        await setItemAsync("userToken", jwt);
        await setItemAsync("userId", decoded.id);
        await setItemAsync("name", decoded.name);
        await setItemAsync("email", decoded.email);

        authDispatch({ type: "SIGN_IN", data: { jwt: jwt, userId: decoded.id, name: decoded.name, email: decoded.email } });

        router.replace("/");
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setErrorMessage("Email or password is wrong. Please try again.");
    }
  }

  return (
    <View style={style.container}>
      <Stack
        screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />
      <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>Login</Text>
      <TextInput
        numberOfLines={1}
        maxLength={40}
        onChangeText={(text) => onChangeEmail(text)}
        value={email}
        style={style.input}
        placeholder="Email"
      />
      <TextInput
        numberOfLines={1}
        maxLength={40}
        onChangeText={(text) => onChangePassword(text)}
        value={password}
        style={style.input}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "black",
          width: 90,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={handleLogin}
      >
        <Text style={{ fontSize: 16 }}>Login</Text>
      </TouchableOpacity>
      {error ? (
        <Text style={{ color: "red", marginTop: 20 }}>{errorMessage}</Text>
      ) : (
        ""
      )}
      <Text style={{ marginTop: 15 }}>No account yet?
        <Link style={{ color: "blue" }} href="/profile/register"> Sign up</Link>
      </Text>
    </View>
  );
}
const style = StyleSheet.create({
  input: {
    height: 50,
    width: "80%",
    borderWidth: 1,
    marginBottom: 50,
    padding: 10,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    marginTop: 20,
  },
});