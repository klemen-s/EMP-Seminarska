import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRouter, Stack } from "expo-router";
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';
import { AuthContext } from "@/context/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const auth = useContext(AuthContext);

  const [name, onChangeName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [confirmPassword, onChangeConfirmPassword] = useState("");

  const [isNameCorrect, setIsNameCorrect] = useState(true);
  const [isEmailCorrect, setIsEmailCorrect] = useState(true);
  const [isPasswordCorrect, setisPasswordCorrect] = useState(true);
  const [isConfirmPasswordCorrect, setisConfirmPasswordCorrect] =
    useState(true);

  async function handleRegister() {
    if (name === null || name.length === 0) {
      setIsNameCorrect(false);
      return;
    }

    if (email === null || email.length === 0 || !email.includes("@")) {
      setIsEmailCorrect(false);
      return;
    }

    if (password === null || password.length === 0) {
      setisPasswordCorrect(false);
      return;
    }

    if (confirmPassword === null || confirmPassword.length === 0) {
      setisConfirmPasswordCorrect(false);
      return;
    }

    if (password != confirmPassword) {
      setisConfirmPasswordCorrect(false);
      return;
    }

    if (password === confirmPassword) {
      setisPasswordCorrect(true);
      setisConfirmPasswordCorrect(true);
    }

    const response = await fetch("http://localhost:5001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
        confirm_password: password,
      }),
    });

    const data = await response.json();

    const emailErr = data.includes("Email already exists...");
    const passwordError = data.includes("Passwords do not match...");
    if (emailErr) {
      setIsEmailCorrect(false);
      return;
    } else if (passwordError) {
      setisPasswordCorrect(false);
      setisConfirmPasswordCorrect(false);
      return;
    }

    router.replace("/profile/login");

  }

  useEffect(() => {
    if (auth.userToken != null) {
      navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
    } else {
      navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
    }
  }, [auth.userToken]);

  return (
    <ScrollView>
      <View style={style.container}>
        <Stack
          screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />

        <Text style={style.header}>Register</Text>
        {!isNameCorrect && (
          <Text style={style.errorMessage}>Incorrect input for Name.</Text>
        )}
        <TextInput
          numberOfLines={1}
          maxLength={40}
          onChangeText={(text) => {
            onChangeName(text);

            if (text.length < 3) setIsNameCorrect(false);
            else setIsNameCorrect(true);
          }}
          value={name}
          style={style.input}
          placeholder="Name"
        />
        {!isEmailCorrect && (
          <Text style={style.errorMessage}>
            Incorrect Email or Email is already in use.
          </Text>
        )}
        <TextInput
          numberOfLines={1}
          maxLength={40}
          onChangeText={(text) => {
            onChangeEmail(text);

            if (text.length < 1) setIsEmailCorrect(false);
            else setIsEmailCorrect(true);
          }}
          value={email}
          style={style.input}
          placeholder="Email"
        />
        {!isPasswordCorrect && (
          <Text style={style.errorMessage}>Incorrect input for password.</Text>
        )}
        <TextInput
          numberOfLines={1}
          maxLength={40}
          onChangeText={(text) => {
            onChangePassword(text);

            if (text.length < 7) setisPasswordCorrect(false);
            else setisPasswordCorrect(true);
          }}
          value={password}
          style={style.input}
          placeholder="Password"
          secureTextEntry={true}
        />
        {!isConfirmPasswordCorrect && (
          <Text style={style.errorMessage}>
            Wrong input for password or passwords do not match.
          </Text>
        )}
        <TextInput
          numberOfLines={1}
          maxLength={40}
          onChangeText={(text) => {
            onChangeConfirmPassword(text);

            if (text.length < 7) setisConfirmPasswordCorrect(false);
            else setisConfirmPasswordCorrect(true);
          }}
          value={confirmPassword}
          style={style.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
        />

        <TouchableOpacity
          onPress={handleRegister}
          style={{
            borderWidth: 1,
            borderColor: "black",
            width: 90,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  input: {
    height: 50,
    width: "80%",
    borderWidth: 1,
    marginBottom: 50,
    padding: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    marginTop: 30
  },

  errorMessage: {
    textAlign: "left",
    width: "80%",
    marginBottom: 5,
    color: "red",
  },
});