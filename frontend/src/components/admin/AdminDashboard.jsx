import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Text, Card, ActivityIndicator, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../services/apiClient"; // <--- Importante

export default function AdminDashboard() {
  const theme = useTheme();
  const { colors } = theme;

  // Estado para guardar las estadísticas reales
  const [stats, setStats] = useState({
    income: 0,
    total_orders: 0,
    pending_orders: 0,
    total_users: 0
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- FUNCIÓN PARA TRAER DATOS DEL BACKEND ---
  const fetchStats = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await apiClient.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos cada vez que entramos a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  // Mapeamos los datos reales a tu estructura de tarjetas
  const dashboardCards = [
    { 
        title: "Ingresos Totales", 
        // Formateamos el dinero con 2 decimales
        value: `$${Number(stats.income).toFixed(2)}`, 
        icon: "currency-usd",
        color: "#4CAF50" // Verde dinero
    }, 
    { 
        title: "Pedidos Totales", 
        value: stats.total_orders, 
        icon: "receipt",
        color: "#2196F3" // Azul info
    },
    { 
        title: "Pendientes", 
        value: stats.pending_orders, 
        icon: "alert-circle-outline",
        color: "#FF9800" // Naranja alerta
    },
    { 
        title: "Usuarios", 
        value: stats.total_users, 
        icon: "account-group",
        color: "#9C27B0" // Morado usuarios
    },
  ];

  return (
    <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
    >
        <Text style={[styles.screenTitle, {color: colors.primary}]}>Resumen del Negocio</Text>
        
        {loading ? (
            <ActivityIndicator size="large" style={{marginTop: 50}} color={colors.primary} />
        ) : (
            <View style={styles.statsGrid}>
                {dashboardCards.map((stat, index) => (
                    <Card key={index} style={styles.statCard}>
                        <Card.Content style={{ alignItems: 'center', paddingVertical: 10 }}>
                            <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                                <MaterialCommunityIcons 
                                    name={stat.icon} 
                                    size={32} 
                                    color={stat.color} 
                                />
                            </View>
                            
                            <Text style={{ fontSize: 26, fontWeight: 'bold', color: colors.text, marginVertical: 5 }}>
                                {stat.value}
                            </Text>
                            
                            <Text style={{ color: colors.secondary, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>
                                {stat.title.toUpperCase()}
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 10 }, 
  screenTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { 
      width: '48%', 
      marginBottom: 15, 
      borderRadius: 16, 
      elevation: 3, // Sombra Android
      backgroundColor: 'white'
  },
  iconContainer: {
      padding: 10,
      borderRadius: 50,
      marginBottom: 5
  }
});