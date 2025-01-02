import { FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useNavigation } from 'expo-router';
import { useContext, useEffect, useState } from 'react';

import Product from '@/components/Product';
import { Product as ProductType } from '@/types';
import { AuthContext } from '@/context/AuthContext';
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';


export default function ProductsScreen() {
    const navigation = useNavigation();
    const { gender } = useLocalSearchParams<{ gender: string }>()


    const auth = useContext(AuthContext);
    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5001/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "min_price": 0,
                        "max_price": 0,
                        "colors": [],
                        "sizes": [],
                        "product_types": [],
                        "genders": gender.split(",").map(g => g),
                    })
                });

                const data = await response.json();


                const productsData = data.map((product: any) => ({
                    id: product._id.$oid,
                    price: product.price,
                    productName: product.title,
                    imageUrl: product.url,
                    sizes: product.sizes,
                    productType: product.product_type,
                    colors: product.colors,
                }));

                setProducts(productsData);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        if (auth.userToken != null) {
            navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
        } else {
            navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
        }

        fetchProducts();
    }, [gender, auth.userToken]);

    return (
        <>
            <Stack
                screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />

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
        </>
    );
}