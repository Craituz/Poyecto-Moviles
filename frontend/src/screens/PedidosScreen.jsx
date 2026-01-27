import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl, Linking, Alert } from "react-native";
import { Text, useTheme, ActivityIndicator, Card, Divider, Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient";
import { getFontSize, getContrastStyle } from "../services/fontSizeHelper";
import { detectAndNotifyOrderStatusChanges } from "../services/orderNotifications";

// Helper para colores de estado
const getStatusColor = (status) => {
    switch (status) {
        case 'pendiente': return '#FF9800';  // Naranja
        case 'preparando': return '#2196F3'; // Azul
        case 'enviado': return '#9C27B0';    // Morado
        case 'entregado': return '#4CAF50';  // Verde
        case 'cancelado': return '#F44336';  // Rojo
        default: return '#757575';
    }
};

export default function PedidosScreen() {
  const theme = useTheme();
  const { colors } = theme;
  
  // Obtenemos configuraciones del usuario
  const { fontSize, contrast, addInAppNotification } = useAppContext();
  
  // Estados de datos
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados de UI
  const [activeTab, setActiveTab] = useState("Todos");
  const tabs = ["Todos", "Pendiente", "Preparando", "Enviado", "Entregado"];

  // --- 1. CARGAR PEDIDOS DE LA API ---
  const fetchOrders = async () => {
    try {
        // Si no estamos refrescando (pull-to-refresh), mostramos carga inicial
        if (!refreshing) setLoading(true);
        
        const response = await apiClient.get('/orders');
        
        // Detectar cambios de estado y crear notificaciones automáticas
        detectAndNotifyOrderStatusChanges(orders, response.data, addInAppNotification);
        
        setOrders(response.data);
    } catch (error) {
        console.error("Error cargando pedidos:", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  // Recargar cada vez que entramos a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // --- 2. FILTRADO DE PEDIDOS SEGÚN EL TAB ---
  const filteredOrders = orders.filter(order => {
      if (activeTab === "Todos") return true;
      // Convertimos el tab a minúsculas para coincidir con el backend ('Pendiente' -> 'pendiente')
      return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  // --- 3. RENDERIZADO DE CADA TARJETA ---
  const renderItem = ({ item }) => {
    const date = new Date(item.created_at).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'
    });

    return (
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Title 
                title={`Pedido #${item.id}`} 
                titleStyle={{ fontSize: getFontSize("lg", fontSize), ...getContrastStyle(contrast) }}
                subtitle={date}
                subtitleStyle={{ fontSize: getFontSize("xs", fontSize) }}
                right={(props) => (
                    <Chip 
                        style={{backgroundColor: getStatusColor(item.status), marginRight: 16, height: 30}} 
                        textStyle={{color: 'white', fontSize: getFontSize("xs", fontSize), fontWeight: 'bold'}}
                    >
                        {item.status.toUpperCase()}
                    </Chip>
                )}
            />
            <Card.Content>
                <Divider style={{marginBottom: 10}} />
                
                {/* Lista de productos (Máximo 3 para no saturar) */}
                {item.items?.slice(0, 3).map((detail, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={{fontWeight:'bold', color: colors.primary, fontSize: getFontSize("sm", fontSize)}}>{detail.quantity}x</Text>
                        <Text style={{flex:1, marginLeft: 10, fontSize: getFontSize("sm", fontSize), color: colors.text}} numberOfLines={1}>
                            {detail.product?.name || 'Producto eliminado'}
                        </Text>
                        <Text style={{fontWeight:'bold', fontSize: getFontSize("base", fontSize)}}>${Number(detail.price).toFixed(2)}</Text>
                    </View>
                ))}
                
                {item.items?.length > 3 && (
                    <Text style={{fontStyle:'italic', color: '#888', fontSize: 12}}>
                        ... y {item.items.length - 3} más
                    </Text>
                )}

                <Divider style={{marginTop: 10, marginBottom: 10}} />
                
                <View style={styles.totalRow}>
                    <View style={{flex:1}}>
                         <View style={{flexDirection:'row', alignItems:'center', marginBottom: 6}}>
                             <MaterialCommunityIcons name="map-marker" size={14} color={colors.secondary} />
                             <Text style={{fontSize: getFontSize("xs", fontSize), color: colors.secondary, marginLeft: 4}}>
                                {item.address || 'Sin dirección'}
                             </Text>
                         </View>
                         {item.latitude && item.longitude && (
                           <TouchableOpacity
                             onPress={() => {
                               const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
                               Linking.openURL(url).catch(() => Alert.alert('Error', 'No se pudo abrir el mapa.'));
                             }}
                             style={{flexDirection:'row', alignItems:'center'}}
                           >
                             <MaterialCommunityIcons name="map-search" size={16} color={colors.primary} />
                             <Text style={{marginLeft: 6, color: colors.primary, fontWeight:'bold', fontSize: getFontSize("xs", fontSize)}}>
                               Ver ubicación
                             </Text>
                           </TouchableOpacity>
                         )}
                    </View>
                    <Text style={{fontSize: getFontSize("3xl", fontSize), fontWeight:'bold', color: colors.primary, ...getContrastStyle(contrast)}}>
                        Total: ${Number(item.total).toFixed(2)}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* --- SECCIÓN DE TABS --- */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab 
                    ? { backgroundColor: '#E1BEE7' } // Tu color morado claro
                    : { backgroundColor: '#f0f0f0' }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text 
                style={[
                    styles.tabText, 
                    activeTab === tab ? { color: '#4A148C', fontWeight: 'bold' } : { color: '#666' }
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- CONTENIDO --- */}
      {loading ? (
          <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
          </View>
      ) : filteredOrders.length === 0 ? (
          // --- ESTADO VACÍO (TU DISEÑO ORIGINAL) ---
          <View style={styles.content}>
            <View style={styles.emptyIconContainer}>
                <MaterialCommunityIcons 
                    name="clipboard-text-outline" 
                    size={60} 
                    color="#ccc" 
                />
                 <MaterialCommunityIcons 
                    name="check" 
                    size={30} 
                    color="#ccc" 
                    style={{ position: 'absolute', bottom: -5, right: -5, backgroundColor: 'white', borderRadius: 15 }}
                />
            </View>
            <Text style={[styles.emptyText, { color: colors.secondary }]}>
                {activeTab === "Todos" 
                    ? "Aún no has realizado pedidos" 
                    : `No tienes pedidos en estado "${activeTab}"`}
            </Text>
          </View>
      ) : (
          // --- LISTA DE PEDIDOS ---
          <FlatList 
            data={filteredOrders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
          />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsContainer: { paddingVertical: 50, paddingHorizontal: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  tabText: { fontSize: 14 },
  
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Estilos de la Tarjeta
  card: { marginBottom: 12, borderRadius: 12, elevation: 3 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // Estilos de Estado Vacío
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyIconContainer: { marginBottom: 20, padding: 20, borderWidth: 4, borderColor: '#e0e0e0', borderRadius: 15 },
  emptyText: { fontSize: 16, textAlign: 'center' },
});