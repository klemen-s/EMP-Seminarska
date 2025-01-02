import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, Stack } from 'expo-router';
import { Checkbox } from 'expo-checkbox';
import { AuthContext } from '@/context/AuthContext';
import { getHeaderOptionsLoggedIn, getHeaderOptionsLoggedOut } from '@/components/navigation/NavbarSettings';
import Product from '@/components/Product';
import { Product as ProductType } from '@/types';


export default function FilterScreen() {
  const navigation = useNavigation();

  const auth = useContext(AuthContext);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [filterOptions, setFilterOptions] = useState<{
    sizes: string[],
    colors: string[],
    min_price: string,
    max_price: string,
    product_types: string[],
    gender: string[]
  }>({
    sizes: [],
    colors: [],
    min_price: "",
    max_price: "",
    product_types: [],
    gender: []
  });

  // Users chosen filters
  const [filter, setFilter] = useState<{
    sizes: string[],
    colors: string[],
    min_price: string,
    max_price: string,
    product_types: string[],
    genders: string[]
  }>({
    sizes: [],
    colors: [],
    min_price: "",
    max_price: "",
    product_types: [],
    genders: []
  });


  useEffect(() => {
    async function getFilters() {
      const res = await fetch("http://localhost:5001/filter", {
        method: "GET"
      });
      const filters = await res.json()
      setFilterOptions(filters);
    }

    getFilters();

    if (auth.userToken != null) {
      navigation.setOptions({ ...getHeaderOptionsLoggedIn(navigation) });
    } else {
      navigation.setOptions({ ...getHeaderOptionsLoggedOut(navigation) });
    }
  }, [])

  function colorsHandler(color: string, value: boolean) {
    if (value) {
      setFilter((prevState) => ({ ...prevState, colors: [...prevState.colors, color] }));
    } else {
      const colors = filter.colors.filter((c) => c !== color);
      setFilter((prevState) => ({ ...prevState, colors: colors }));
    }
  }

  function sizesHandler(size: string, value: boolean) {
    if (value) {
      setFilter((prevState) => ({ ...prevState, sizes: [...prevState.sizes, size] }));
    } else {
      const sizes = filter.sizes.filter((s) => s !== size);
      setFilter((prevState) => ({ ...prevState, sizes: sizes }));
    }
  }

  function productTypeHandler(productType: string, value: boolean) {
    if (value) {
      setFilter((prevState) => ({ ...prevState, product_types: [...prevState.product_types, productType] }));
    } else {
      const productTypes = filter.product_types.filter((pt) => pt !== productType);
      setFilter((prevState) => ({ ...prevState, product_types: productTypes }));
    }
  }

  function genderHandler(gender: string, value: boolean) {
    if (value) {
      setFilter((prevState) => ({ ...prevState, genders: [...prevState.genders, gender] }));
    } else {
      const genders = filter.genders.filter((g) => g !== gender);
      setFilter((prevState) => ({ ...prevState, genders: genders }));
    }
  }

  async function filterHandler() {

    const res = await fetch("http://localhost:5001/products", {
      method: "POST",
      headers:
        { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...filter,
        min_price: parseInt(filter.min_price) || 0,
        max_price: parseInt(filter.max_price) || 0
      })
    })

    const data = await res.json();
    const productsData = data.map((product: any) => ({
      id: product._id.$oid,
      price: product.price,
      productName: product.title,
      imageUrl: product.url,
      sizes: product.sizes,
      productType: product.product_type,
      colors: product.colors,
    }));

    setShowFilters(false);
    setProducts(productsData);
  }

  function toggleShowFilters() {
    setShowFilters((prevState) => !prevState);
  }

  return (
    showFilters ? (
      <ScrollView style={{ padding: 20, height: "auto" }}>
        <Stack
          screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />

        <View style={styles.section}>
          <Text style={styles.heading}>Price Range</Text>
          <View style={styles.priceContainer}>
            <TextInput
              style={styles.priceInput}
              keyboardType="numeric"
              placeholder="Min"
              value={filter.min_price.toString()}
              onChangeText={(text) => setFilter((prevState) => ({ ...prevState, min_price: text }))}
            />
            <TextInput
              style={styles.priceInput}
              keyboardType="numeric"
              placeholder="Max"
              value={filter.max_price.toString()}
              onChangeText={(text) => setFilter((prevState) => ({ ...prevState, max_price: text }))}
            />
          </View>
        </View>
        <Text style={styles.title}>Choose filters</Text>
        <View style={styles.section}>
          <Text style={styles.heading}>Sizes</Text>
          <ScrollView style={styles.flatlist}>
            {filterOptions.sizes.map((item, index) => (
              <View key={index} style={styles.checkboxSection}>
                <Checkbox
                  style={styles.checkbox}
                  value={filter.sizes.includes(item)}
                  onValueChange={(value) => sizesHandler(item, value)}
                />
                <Text style={styles.paragraph}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Colors</Text>
          <ScrollView style={styles.flatlist}>
            {filterOptions.colors.map((item, index) => (
              <View key={index} style={styles.checkboxSection}>
                <Checkbox
                  style={styles.checkbox}
                  value={filter.colors.includes(item)}
                  onValueChange={(value) => colorsHandler(item, value)}
                />
                <Text style={styles.paragraph}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Product Types</Text>
          <ScrollView style={styles.flatlist}>
            {filterOptions.product_types.map((item, index) => (
              <View key={index} style={styles.checkboxSection}>
                <Checkbox
                  style={styles.checkbox}
                  value={filter.product_types.includes(item)}
                  onValueChange={(value) => productTypeHandler(item, value)}
                />
                <Text style={styles.paragraph}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Gender</Text>
          <ScrollView style={styles.flatlist}>
            {filterOptions.gender.map((item, index) => (
              <View key={index} style={styles.checkboxSection}>
                <Checkbox
                  style={styles.checkbox}
                  value={filter.genders.includes(item)}
                  onValueChange={(value) => genderHandler(item, value)}
                />
                <Text style={styles.paragraph}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity onPress={filterHandler} style={styles.applyButton}><Text style={styles.applyButtonText}>Apply filter</Text></TouchableOpacity>
      </ScrollView >
    ) : (
      (
        products.length !== 0 ?
          (
            <>
              <TouchableOpacity style={[styles.applyButton, { marginBottom: 0, borderRadius: 0 }]} onPress={toggleShowFilters}>
                <Text style={styles.applyButtonText}>Back to filter</Text>
              </TouchableOpacity>
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
                  <Stack
                    screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />
                  return <Product
                    productName={product.productName}
                    imageUrl={product.imageUrl}
                    price={product.price}
                    id={product.id}
                  />
                }}
              />
            </>
          ) : (
            <View style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <Stack
                screenOptions={auth.userToken != null ? getHeaderOptionsLoggedIn(navigation) : getHeaderOptionsLoggedOut(navigation)} />
              <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 15 }}>Filters apply to no products. Use a different filter.</Text>
              <TouchableOpacity style={styles.applyButton} onPress={toggleShowFilters}><Text style={styles.applyButtonText}>Back to filter</Text></TouchableOpacity>
            </View>
          )
      )
    )
  );
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  checkboxSection: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 4
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold"
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    marginHorizontal: 8
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 50
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatlist: {
    flexGrow: 0,
    width: "50%",
    maxHeight: 200
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  priceInput: {
    width: 100,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
  },
});
