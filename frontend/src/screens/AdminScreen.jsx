import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { Text, useTheme, IconButton, Button, Card, Divider, Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

// --- DATOS DE EJEMPLO (SIMULANDO TUS IMÁGENES) ---
const mockProducts = [
  { id: 1, name: "Torta de zanahoria", description: "Esponjosa y dorada, cubierta con una mezcla abundante de frutos secos.", price: 18.00 },
  { id: 2, name: "Stalin", description: "Stalin José", price: 64.64 },
];

const mockOrders = [
  { id: "#89153", user: "Ronald Tubay", email: "ronaldtubay27@gmail.com", date: "2025-11-19", total: 18.00, status: "Cancelado", items: "Torta de zanahoria (x1)" },
  { id: "#69772", user: "Ronald Tubay", email: "ronaldtubay27@gmail.com", date: "2025-11-19", total: 18.00, status: "Pendiente", items: "Torta de zanahoria (x1)" },
];

const dashboardStats = [
  { title: "Ingresos Totales", value: "$63.00", icon: "currency-usd", color: "#6A1B9A" }, 
  { title: "Pedidos Totales", value: "21", icon: "menu", color: "#6A1B9A" },
  { title: "Pedidos Pendientes", value: "10", icon: "alert-circle-outline", color: "#6A1B9A" },
  { title: "Total de Usuarios", value: "9", icon: "account-group", color: "#6A1B9A" },
];

// --- COMPONENTE: TARJETA DE ESTADÍSTICA (DASHBOARD) ---
const StatCard = ({ title, value, icon, color }) => (
  <Card style={styles.statCard}>
    <Card.Content style={{ alignItems: 'center' }}>
      <MaterialCommunityIcons name={icon} size={30} color={color} style={{ marginBottom: 10 }} />
      <Text style={{ color: '#666', fontSize: 12, textAlign: 'center' }}>{title}</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>{value}</Text>
    </Card.Content>
  </Card>
);

export default function AdminScreen() {
  const { logout } = useAppContext(); 
  const theme = useTheme();
   
  // Estado para controlar qué vista se muestra
  const [currentView, setCurrentView] = useState('dashboard');
  const [menuVisible, setMenuVisible] = useState(false); 

  const colors = {
    primaryBrown: "#5D4037", 
    hotPink: "#D81B60",      
    lightPurple: "#F3E5F5",  
    bg: "#FAFAFA"
  };

  // --- VISTA: MENÚ LATERAL (SIDEBAR) ---
  const renderSidebar = () => {
    if (!menuVisible) return null;
    return (
      <View style={styles.sidebarOverlay}>
        <View style={styles.sidebarContainer}>
          <View style={[styles.sidebarHeader, { backgroundColor: colors.primaryBrown }]}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Yeli's Cake App</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>Panel de Administración</Text>
          </View>
          
          <View style={styles.menuItems}>
             <TouchableOpacity style={styles.menuItem} onPress={() => { setCurrentView('dashboard'); setMenuVisible(false); }}>
                <MaterialCommunityIcons name="view-dashboard" size={24} color="#444" />
                <Text style={styles.menuText}>Dashboard</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.menuItem} onPress={() => { setCurrentView('products'); setMenuVisible(false); }}>
                <MaterialCommunityIcons name="store" size={24} color="#444" />
                <Text style={styles.menuText}>Productos</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.menuItem} onPress={() => { setCurrentView('orders'); setMenuVisible(false); }}>
                <MaterialCommunityIcons name="receipt" size={24} color="#444" />
                <Text style={styles.menuText}>Pedidos</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.menuItem} onPress={() => { setCurrentView('users'); setMenuVisible(false); }}>
                <MaterialCommunityIcons name="account-group" size={24} color="#444" />
                <Text style={styles.menuText}>Usuarios registrados</Text>
             </TouchableOpacity>

             <Divider style={{ marginVertical: 20 }} />

             <TouchableOpacity style={styles.menuItem} onPress={logout}>
                <MaterialCommunityIcons name="logout" size={24} color="#444" />
                <Text style={styles.menuText}>Cerrar Sesión</Text>
             </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.menuBackdrop} onPress={() => setMenuVisible(false)} />
      </View>
    );
  };

  // --- VISTA 1: DASHBOARD ---
  const renderDashboard = () => (
    <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>Dashboard</Text>
        <View style={styles.statsGrid}>
            {dashboardStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </View>
    </View>
  );

  // --- VISTA 2: PRODUCTOS ---
  const renderProducts = () => (
    <View style={styles.contentContainer}>
       <View style={styles.headerRow}>
           <View>
               <Text style={styles.sectionTitle}>Gestión de</Text>
               <Text style={styles.sectionTitleBold}>Productos</Text>
           </View>
           <Button mode="contained" icon="plus" buttonColor={colors.primaryBrown} onPress={() => {}}>
               Nuevo Producto
           </Button>
       </View>

       {mockProducts.map((item) => (
           <Card key={item.id} style={styles.productCard}>
               <Card.Content>
                   <Text style={styles.prodName}>{item.name}</Text>
                   <Text style={styles.prodDesc}>{item.description}</Text>
                   <Text style={[styles.prodPrice, { color: colors.hotPink }]}>
                       ${item.price.toFixed(2).replace('.', ',')}
                   </Text>
               </Card.Content>
               <Card.Actions style={styles.cardActions}>
                   <Button mode="outlined" textColor="#666" style={[styles.actionBtn, { borderColor: '#ddd' }]}>EDITAR</Button>
                   <View style={{ width: 10 }} />
                   <Button mode="contained" buttonColor={colors.hotPink} style={styles.actionBtn}>Eliminar</Button>
               </Card.Actions>
           </Card>
       ))}
    </View>
  );

  // --- VISTA 3: PEDIDOS ---
  const renderOrders = () => (
    <View style={styles.contentContainer}>
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
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="account" size={16} color="#666" />
                        <Text style={styles.orderText}>{order.user}</Text>
                    </View>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="email" size={16} color="#666" />
                        <Text style={styles.orderText}>{order.email}</Text>
                    </View>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="calendar" size={16} color="#666" />
                        <Text style={styles.orderText}>{order.date}</Text>
                    </View>
                    
                    <Divider style={{ marginVertical: 10 }} />
                    <Text style={{ marginBottom: 10 }}>{order.items}</Text>
                    
                    <View style={styles.totalRow}>
                        <Text style={{ fontWeight: 'bold' }}>Total</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.hotPink }}>
                            ${order.total.toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* BARRA SUPERIOR */}
      <View style={styles.topBar}>
          <IconButton icon="menu" size={28} onPress={() => setMenuVisible(true)} />
          <Text style={styles.topBarTitle}>
              {currentView === 'dashboard' ? 'Dashboard' : 
               currentView === 'products' ? 'Productos' : 
               currentView === 'orders' ? 'Pedidos' : 'Administración'}
          </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'products' && renderProducts()}
          {currentView === 'orders' && renderOrders()}
          {currentView === 'users' && <Text style={{padding: 20}}>Vista de Usuarios (En construcción)</Text>}
      </ScrollView>

      {/* MENÚ LATERAL */}
      {renderSidebar()}
    </View>
  );
}

const styles = StyleSheet.create({
  // TopBar
  topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 40, 
      paddingHorizontal: 10,
      backgroundColor: 'white',
      elevation: 2,
      paddingBottom: 10,
  },
  topBarTitle: {
      fontSize: 20,
      marginLeft: 10,
      color: '#333',
  },
  contentContainer: {
      padding: 20,
  },
  // Estilos Dashboard
  screenTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
  },
  statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
  },
  statCard: {
      width: '48%', 
      marginBottom: 15,
      backgroundColor: '#F3E5F5',
      borderRadius: 15,
  },
  // Estilos Sidebar
  sidebarOverlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 100,
      flexDirection: 'row',
  },
  sidebarContainer: {
      width: '80%',
      backgroundColor: 'white',
      height: '100%',
      elevation: 5,
  },
  menuBackdrop: {
      width: '20%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      height: '100%',
  },
  sidebarHeader: {
      padding: 20,
      paddingTop: 50,
      marginBottom: 10,
  },
  menuItems: {
      padding: 10,
  },
  menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
  },
  menuText: {
      marginLeft: 20,
      fontSize: 16,
      color: '#444',
  },
  // Estilos Productos
  headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
  },
  sectionTitle: { fontSize: 20, color: '#333' },
  sectionTitleBold: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  productCard: {
      backgroundColor: '#F3E5F5', 
      marginBottom: 15,
      borderRadius: 15,
  },
  prodName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  prodDesc: { fontSize: 12, color: '#666', marginBottom: 10 },
  prodPrice: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  cardActions: { justifyContent: 'space-between' },
  actionBtn: { flex: 1, marginHorizontal: 5, borderRadius: 20 },
  
  // Estilos Pedidos
  filterChip: { backgroundColor: '#BCAAA4', marginRight: 10 }, 
  filterChipUnselected: { backgroundColor: '#E0E0E0', marginRight: 10 },
  orderCard: {
      backgroundColor: '#F3E5F5',
      marginBottom: 15,
      marginTop: 10,
      borderRadius: 15,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  statusBadge: { borderWidth: 1, borderColor: '#666', borderRadius: 5, paddingHorizontal: 5 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  orderText: { marginLeft: 8, fontSize: 12, color: '#444' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
});