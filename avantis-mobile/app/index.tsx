import { View, StyleSheet } from "react-native";
import { Link } from 'expo-router';


export default function Index() {
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link href='/men' style={styles.button}>
        Men
      </Link>
      <Link href="/women" style={styles.button}>
        Women
      </Link>
      <Link href="/login" style={styles.button}>
        Login
      </Link>
      <Link href="/register" style={styles.button}>
        Register
      </Link>
    </View >
  );
}

const styles = StyleSheet.create({
  "button": {
    backgroundColor: 'white',
    width: 130,
    height: 35,
    margin: 15,
    shadowColor: 'black',
    borderColor: 'black',
    borderWidth: 1,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 34
  }
})
