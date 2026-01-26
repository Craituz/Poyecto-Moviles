import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from "react-native";
import { Text, Button, Card, useTheme } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../services/apiClient"; 

export default function AdminProducts({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { colors } = theme;

  // 1. CARGAR PRODUCTOS DEL BACKEND
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. RECARGAR AUTOMÁTICAMENTE AL ENTRAR
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // 3. FUNCIÓN ELIMINAR (CONECTADA AL BACKEND)
  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
               // Petición DELETE real al servidor
               await apiClient.delete(`/products/${id}`);
               
               Alert.alert("Éxito", "El producto ha sido eliminado.");
               fetchProducts(); // Recargamos la lista para que desaparezca
            } catch (error) {
               console.error("Error eliminando:", error);
               Alert.alert("Error", "No se pudo eliminar el producto. Revisa tu conexión.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    // Si item.image es null, usa una imagen local por defecto
    const imageSource = item.image 
        ? { uri: item.image } 
        : require("../../../assets/chocoflan.jpg"); 

    return (
      <Card style={[styles.productCard, { backgroundColor: colors.surface }]}>
        <Card.Content>
          {/* IMAGEN DEL PRODUCTO */}
          <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />

          <Text style={[styles.prodName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.prodDesc, { color: colors.secondary }]} numberOfLines={2}>{item.description}</Text>
          <Text style={[styles.prodPrice, { color: colors.primary }]}>
             ${Number(item.price).toFixed(2)}
          </Text>
        </Card.Content>

        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="outlined" 
            textColor={colors.secondary} 
            style={[styles.actionBtn, { borderColor: colors.secondary }]}
            // NAVEGAR A EDITAR (Pasando el producto como parámetro)
            onPress={() => navigation.navigate("EditProduct", { product: item })}
          >
            EDITAR
          </Button>
          
          <View style={{ width: 10 }} />
          
          <Button 
            mode="contained" 
            buttonColor={colors.primary} 
            style={styles.actionBtn}
            onPress={() => handleDelete(item.id)}
          >
            Eliminar
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
       {/* HEADER */}
       <View style={styles.headerRow}>
           <View>
           <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Gestión de</Text>
           <Text style={[styles.sectionTitleBold, { color: colors.text }]}>Productos</Text>
           </View>
           
           {/* BOTÓN NUEVO */}
           <Button 
                mode="contained" 
                icon="plus" 
          buttonColor={colors.primary} 
                onPress={() => navigation.navigate("NewProduct")}
           >
               Nuevo
           </Button>
       </View>

       {/* LISTA DE PRODUCTOS */}
       {loading ? (
         <View style={{flex:1, justifyContent:'center'}}>
          <ActivityIndicator size="large" color={colors.primary} />
         </View>
       ) : (
         <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
                <Text style={{textAlign:'center', marginTop: 20, color: colors.secondary}}>
                    No hay productos registrados aún.
                </Text>
            }
         />
       )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20 },
  sectionTitleBold: { fontSize: 24, fontWeight: 'bold' },
  
  productCard: { marginBottom: 15, borderRadius: 15, overflow: 'hidden' },
  cardImage: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  
  prodName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  prodDesc: { fontSize: 13, marginBottom: 10 },
  prodPrice: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  
  cardActions: { justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 15 },
  actionBtn: { flex: 1, marginHorizontal: 5, borderRadius: 20 },
});