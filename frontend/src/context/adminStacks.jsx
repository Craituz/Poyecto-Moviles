import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboard from '../screens/admin/AdminDashboard';
import NewProductScreen from '../screens/admin/NewProductScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminHome"
        component={AdminDashboard}
        options={{ title: 'Administración' }}
      />
      <Stack.Screen
        name="NewProduct"
        component={NewProductScreen}
        options={{ title: 'Nuevo Producto' }}
      />
    </Stack.Navigator>
  );
}
