import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FilterScreen() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const applyFilter = () => {
    navigation.navigate('products/index', { filter: selectedFilter });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Filter</Text>
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'all' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('all')}
      >
        <Text style={styles.filterButtonText}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'clothing' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('clothing')}
      >
        <Text style={styles.filterButtonText}>Clothing</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'accessories' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('accessories')}
      >
        <Text style={styles.filterButtonText}>Accessories</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.applyButton}
        onPress={applyFilter}
      >
        <Text style={styles.applyButtonText}>Apply Filter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 10,
  },
  selectedFilterButton: {
    backgroundColor: '#000',
  },
  filterButtonText: {
    color: '#000',
  },
  selectedFilterButtonText: {
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
