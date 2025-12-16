import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { useAppContext } from "../context/AppContext";
// 1. IMPORTAR EL HOOK DE NAVEGACIÓN
import { useNavigation, CommonActions } from "@react-navigation/native"; 

// Importación de componentes
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";

export default function AdminScreen() {
  const { logout } = useAppContext(); 
  const navigation = useNavigation(); // <--- 2. USAR LA NAVEGACIÓN
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [menuVisible, setMenuVisible] = useState(false); 

  // --- FUNCIÓN PARA CERRAR SESIÓN Y REDIRIGIR ---
  const handleLogout = () => {
    // 1. Borramos el usuario del contexto
    logout();
    
    // 2. Reseteamos la navegación para ir al Login y borrar el historial
    // Esto evita que el usuario pueda volver atrás con el botón físico
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  const getTitle = () => {
    switch(currentView) {
        case 'dashboard': return 'Dashboard';
        case 'products': return 'Productos';
        case 'orders': return 'Pedidos';
        case 'users': return 'Usuarios';
        default: return 'Administración';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <View style={styles.topBar}>
          <IconButton icon="menu" size={28} onPress={() => setMenuVisible(true)} />
          <Text style={styles.topBarTitle}>{getTitle()}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {currentView === 'dashboard' && <AdminDashboard />}
          {currentView === 'products' && <AdminProducts />}
          {currentView === 'orders' && <AdminOrders />}
          {currentView === 'users' && <Text style={{padding: 20}}>Vista de Usuarios (En construcción)</Text>}
      </ScrollView>

      {/* 3. PASAR LA NUEVA FUNCIÓN AL SIDEBAR */}
      <AdminSidebar 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)}
        setView={setCurrentView}
        onLogout={handleLogout} // <--- CAMBIO AQUÍ
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});