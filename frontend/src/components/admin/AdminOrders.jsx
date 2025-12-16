import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, Chip, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const mockOrders = [
  { id: "#89153", user: "Ronald Tubay", email: "ronaldtubay27@gmail.com", date: "2025-11-19", total: 18.00, status: "Cancelado", items: "Torta de zanahoria (x1)" },
  { id: "#69772", user: "Ronald Tubay", email: "ronaldtubay27@gmail.com", date: "2025-11-19", total: 18.00, status: "Pendiente", items: "Torta de zanahoria (x1)" },
];

export default function AdminOrders() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.screenTitle}>Pedidos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
            <Chip selected style={styles.filterChip} textStyle={{color: 'white'}}>Todos</Chip>
            <Chip style={styles.filterChipUnselected}>Pendiente</Chip>
            <Chip style={styles.filterChipUnselected}>En preparación</Chip>
            <Chip style={styles.filterChipUnselected}>Finalizado</Chip>
        </ScrollView>

        {mockOrders.map((order) => (
            <Card key={order.id} style={styles.orderCard}>
                <Card.Content>
                    <View style={styles.orderHeader}>
                        <Text style={styles.orderId}>Pedido {order.id}</Text>
                        <View style={styles.statusBadge}>
                             <Text style={{ fontSize: 10 }}>{order.status}</Text>
                        </View>
                    </View>
                    <OrderInfoRow icon="account" text={order.user} />
                    <OrderInfoRow icon="email" text={order.email} />
                    <OrderInfoRow icon="calendar" text={order.date} />
                    
                    <Divider style={{ marginVertical: 10 }} />
                    <Text style={{ marginBottom: 10 }}>{order.items}</Text>
                    
                    <View style={styles.totalRow}>
                        <Text style={{ fontWeight: 'bold' }}>Total</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: "#D81B60" }}>
                            ${order.total.toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        ))}
    </ScrollView>
  );
}

const OrderInfoRow = ({ icon, text }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
        <MaterialCommunityIcons name={icon} size={16} color="#666" />
        <Text style={{ marginLeft: 8, fontSize: 12, color: '#444' }}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20, paddingTop: 50 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  filterChip: { backgroundColor: '#BCAAA4', marginRight: 10 }, 
  filterChipUnselected: { backgroundColor: '#E0E0E0', marginRight: 10 },
  orderCard: { backgroundColor: '#F3E5F5', marginBottom: 15, marginTop: 10, borderRadius: 15 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  statusBadge: { borderWidth: 1, borderColor: '#666', borderRadius: 5, paddingHorizontal: 5 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
});