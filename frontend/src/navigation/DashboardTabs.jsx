import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import InicioScreen from "../screens/InicioScreen";
import PerfilScreen from "../screens/PerfilScreen";
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
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarIcon: ({ color }) => {
          let iconName = "home";
          switch (route.name) {
            case "Inicio":
              iconName = "home";
              break;
            case "Perfil":
              iconName = "user";
              break;
            case "Configuración":
              iconName = "cog";
              break;
          }
          return (
            <FontAwesome
              name={iconName}
              size={26}
              color={color}
              style={{ marginTop: 4 }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
      <Tab.Screen name="Configuración" component={ConfigScreen} />
    </Tab.Navigator>
  );
}