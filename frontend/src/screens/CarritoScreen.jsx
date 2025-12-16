import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CarritoScreen({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Carrito de Compras</Text>
        <View style={styles.badgeContainer}>
             <Text style={styles.badgeText}>0 productos</Text>
        </View>
      </View>

      <View style={styles.content}>
        <MaterialCommunityIcons 
            name="cart-outline" 
            size={100} 
            color="#ccc" 
            style={styles.icon}
        />
        <Text style={[styles.emptyText, { color: colors.text }]}>
            Tu carrito está vacío
        </Text>
        
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Inicio")}
          style={styles.button}
          contentStyle={{ paddingVertical: 5 }}
        >
          Explorar Productos
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  badgeContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#888',
    fontSize: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    borderRadius: 25,
    paddingHorizontal: 20,
  },
});
