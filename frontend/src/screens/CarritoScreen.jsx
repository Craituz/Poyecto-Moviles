import React, { useMemo, useState } from "react";
import { View, StyleSheet, FlatList, Image, Alert } from "react-native";
import { Text, Button, useTheme, IconButton, ActivityIndicator } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient"; // <--- IMPORTANTE

export default function CarritoScreen({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  
  // 1. Obtenemos funciones y el USUARIO del contexto
  const { cart, removeFromCart, clearCart, user } = useAppContext();
  const [loading, setLoading] = useState(false);

  // 2. Protección: Si cart es undefined, usamos un array vacío
  const safeCart = cart || [];

  // 3. Calculamos el total
  const total = useMemo(() => {
    return safeCart.reduce((sum, item) => {
        return sum + (Number(item.price) * (item.quantity || 1));
    }, 0);
  }, [safeCart]);

  // 4. Manejo del Checkout (CONEXIÓN REAL CON LARAVEL)
  const handleCheckout = () => {
    // A. Validar que el usuario tenga dirección y teléfono
    if (!user.address || !user.phone) {
        Alert.alert(
            "Faltan Datos",
            "Para realizar un pedido, necesitamos tu dirección y teléfono. Por favor actualiza tu perfil.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Ir a Perfil", onPress: () => navigation.navigate("Perfil") }
            ]
        );
        return;
    }

    Alert.alert(
        "Confirmar Compra",
        `¿Procesar pedido por $${total.toFixed(2)}?`,
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Sí, Comprar", 
                onPress: async () => {
                    setLoading(true);
                    try {
                        // B. Preparar datos para Laravel
                        const orderData = {
                            total: total,
                            address: user.address,
                            phone: user.phone,
                            items: safeCart.map(item => ({
                                product_id: item.id,
                                quantity: item.quantity || 1, // Aseguramos que vaya cantidad
                                price: item.price
                            }))
                        };

                        // C. Petición POST
                        await apiClient.post('/orders', orderData);

                        // D. Éxito
                        clearCart();
                        navigation.navigate("Pedidos"); 
                        Alert.alert("¡Éxito!", "Tu pedido ha sido enviado a cocina 👨‍🍳");

                    } catch (error) {
                        console.error(error);
                        Alert.alert("Error", "No se pudo procesar el pedido. Intenta nuevamente.");
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]
    );
  };

  const renderItem = ({ item, index }) => {
    // Lógica de imagen híbrida
    const imageSource = item.image 
        ? { uri: item.image } 
        : require("../../assets/chocoflan.jpg"); 

    return (
      <View style={[styles.cartItem, { backgroundColor: colors.surface }]}>
        <Image source={imageSource} style={styles.cartImage} />
        
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
          <Text style={{fontSize: 12, color: colors.secondary}}>Cantidad: {item.quantity || 1}</Text>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>
            ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
          </Text>
        </View>

        <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            size={24}
            onPress={() => removeFromCart(index)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Carrito de Compras
        </Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{safeCart.length} ítems</Text>
        </View>
      </View>

      {safeCart.length === 0 ? (
        // --- VISTA VACÍA ---
        <View style={styles.content}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={100}
            color={colors.disabled || "#ccc"}
          />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Tu carrito está vacío
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Inicio")}
            style={{ borderRadius: 20 }}
          >
            Explorar Productos
          </Button>
        </View>
      ) : (
        // --- VISTA CON PRODUCTOS ---
        <>
            <FlatList
                data={safeCart}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 120 }} // Espacio para el footer
            />

            {/* FOOTER FLOTANTE CON TOTAL */}
            <View style={[styles.footer, { backgroundColor: colors.surface }]}>
                <View style={styles.totalRow}>
                    <Text style={{ fontSize: 18, color: colors.text }}>Total a pagar:</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primary }}>
                        ${total.toFixed(2)}
                    </Text>
                </View>

                {/* Mostramos dirección de envío */}
                <View style={{flexDirection:'row', marginBottom:15, alignItems:'center'}}>
                    <MaterialCommunityIcons name="map-marker" size={16} color={colors.secondary} />
                    <Text style={{color: colors.secondary, marginLeft: 5, fontSize: 12}}>
                        {user?.address ? `Envío a: ${user.address}` : "Sin dirección configurada"}
                    </Text>
                </View>
                
                <Button 
                    mode="contained" 
                    icon="check-circle"
                    onPress={handleCheckout}
                    loading={loading}
                    disabled={loading}
                    style={styles.checkoutButton}
                    contentStyle={{ height: 50 }}
                >
                    Realizar Pedido
                </Button>
            </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
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
  badgeText: { fontSize: 12, color: "#333", fontWeight: 'bold' },
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
  
  // Estilos de Ítem
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
  },
  itemName: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  itemPrice: {
      fontSize: 16,
      marginTop: 4,
      fontWeight: '600'
  },

  // Estilos del Footer
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      elevation: 20, // Más elevación para que flote sobre la lista
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
  },
  totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5
  },
  checkoutButton: {
      borderRadius: 15,
  }
});