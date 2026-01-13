import React from 'react';
import { View } from 'react-native'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper'; 

import { AppProvider, useAppContext } from './src/context/AppContext';
import { PaperLightTheme, PaperDarkTheme } from './src/theme/PaperTheme';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreeen'; 
import DashboardTabs from './src/navigation/DashboardTabs';

const Stack = createNativeStackNavigator();

function MainLayout() {
  const { isDarkTheme, user, loadingAuth } = useAppContext();
  
  const theme = isDarkTheme ? PaperDarkTheme : PaperLightTheme;

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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          
          {user ? (
            
            <Stack.Screen name="Principal" component={DashboardTabs} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
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