import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Switch, List, useTheme } from 'react-native-paper';
import apiClient from '../services/apiClient';

export default function EditUserScreen({ route, navigation }) {
  const { userToEdit } = route.params;
  const theme = useTheme();

  const [name, setName] = useState(userToEdit.name);
  const [email, setEmail] = useState(userToEdit.email);
  
  // Verificamos si actualmente es admin para activar el switch
  const currentRole = userToEdit.roles && userToEdit.roles.length > 0 ? userToEdit.roles[0].name : 'cliente';
  const [isAdmin, setIsAdmin] = useState(currentRole === 'admin');
  
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
        await apiClient.put(`/users/${userToEdit.id}`, {
            name,
            email,
            role_name: isAdmin ? 'admin' : 'cliente' // Enviamos el rol según el switch
        });

        Alert.alert("Éxito", "Usuario actualizado correctamente.");
        navigation.goBack(); // Volver a la lista
        
    } catch (error) {
        // --- AQUÍ ESTÁ EL CAMBIO PARA EVITAR EL ERROR EN CONSOLA ---
        const status = error.response?.status;
        const serverMessage = error.response?.data?.message;

        // Si es 403 (Forbidden), es nuestra regla de seguridad del "Último Admin".
        // NO imprimimos console.error para que no salga la caja roja en Expo.
        if (status === 403) {
            Alert.alert("Aviso de Seguridad", serverMessage);
        } else {
            // Si es otro error (Internet, Servidor caído), sí lo imprimimos para depurar.
            console.error("Error al actualizar:", error);
            Alert.alert("Error", "No se pudo actualizar el usuario. Verifica tu conexión.");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{marginBottom: 20, color: theme.colors.primary}}>
        Editar Usuario
      </Text>

      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* SECCIÓN DE ROL */}
      <List.Section>
        <List.Subheader>Permisos</List.Subheader>
        <List.Item
            title="Es Administrador"
            description="Si activas esto, el usuario tendrá acceso total."
            left={() => <List.Icon icon="shield-account" />}
            right={() => (
                <Switch 
                    value={isAdmin} 
                    onValueChange={setIsAdmin} 
                    color={theme.colors.primary} 
                />
            )}
        />
      </List.Section>

      <Button 
        mode="contained" 
        onPress={handleUpdate} 
        loading={loading}
        style={{marginTop: 20}}
      >
        Guardar Cambios
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  input: { marginBottom: 15 }
});