import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import {
  Text,
  useTheme,
  IconButton,
  Snackbar
} from "react-native-paper";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient";

export default function InicioScreen() {
  const theme = useTheme();
  const { colors } = theme;
  
  // 1. OBTENEMOS 'user' PARA SABER SI ES INVITADO
  const { addToCart, user } = useAppContext();

  // Estados
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);

  // Verificamos si es invitado (ID 0 o Rol guest)
  const isGuest = user?.id === 0 || user?.roles?.[0]?.name === 'guest';

  // 2. FUNCIÓN PARA TRAER PRODUCTOS
  const fetchProducts = async () => {
    try {
      if (!refreshing) setLoading(true);
      
      const response = await apiClient.get("/products");
      setProducts(response.data);
      
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProducts([]); // Evita errores de renderizado
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 3. AGREGAR AL CARRITO (MEJORADO) ---
  const handleAddToCart = (product) => {
    // IMPORTANTE: Creamos una copia limpia del producto asegurando que el precio sea número
    const cleanProduct = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: parseFloat(product.price), // <--- ESTO EVITA ERRORES DE SUMA EN EL CARRITO
        quantity: 1 // Cantidad inicial
    };

    addToCart(cleanProduct);
    setVisible(true);
  };

  const renderItem = ({ item }) => {
    // Fallback de imagen
    const imageSource = item.image 
        ? { uri: item.image } 
        : require("../../assets/chocoflan.jpg"); 

    return (
      <View style={[styles.productCard, { backgroundColor: colors.surface }]}>
        <Image 
            source={imageSource} 
            style={styles.productImage} 
            resizeMode="cover"
        />

        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]}>
            {item.name}
          </Text>

          <Text style={[styles.productDesc, { color: colors.secondary }]} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>
              ${Number(item.price).toFixed(2)}
            </Text>

            {/* OCULTAR BOTÓN SI ES INVITADO */}
            {!isGuest && (
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleAddToCart(item)}
                >
                    <IconButton
                    icon="cart-plus"
                    iconColor="white"
                    size={20}
                    style={{ margin: 0 }} // Fix para centrar ícono
                    />
                </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {loading ? (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 10, color: colors.secondary }}>
                Cargando delicias...
            </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
             <RefreshControl 
                refreshing={refreshing} 
                onRefresh={() => {
                    setRefreshing(true);
                    fetchProducts();
                }} 
                colors={[colors.primary]}
             />
          }
          ListEmptyComponent={
            <View style={styles.center}>
                <Text style={{ color: colors.secondary, textAlign: 'center', marginTop: 50 }}>
                    No hay productos disponibles por ahora.
                </Text>
            </View>
          }
        />
      )}

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
        style={{ backgroundColor: colors.primary, marginBottom: 20 }}
      >
        Producto añadido al carrito 🛒
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 }, // Espacio extra abajo
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    marginTop: 5,
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
