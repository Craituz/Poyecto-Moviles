import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";
import {
  Text,
  useTheme,
  Searchbar,
  IconButton,
  Snackbar
} from "react-native-paper";
import { useAppContext } from "../context/AppContext";

const products = [
  {
    id: 1,
    name: "Chocoflan",
    description: "Chocoflan cremoso con caramelo.",
    price: 30.0,
    image: require("../../assets/chocoflan.jpg"),
  },
  {
    id: 2,
    name: "Pie de manzana",
    description: "Pie de manzana dulce y crujiente.",
    price: 32.0,
    image: require("../../assets/piedemanzana.jpg"),
  },
  {
    id: 3,
    name: "Cupcake de Vainilla",
    description: "Suave y esponjoso.",
    price: 15.0,
    image: require("../../assets/cupcake de vainilla.jpg"),
  },
  {
    id: 4,
    name: "Pastel de fresa",
    description: "Dulce y cremoso.",
    price: 15.0,
    image: require("../../assets/pastel-de-fresa.jpg"),
  },
];

export default function InicioScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const { addToCart } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
    setVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.productCard, { backgroundColor: colors.surface }]}>
      <Image source={item.image} style={styles.productImage} />

      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]}>
          {item.name}
        </Text>

        <Text style={[styles.productDesc, { color: colors.secondary }]}>
          {item.description}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text }]}>
            ${item.price.toFixed(2)}
          </Text>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => handleAddToCart(item)}
          >
            <IconButton
              icon="cart-plus"
              iconColor="white"
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
      >
        Tu producto ha sido añadido al carrito 🛒
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16 },
  productCard: {
    borderRadius: 15,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 150,
  },
  productInfo: { padding: 12 },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productDesc: {
    fontSize: 14,
    marginVertical: 6,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
