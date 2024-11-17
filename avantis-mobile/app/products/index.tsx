import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


import Product from "@/components/Product";
import { ScrollView } from 'react-native-gesture-handler';

export default function ProductsScreen() {
    const { gender } = useLocalSearchParams() // Used later for query param in API

    // Static for the time of setting up APIs...
    const products = [
        {
            id: '1',
            imageUrl: 'https://www.allsaints.com/dw/image/v2/BHHD_PRD/on/demandware.static/-/Sites-allsaints-emea-master-catalog/default/dw1a451423/images/large/M015TB/9527/M015TB-9527-1.jpg?sw=837&sh=1046&sm=fit&q=70',
            productName: 'Product 1',
            price: '$10',
        },
        {
            id: '2',
            imageUrl: 'https://www.allsaints.com/dw/image/v2/BHHD_PRD/on/demandware.static/-/Sites-allsaints-emea-master-catalog/default/dwdf676787/images/large/M059PB/162/M059PB-162-1.jpg?sw=837&sh=1046&sm=fit&q=70',
            productName: 'Product 2',
            price: '$20',
        },
        {
            id: '3',
            imageUrl: 'https://www.allsaints.com/dw/image/v2/BHHD_PRD/on/demandware.static/-/Sites-allsaints-emea-master-catalog/default/dwcc868fca/images/large/W014QB/5/W014QB-5-1.jpg?sw=837&sh=1046&sm=fit&q=70',
            productName: 'Product 3',
            price: '$30',
        },]

    return (
            <FlatList
                data={products}
                renderItem={function ({ item: product, index }) {
                    if (index === 0) {
                        return <Product
                            productName={product.productName}
                            imageUrl={product.imageUrl}
                            price={product.price}
                            id={product.id}
                            marginTop={0}
                        />
                    }

                    return <Product
                        productName={product.productName}
                        imageUrl={product.imageUrl}
                        price={product.price}
                        id={product.id}
                    />
                }}
            />
    );
}