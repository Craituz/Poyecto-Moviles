import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity, Linking } from "react-native";
import { Text, Card, Chip, Divider, Menu, Button, useTheme, ActivityIndicator } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../services/apiClient";

export default function AdminOrders() {
  const theme = useTheme();
  const { colors } = theme;

  // Estados de Datos
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estado de Filtro y Menú
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [visibleMenuId, setVisibleMenuId] = useState(null); // Controla qué menú está abierto

  // --- 1. CARGAR PEDIDOS REALES ---
  const fetchOrders = async () => {
    try {
        if (!refreshing) setLoading(true);
        const response = await apiClient.get('/admin/orders');
        setOrders(response.data);
    } catch (error) {
        console.error("Error cargando pedidos:", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // --- 2. CAMBIAR ESTADO (Lógica Backend) ---
  const handleStatusChange = async (orderId, newStatus) => {
    setVisibleMenuId(null); // Cerrar menú
    try {
        await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
        
        // Actualizar localmente para feedback inmediato
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        
        Alert.alert("Actualizado", `Pedido #${orderId} movido a: ${newStatus.toUpperCase()}`);
    } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo cambiar el estado.");
    }
  };

  // --- 3. FILTRADO ---
  const filteredOrders = orders.filter(order => {
      if (activeFilter === "Todos") return true;
      return order.status.toLowerCase() === activeFilter.toLowerCase();
  });

  // Helper de colores
  const getStatusColor = (status) => {
      switch (status) {
          case 'pendiente': return '#FF9800'; 
          case 'preparando': return '#2196F3'; 
          case 'enviado': return '#9C27B0'; 
          case 'entregado': return '#4CAF50'; 
          case 'cancelado': return '#F44336'; 
          default: return '#757575';
      }
  };

  // --- RENDER DE CADA TARJETA ---
  const renderOrder = ({ item }) => {
    const date = new Date(item.created_at).toLocaleDateString('es-ES', {
         month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
    });

    return (
        <Card style={[styles.orderCard, { backgroundColor: colors.surface }]}>
            <Card.Content>
                {/* CABECERA: ID Y ESTADO */}
                <View style={styles.orderHeader}>
                    <Text style={[styles.orderId, { color: colors.text }]}>Pedido #{item.id}</Text>
                    <Chip 
                        style={{ backgroundColor: getStatusColor(item.status), height: 28 }} 
                        textStyle={{ color: 'white', fontSize: 10, lineHeight: 12 }}
                    >
                        {item.status.toUpperCase()}
                    </Chip>
                </View>

                {/* DATOS DEL CLIENTE */}
                <OrderInfoRow icon="account" text={item.user?.name || "Cliente Desconocido"} />
                <OrderInfoRow icon="email" text={item.user?.email} />
                <OrderInfoRow icon="phone" text={item.phone || "Sin teléfono"} />
                                <OrderInfoRow icon="map-marker" text={item.address || "Sin dirección"} />
                                {item.latitude && item.longitude && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
                                            Linking.openURL(url).catch(() => Alert.alert('Error', 'No se pudo abrir el mapa.'));
                                        }}
                                        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}
                                    >
                                        <MaterialCommunityIcons name="map-search" size={16} color={colors.primary} />
                                        <Text style={{ marginLeft: 6, color: colors.primary, fontWeight: 'bold', fontSize: 12 }}>
                                            Ver ubicación
                                        </Text>
                                    </TouchableOpacity>
                                )}
                <OrderInfoRow icon="calendar" text={date} />
                
                <Divider style={{ marginVertical: 10 }} />
                
                {/* LISTA DE PRODUCTOS (Detalles reales) */}
                <View style={{ marginBottom: 10 }}>
                    {item.items?.map((detail, idx) => (
                        <Text key={idx} style={{ fontSize: 13, color: '#444' }}>
                            <Text style={{ fontWeight: 'bold' }}>{detail.quantity}x </Text>
                            {detail.product?.name}
                        </Text>
                    ))}
                </View>
                
                {/* PIE DE PÁGINA: TOTAL Y MENÚ DE ACCIONES */}
                <View style={styles.totalRow}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#666' }}>Total</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: colors.primary }}>
                            ${Number(item.total).toFixed(2)}
                        </Text>
                    </View>

                    {/* MENÚ DESPLEGABLE PARA CAMBIAR ESTADO */}
                    <Menu
                        visible={visibleMenuId === item.id}
                        onDismiss={() => setVisibleMenuId(null)}
                        anchor={
                            <Button 
                                mode="contained" 
                                onPress={() => setVisibleMenuId(item.id)}
                                icon="pencil"
                                style={{ borderRadius: 8 }}
                                compact
                            >
                                Gestionar
                            </Button>
                        }
                    >
                        <Menu.Item onPress={() => handleStatusChange(item.id, 'preparando')} title="Preparando" leadingIcon="chef-hat" />
                        <Menu.Item onPress={() => handleStatusChange(item.id, 'enviado')} title="Enviado" leadingIcon="bike" />
                        <Menu.Item onPress={() => handleStatusChange(item.id, 'entregado')} title="Entregado" leadingIcon="check-circle" />
                        <Divider />
                        <Menu.Item onPress={() => handleStatusChange(item.id, 'cancelado')} title="Cancelar" leadingIcon="cancel" titleStyle={{color: colors.error}} />
                    </Menu>
                </View>
            </Card.Content>
        </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Gestión de Pedidos</Text>
        
        {/* FILTROS HORIZONTALES */}
        <View style={{ height: 50 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                {["Todos", "Pendiente", "Preparando", "Enviado", "Entregado", "Cancelado"].map((status) => (
                    <Chip 
                        key={status}
                        selected={activeFilter === status} 
                        onPress={() => setActiveFilter(status)}
                        style={[
                            styles.filterChip, 
                            activeFilter === status ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface }
                        ]}
                        textStyle={{ color: activeFilter === status ? '#FFFFFF' : colors.text }}
                    >
                        {status}
                    </Chip>
                ))}
            </ScrollView>
        </View>

        {/* LISTA DE PEDIDOS */}
        {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 50 }} color={colors.primary} />
        ) : (
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrder}
                contentContainerStyle={{ paddingBottom: 80 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 30, color: '#888' }}>
                        No hay pedidos en estado "{activeFilter}"
                    </Text>
                }
            />
        )}
    </View>
  );
}

// Componente auxiliar para filas de información
const OrderInfoRow = ({ icon, text }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <MaterialCommunityIcons name={icon} size={14} color="#757575" />
        <Text style={{ marginLeft: 8, fontSize: 12, color: '#424242' }}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 20 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333', marginTop: 10 },
  filterChip: { marginRight: 8 },
    orderCard: { marginBottom: 15, marginTop: 5, borderRadius: 12, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
});