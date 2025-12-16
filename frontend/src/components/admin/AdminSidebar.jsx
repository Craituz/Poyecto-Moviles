import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdminSidebar({ visible, onClose, setView, onLogout }) {
  if (!visible) return null;

  const handleNavigate = (view) => {
    setView(view);
    onClose();
  };

  return (
    <View style={styles.sidebarOverlay}>
      <View style={styles.sidebarContainer}>
        <View style={styles.sidebarHeader}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Yeli's Cake App</Text>
          <Text style={{ color: 'white', fontSize: 14 }}>Panel de Administración</Text>
        </View>
        
        <View style={styles.menuItems}>
           <MenuItem icon="view-dashboard" text="Dashboard" onPress={() => handleNavigate('dashboard')} />
           <MenuItem icon="store" text="Productos" onPress={() => handleNavigate('products')} />
           <MenuItem icon="receipt" text="Pedidos" onPress={() => handleNavigate('orders')} />
           <MenuItem icon="account-group" text="Usuarios registrados" onPress={() => handleNavigate('users')} />

           <Divider style={{ marginVertical: 20 }} />

           <MenuItem icon="logout" text="Cerrar Sesión" onPress={onLogout} />
        </View>
      </View>
      <TouchableOpacity style={styles.menuBackdrop} onPress={onClose} />
    </View>
  );
}

// Componente auxiliar interno para evitar repetición
const MenuItem = ({ icon, text, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={24} color="#444" />
        <Text style={styles.menuText}>{text}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  sidebarOverlay: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 100, flexDirection: 'row',
  },
  sidebarContainer: {
      width: '80%', backgroundColor: 'white', height: '100%', elevation: 5,
  },
  menuBackdrop: {
      width: '20%', backgroundColor: 'rgba(0,0,0,0.5)', height: '100%',
  },
  sidebarHeader: {
      padding: 20, paddingTop: 50, marginBottom: 10, backgroundColor: "#5D4037",
  },
  menuItems: { padding: 10 },
  menuItem: {
      flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10,
  },
  menuText: { marginLeft: 20, fontSize: 16, color: '#444' },
});