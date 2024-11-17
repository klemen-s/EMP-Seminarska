import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProductsScreen() {
    const { id } = useLocalSearchParams()

    return (
        <View>
            <Text>Product Details</Text>
        </View>
    );
}