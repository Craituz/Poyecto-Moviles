import React, { useMemo, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Image, Alert } from "react-native";
import { Text, Button, useTheme, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient";
import { getFontSize, getContrastStyle } from "../services/fontSizeHelper";

export default function CarritoScreen({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;

  const { cart, removeFromCart, clearCart, user, fontSize, contrast } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState("domicilio");

  const safeCart = cart || [];

  const total = useMemo(() => {
    return safeCart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);
  }, [safeCart]);

  const fetchDeliveryCoordinates = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Activa el permiso de ubicación para entregas a domicilio.");
        return null;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
      };
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación. Intenta nuevamente.");
      return null;
    }
  }, []);

  const handleCheckout = (selectedDeliveryType) => {
    const typeToUse = selectedDeliveryType || deliveryType;

    if (!user.address || !user.phone) {
      Alert.alert(
        "Faltan Datos",
        "Para realizar un pedido, necesitamos tu dirección y teléfono. Por favor actualiza tu perfil.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Ir a Perfil", onPress: () => navigation.navigate("Perfil") },
        ]
      );
      return;
    }

    Alert.alert(
      "Confirmar Compra",
      `¿Procesar pedido por $${total.toFixed(2)}?\nTipo: ${typeToUse === "domicilio" ? "Entrega a Domicilio" : "Retiro en Local"}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Comprar",
          onPress: async () => {
            setLoading(true);
            try {
              setDeliveryType(typeToUse);

              const coords = typeToUse === "domicilio" ? await fetchDeliveryCoordinates() : null;
              if (typeToUse === "domicilio" && !coords) {
                setLoading(false);
                return;
              }

              const orderData = {
                total,
                address: user.address,
                phone: user.phone,
                delivery_type: typeToUse,
                latitude: coords?.latitude || null,
                longitude: coords?.longitude || null,
                items: safeCart.map((item) => ({
                  product_id: item.id,
                  quantity: item.quantity || 1,
                  price: item.price,
                })),
              };

              await apiClient.post("/orders", orderData);

              clearCart();
              setDeliveryType("domicilio");
              navigation.navigate("Pedidos");
              Alert.alert("¡Éxito!", "Tu pedido ha sido enviado a cocina ");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "No se pudo procesar el pedido. Intenta nuevamente.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCheckoutWithPrompt = () => {
    Alert.alert("Tipo de entrega", "Elige cómo deseas recibir tu pedido.", [
      { text: "Domicilio", onPress: () => handleCheckout("domicilio") },
      { text: "Entrega en local", onPress: () => handleCheckout("retiro") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const renderItem = ({ item, index }) => {
    const imageSource = item.image ? { uri: item.image } : require("../../assets/chocoflan.jpg");

    return (
      <View style={[styles.cartItem, { backgroundColor: colors.surface }]}> 
        <Image source={imageSource} style={styles.cartImage} />

        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, { color: colors.text, fontSize: getFontSize("base", fontSize), ...getContrastStyle(contrast) }]}>{item.name}</Text>
          <Text style={{ fontSize: getFontSize("xs", fontSize), color: colors.secondary }}>Cantidad: {item.quantity || 1}</Text>
          <Text style={[styles.itemPrice, { color: colors.primary, fontSize: getFontSize("lg", fontSize), fontWeight: "bold" }]}>
            ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
          </Text>
        </View>

        <IconButton icon="delete" iconColor={theme.colors.error} size={24} onPress={() => removeFromCart(index)} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontSize: getFontSize("2xl", fontSize), ...getContrastStyle(contrast) }]}>Carrito de Compras</Text>
        <View style={styles.badgeContainer}>
          <Text style={[styles.badgeText, { fontSize: getFontSize("sm", fontSize) }]}>{safeCart.length} ítems</Text>
        </View>
      </View>

      {safeCart.length === 0 ? (
        <View style={styles.content}>
          <MaterialCommunityIcons name="cart-outline" size={100} color={colors.disabled || "#ccc"} />
          <Text style={[styles.emptyText, { color: colors.text, fontSize: getFontSize("lg", fontSize), ...getContrastStyle(contrast) }]}>Tu carrito está vacío</Text>
          <Button mode="contained" onPress={() => navigation.navigate("Inicio")} style={{ borderRadius: 20 }}>
            Explorar Productos
          </Button>
        </View>
      ) : (
        <>
          <FlatList
            data={safeCart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 200 }}
          />

          <View style={[styles.footer, { backgroundColor: colors.surface }]}>                
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", marginBottom: 8, alignItems: "center" }}>
                <MaterialCommunityIcons name="map-marker" size={16} color={colors.secondary} />
                <Text style={{ color: colors.secondary, marginLeft: 5, fontSize: 12 }}>
                  {user?.address ? `Envío a: ${user.address}` : "Sin dirección configurada"}
                </Text>
              </View>
            </View>

            <View style={styles.totalRow}>
              <Text style={{ fontSize: getFontSize("lg", fontSize), color: colors.text, ...getContrastStyle(contrast) }}>Total a pagar:</Text>
              <Text style={{ fontSize: getFontSize("3xl", fontSize), fontWeight: "bold", color: colors.primary, ...getContrastStyle(contrast) }}>
                ${total.toFixed(2)}
              </Text>
            </View>
            
            <Button
              mode="contained"
              icon="shopping"
              onPress={handleCheckoutWithPrompt}
              loading={loading}
              disabled={loading}
              style={styles.checkoutButton}
              contentStyle={{ height: 50 }}
            >
              Realizar pedido
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  badgeContainer: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, color: "#333", fontWeight: "bold" },
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
    padding: 10,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartImage: {
    width: 70,
    height: 70,
    marginRight: 15,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    maxHeight: 220,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  checkoutButton: {
    borderRadius: 15,
  },
});
