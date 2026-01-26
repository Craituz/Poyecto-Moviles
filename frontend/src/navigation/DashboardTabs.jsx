import React from "react";
import { View, Text } from "react-native";
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
import NotificacionesScreen from "../screens/NotificacionesScreen";

// --- COMPONENTES DE ADMIN ---
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";
import AdminUsers from "../components/admin/AdminUsers"; 

const Tab = createBottomTabNavigator();

export default function DashboardTabs() {
  const theme = useTheme();
  const { user, inAppNotifications } = useAppContext(); 
  
  const isAdmin = user?.email === 'admin@yeliscake.com' || user?.roles?.[0]?.name === 'admin';

  const isGuest = user?.id === 0 || user?.roles?.[0]?.name === 'guest';
  
  const unreadCount = inAppNotifications?.filter(n => !n.read).length || 0;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarLabelStyle: { fontSize: 10, marginBottom: 4, fontWeight: 'bold' },
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarIcon: ({ color, focused, size }) => {
          let iconName = "home";
          
          if (route.name === "Dashboard") iconName = "view-dashboard";
          else if (route.name === "Productos") iconName = "store";
          else if (route.name === "AdminPedidos") iconName = "receipt";
          else if (route.name === "Usuarios") iconName = "account-group";

          else if (route.name === "Inicio") iconName = focused ? "cake" : "cake-variant";
          else if (route.name === "Carrito") iconName = focused ? "cart" : "cart-outline";
          else if (route.name === "Notificaciones") iconName = focused ? "bell" : "bell-outline";
          else if (route.name === "Pedidos") iconName = focused ? "clipboard-text" : "clipboard-text-outline";
          else if (route.name === "Config") iconName = focused ? "cog" : "cog-outline";
          else if (route.name === "Perfil") iconName = focused ? "account" : "account-outline";
          
          else if (route.name === "Salir") iconName = "logout";

          return (
            <View>
              <MaterialCommunityIcons name={iconName} size={26} color={color} />
              {route.name === "Notificaciones" && unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -3,
                    backgroundColor: theme.colors.error,
                    borderRadius: 10,
                    minWidth: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      
      {isAdmin ? (
        <>
          <Tab.Screen name="Dashboard" component={AdminDashboard} />
          <Tab.Screen name="Productos" component={AdminProducts} />
          <Tab.Screen 
            name="AdminPedidos" 
            component={AdminOrders} 
            options={{ tabBarLabel: 'Pedidos' }} 
          />
          
          <Tab.Screen name="Usuarios" component={AdminUsers} />
          
          <Tab.Screen name="Perfil" component={PerfilScreen} />
          
          <Tab.Screen 
            name="Config" 
            component={ConfigScreen} 
            options={{ tabBarLabel: 'Ajustes' }} 
          />
        </>
      ) : isGuest ? (
        <>
          <Tab.Screen 
            name="Inicio" 
            component={InicioScreen} 
            options={{ tabBarLabel: 'Catálogo' }}
          />
          <Tab.Screen 
            name="Salir" 
            component={PerfilScreen}
            options={{ tabBarLabel: 'Salir / Login' }}
          />
        </>
      ) : (
        // === VISTA 3: CLIENTE REGISTRADO ===
        <>
          <Tab.Screen name="Inicio" component={InicioScreen} />
          <Tab.Screen name="Carrito" component={CarritoScreen} />
          <Tab.Screen name="Notificaciones" component={NotificacionesScreen} />
          <Tab.Screen name="Pedidos" component={PedidosScreen} />
          <Tab.Screen name="Perfil" component={PerfilScreen} />
          <Tab.Screen name="Config" component={ConfigScreen} options={{ title: 'Ajustes' }} />
        </>
      )}

    </Tab.Navigator>
  );
}