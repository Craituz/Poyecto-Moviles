import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert, RefreshControl } from "react-native";
import { Text, Card, Avatar, IconButton, Chip, Button, useTheme, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../../services/apiClient";
import { useAppContext } from "../../context/AppContext";

export default function AdminUsers({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  const { user: currentUser } = useAppContext(); 

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- 1. CARGAR USUARIOS ---
  const fetchUsers = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await apiClient.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // --- 2. ELIMINAR USUARIO (TU LÓGICA ROBUSTA) ---
  const handleDelete = (id, userName) => {
    // Evitar borrarse a uno mismo
    if (id === currentUser.id) {
        Alert.alert("Acción no permitida", "No puedes eliminar tu propia cuenta desde aquí.");
        return;
    }

    Alert.alert(
      "Confirmar Eliminación",
      `¿Estás seguro de eliminar a ${userName}? Esta acción es irreversible.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(`/users/${id}`);
              Alert.alert("Éxito", "El usuario ha sido eliminado correctamente.");
              // Actualización optimista (más rápido que recargar todo)
              setUsers(prev => prev.filter(u => u.id !== id));
            } catch (error) {
              const status = error.response?.status;
              const serverMessage = error.response?.data?.message;

              if (status === 403) {
                  Alert.alert("Aviso de Seguridad", serverMessage || "No tienes permisos para eliminar este usuario.");
              } else {
                  console.error("Error al eliminar:", error);
                  Alert.alert("Error", "Ocurrió un problema técnico al eliminar.");
              }
            }
          },
        },
      ]
    );
  };

  // --- 3. RENDERIZADO (CON FOTOS) ---
  const renderItem = ({ item }) => {
    // Detectar rol
    const roleName = item.roles && item.roles.length > 0 ? item.roles[0].name : 'cliente';
    const isAdmin = roleName === 'admin';

    // Calcular iniciales por si no tiene foto
    const initials = item.name 
        ? item.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() 
        : "?";

    return (
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title
          title={item.name}
          subtitle={item.email}
          // LÓGICA DE FOTO HÍBRIDA
          left={(props) => (
             item.image ? (
                <Avatar.Image 
                    {...props} 
                    source={{ uri: item.image }} 
                    size={45} 
                />
             ) : (
                <Avatar.Text 
                    {...props} 
                    label={initials} 
                    size={45} 
                    style={{ backgroundColor: isAdmin ? colors.primary : colors.secondary }}
                    color="white"
                />
             )
          )}
          right={(props) => (
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                <Chip 
                    icon={isAdmin ? "shield-check" : "account"} 
                    style={{backgroundColor: isAdmin ? '#E3F2FD' : '#F5F5F5'}}
                    textStyle={{fontSize: 11}}
                >
                    {roleName.toUpperCase()}
                </Chip>
            </View>
          )}
        />
        
        <Card.Content>
             <Text style={{fontSize: 12, color: colors.secondary}}>
                📞 {item.phone || "Sin teléfono"}
             </Text>
        </Card.Content>

        <Card.Actions style={{justifyContent: 'flex-end'}}>
             {/* Este botón puede llevar a una pantalla de edición si la creas en el futuro */}
             <Button 
                mode="text" 
                compact
                textColor={colors.primary}
                onPress={() => console.log("Editar rol pendiente")}
             >
                Editar Rol
             </Button>
             
             <IconButton 
                icon="delete" 
                iconColor={colors.error} 
                size={22} 
                onPress={() => handleDelete(item.id, item.name)} 
             />
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Gestión de Usuarios</Text>
      
      {loading ? (
        <ActivityIndicator size="large" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
             <Text style={{textAlign: 'center', marginTop: 30, color: '#888'}}>
                 No hay usuarios registrados.
             </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, marginTop: 10 },
  card: { marginBottom: 12, borderRadius: 12, elevation: 2 },
});