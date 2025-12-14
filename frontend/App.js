import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Importante para evitar pantallas blancas
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';

// --- TUS IMPORTACIONES ---
// 1. Contexto (Usuario y Funciones)
import { AppProvider, useAppContext } from './src/context/AppContext';
// 2. Temas
import { PaperLightTheme, PaperDarkTheme } from './src/theme/PaperTheme';
// 3. Pantallas
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreeen';
// 4. Navegación del Dashboard (tabs)
import DashboardTabs from './src/navigation/DashboardTabs';

const Stack = createNativeStackNavigator();

// Componente interno que maneja el tema
function MainLayout() {
  const { isDarkTheme } = useAppContext();
  
  // Selección del tema
  const theme = isDarkTheme ? PaperDarkTheme : PaperLightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Pantalla 1: Login */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          {/* Pantalla 2: Dashboard (Contiene los Tabs) */}
          <Stack.Screen name="Dashboard" component={DashboardTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    // SafeAreaProvider evita errores visuales en los bordes de la pantalla
    <SafeAreaProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </SafeAreaProvider>
  );
}