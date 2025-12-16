import React from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

export default function CarritoScreen({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  const { cart } = useAppContext();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Carrito de Compras
        </Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{cart.length} productos</Text>
        </View>
      </View>

      {cart.length === 0 ? (
        <View style={styles.content}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={100}
            color="#ccc"
          />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Tu carrito está vacío
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Inicio")}
          >
            Explorar Productos
          </Button>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={item.image} style={styles.cartImage} />
              <View>
                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                <Text>${item.price.toFixed(2)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  badgeContainer: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, color: "#555" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: "center",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  cartImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
  },
});
