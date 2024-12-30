
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRouter, Stack } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';


export default function SignInPage() {
    const router = useRouter();
    const navigation = useNavigation();

    const auth = useContext(AuthContext);

    useEffect(() => {
        if (auth.userToken != null) {
            navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
        } else {
            navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
        }
    }, [auth.userToken]);

    return <View style={styles.container}>
        <Stack
            screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />

        <Text style={styles.header}>Login / Register</Text>
        <TouchableOpacity
            style={[styles.button, { marginTop: 40 }]}
            onPress={() => router.replace("/profile/login")}
        >
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/profile/register")}
        >
            <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
