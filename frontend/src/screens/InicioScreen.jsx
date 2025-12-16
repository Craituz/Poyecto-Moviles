import React, { useState } from "react";
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Text, useTheme, Searchbar, IconButton, Button } from "react-native-paper";
import { useAppContext } from "../context/AppContext";

const products = [
  {
    id: 1,
    name: "Chocoflan",
    description: "Chocoflan cremoso con caramelo, combinado con un bizcocho de chocolate húmedo que crea un contraste delicioso.",
    price: 30.00,
    image: null, // Placeholder for image
  },
  {
    id: 2,
    name: "Pie de manzana",
    description: "Pie de manzana con relleno dulce y especiado, envuelto en una masa dorada y crujiente.",
    price: 32.00,
    image: null,
  },
  {
    id: 3,
    name: "Cupcake de Vainilla",
    description: "Suave y esponjoso con frosting de mantequilla.",
    price: 15.00,
    image: null,
  }
];

export default function InicioScreen() {
  const { user } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => setSearchQuery(query);

  const renderItem = ({ item }) => (
    <View style={[styles.productCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.imagePlaceholder, { backgroundColor: theme.dark ? '#5D4037' : '#e0e0e0' }]} /> 
        <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.productDesc, { color: colors.secondary }]} numberOfLines={2}>
                {item.description}
            </Text>
            <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.text }]}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
                    <IconButton icon="cart-plus" iconColor={theme.dark ? colors.surface : "white"} size={20} />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
             <Text style={[styles.logoText, { color: colors.text }]}>🧁 Yeli's Cake</Text>
             <Searchbar
                placeholder="Buscar productos..."
                placeholderTextColor={colors.secondary}
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={[styles.searchBar, { backgroundColor: theme.dark ? colors.background : '#f0f0f0' }]}
                inputStyle={[styles.searchInput, { color: colors.text }]}
                iconColor={colors.secondary}
                elevation={0}
             />
        </View>

        <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    paddingTop: 40, // More space for status bar
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  logoText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 10,
  },
  searchBar: {
      flex: 1,
      height: 40,
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
  },
  searchInput: {
      minHeight: 0, // Fix for searchbar height issue
  },
  listContent: {
      padding: 16,
  },
  productCard: {
      borderRadius: 15,
      marginBottom: 16,
      elevation: 3,
      overflow: 'hidden',
  },
  imagePlaceholder: {
      height: 150,
      backgroundColor: '#e0e0e0', // Grey placeholder for image
  },
  productInfo: {
      padding: 12,
  },
  productName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
  },
  productDesc: {
      fontSize: 14,
      marginBottom: 12,
  },
  priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  price: {
      fontSize: 20,
      fontWeight: 'bold',
  },
  addButton: {
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
  },
});