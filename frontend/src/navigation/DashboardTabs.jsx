import React from "react";
import { View, Text } from "react-native"; // Necesario para la pantalla de prueba de Usuarios
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { useAppContext } from "../context/AppContext"; 

// --- PANTALLAS DE CLIENTE ---
import InicioScreen from "../screens/InicioScreen";
import PerfilScreen from "../screens/PerfilScreen";
import CarritoScreen from "../screens/CarritoScreen";
import PedidosScreen from "../screens/PedidosScreen";
import ConfigScreen from "../screens/ConfigScreen";

// --- NUEVOS COMPONENTES DE ADMIN ---
// Asegúrate de que estos archivos existan en src/components/admin/
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";

// Pantalla provisional para Usuarios
const AdminUsersScreen = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Gestión de Usuarios (En construcción)</Text>
    </View>
);

const Tab = createBottomTabNavigator();

export default function DashboardTabs() {
  const theme = useTheme();
  const { user } = useAppContext(); 
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarLabelStyle: {
          fontSize: 10, // Letra un poco más pequeña para que quepan todos
          marginBottom: 4,
          fontWeight: 'bold',
        },
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName = "home";
          
          // --- LÓGICA DE ÍCONOS ---
          
          // 1. ÍCONOS DE ADMIN
          if (route.name === "Dashboard") iconName = "view-dashboard";
          else if (route.name === "Productos") iconName = "store";
          else if (route.name === "AdminPedidos") iconName = "receipt"; // Nombre diferente para evitar conflicto
          else if (route.name === "Usuarios") iconName = "account-group";

          // 2. ÍCONOS DE CLIENTE
          else if (route.name === "Inicio") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Carrito") iconName = focused ? "cart" : "cart-outline";
          else if (route.name === "Pedidos") iconName = focused ? "receipt" : "receipt-text-outline";
          else if (route.name === "Config") iconName = focused ? "cog" : "cog-outline";
          
          // 3. ÍCONO COMPARTIDO
          else if (route.name === "Perfil") iconName = focused ? "account" : "account-outline";

          return (
            <MaterialCommunityIcons name={iconName} size={26} color={color} />
          );
        },
      })}
    >
      {/* --- LÓGICA DE VISTAS SEGÚN EL ROL --- */}
      
      {user?.rol === 'admin' ? (
        // 1. VISTA DE ADMINISTRADOR (5 Tabs Separadas)
        <>
          <Tab.Screen name="Dashboard" component={AdminDashboard} />
          <Tab.Screen name="Productos" component={AdminProducts} />
          <Tab.Screen 
            name="AdminPedidos" 
            component={AdminOrders} 
            options={{ tabBarLabel: 'Pedidos' }} // El nombre visible será "Pedidos"
          />
          <Tab.Screen name="Usuarios" component={AdminUsersScreen} />
          <Tab.Screen name="Perfil" component={PerfilScreen} />
        </>
      ) : (
        // 2. VISTA DE CLIENTE (Tu menú original)
        <>
          <Tab.Screen name="Inicio" component={InicioScreen} />
          <Tab.Screen name="Carrito" component={CarritoScreen} />
          <Tab.Screen name="Pedidos" component={PedidosScreen} />
          <Tab.Screen name="Perfil" component={PerfilScreen} />
          <Tab.Screen name="Config" component={ConfigScreen} options={{ title: 'Ajustes' }} />
        </>
      )}

    </Tab.Navigator>
  );
}