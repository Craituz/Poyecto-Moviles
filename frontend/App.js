import React from 'react';
import { View } from 'react-native'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper'; 

import { AppProvider, useAppContext } from './src/context/AppContext';
import { PaperLightTheme, PaperDarkTheme } from './src/theme/PaperTheme';

// --- IMPORTACIONES DE PANTALLAS ---
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreeen'; 
import DashboardTabs from './src/navigation/DashboardTabs';
import NewProductScreen from './src/screens/NewProductScreen';
import EditProductScreen from './src/screens/EditProductScreen';
import EditUserScreen from './src/screens/EditUserScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

function MainLayout() {
  const { isDarkTheme, user, loadingAuth } = useAppContext();
  
  const theme = isDarkTheme ? PaperDarkTheme : PaperLightTheme;

  // Pantalla de carga mientras se verifica la sesión
  if (loadingAuth) {
    return (
      <PaperProvider theme={theme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { color: theme.colors.text, fontWeight: 'bold' },
          }}
        >
          
          {user ? (
            // --- USUARIO LOGUEADO (Cliente o Admin) ---
            <>
              <Stack.Screen name="Principal" component={DashboardTabs} />
              
              {/* Ruta para Crear Producto */}
              <Stack.Screen 
                name="NewProduct" 
                component={NewProductScreen} 
                options={{ 
                  headerShown: true, 
                  title: 'Crear Producto' 
                }} 
              />

              {/* Ruta para Editar Producto */}
              <Stack.Screen 
                name="EditProduct" 
                component={EditProductScreen} 
                options={{ 
                  headerShown: true, 
                  title: 'Editar Producto' 
                }} 
              />

              {/* Ruta para Editar Usuario (Admin) */}
              <Stack.Screen 
                name="EditUser" 
                component={EditUserScreen} 
                options={{ 
                  title: 'Editar Usuario', 
                  headerShown: true 
                }} 
              />

              {/* Ruta para Editar Mi Perfil */}
              <Stack.Screen 
                name="EditProfile" 
                component={EditProfileScreen} 
                options={{ 
                  title: 'Editar Mi Perfil', 
                  headerShown: true 
                }} 
              />
            </>
          ) : (
            // --- USUARIO NO LOGUEADO ---
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen 
                name="ForgotPassword" 
                component={ForgotPasswordScreen} 
                options={{ headerShown: true, title: 'Recuperar contraseña' }}
              />
              <Stack.Screen 
                name="ResetPassword" 
                component={ResetPasswordScreen} 
                options={{ headerShown: true, title: 'Restablecer contraseña' }}
              />
            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </SafeAreaProvider>
  );
}