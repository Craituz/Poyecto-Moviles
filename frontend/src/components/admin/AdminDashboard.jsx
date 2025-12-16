import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const dashboardStats = [
  { title: "Ingresos Totales", value: "$63.00", icon: "currency-usd" }, 
  { title: "Pedidos Totales", value: "21", icon: "menu" },
  { title: "Pedidos Pendientes", value: "10", icon: "alert-circle-outline" },
  { title: "Total de Usuarios", value: "9", icon: "account-group" },
];

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.screenTitle}>Dashboard</Text>
        <View style={styles.statsGrid}>
            {dashboardStats.map((stat, index) => (
                <Card key={index} style={styles.statCard}>
                    <Card.Content style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons name={stat.icon} size={30} color="#6A1B9A" style={{ marginBottom: 10 }} />
                    <Text style={{ color: '#666', fontSize: 12, textAlign: 'center' }}>{stat.title}</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>{stat.value}</Text>
                    </Card.Content>
                </Card>
            ))}
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20, paddingTop: 50 }, // PaddingTop para la barra de estado
  screenTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', marginBottom: 15, backgroundColor: '#F3E5F5', borderRadius: 15 },
});