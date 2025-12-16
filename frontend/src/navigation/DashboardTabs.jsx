import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import InicioScreen from "../screens/InicioScreen";
import PerfilScreen from "../screens/PerfilScreen";
import CarritoScreen from "../screens/CarritoScreen";
import PedidosScreen from "../screens/PedidosScreen";
import ConfigScreen from "../screens/ConfigScreen";

const Tab = createBottomTabNavigator();

export default function DashboardTabs() {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarLabelStyle: {
          fontSize: 12,
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
          switch (route.name) {
            case "Inicio":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Carrito":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Pedidos":
              iconName = focused ? "receipt" : "receipt-text-outline";
              break;
            case "Perfil":
              iconName = focused ? "account" : "account-outline";
              break;
            case "Config":
              iconName = focused ? "cog" : "cog-outline";
              break;
          }
          return (
            <MaterialCommunityIcons
              name={iconName}
              size={26}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Carrito" component={CarritoScreen} />
      <Tab.Screen name="Pedidos" component={PedidosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
      <Tab.Screen name="Config" component={ConfigScreen} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
}