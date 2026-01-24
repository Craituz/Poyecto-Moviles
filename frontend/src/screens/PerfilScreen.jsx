import React from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Text, Avatar, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient";

export default function PerfilScreen({ navigation }) {
  const { user, logout } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;
    const isGuest = !user || user?.id === 0 || user?.roles?.[0]?.name === 'guest';

  const handleLogout = async () => {
    await logout(); 
  };

  const handleDeleteAccount = () => {
    Alert.alert(
        "Eliminar Cuenta",
        "¿Estás seguro? Se borrará toda tu información de forma permanente.",
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Sí, Eliminar", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await apiClient.delete(`/users/${user.id}`);
                        Alert.alert("Cuenta Eliminada", "Lamentamos verte partir.");
                        logout(); 
                    } catch (error) {
                        const msg = error.response?.data?.message || "No se pudo eliminar la cuenta.";
                        Alert.alert("Error", msg);
                    }
                }
            }
        ]
    );
  };

    // Vista para Invitado (no logueado)
    if (isGuest) {
        return (
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.screenTitle, { color: colors.text }]}>Mi Perfil</Text>

                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.profileHeader}>
                        <Avatar.Icon 
                            size={80} 
                            icon="account" 
                            style={{ backgroundColor: '#ccc' }}
                            color="white"
                        />
                    </View>

                    <Text style={[styles.userName, { color: colors.text }]}>Invitado</Text>
                    <View style={{ alignItems: 'center', marginBottom: 15, marginTop: -15 }}>
                        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Navega el catálogo
                        </Text>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Estado</Text>
                        <Text style={[styles.value, { color: colors.text }]}>Modo invitado</Text>
                        <Text style={styles.label}>Acceso</Text>
                        <Text style={[styles.value, { color: colors.text }]}>Regístrate para comprar y guardar tus datos</Text>
                    </View>

                    <Button 
                        mode="contained" 
                        onPress={async () => { await logout(); navigation.navigate('Register'); }} 
                        style={[styles.logoutButton, { backgroundColor: colors.primary }]}
                        icon="account-plus"
                        contentStyle={{ flexDirection: 'row-reverse' }}
                    >
                        Registrate
                    </Button>

                    <Button 
                        mode="outlined" 
                        onPress={async () => { await logout(); navigation.navigate('Login'); }} 
                        style={[styles.editButton, { marginTop: 10 }]} 
                        textColor={colors.secondary}
                        icon="arrow-left"
                    >
                        Volver
                    </Button>
                </View>
            </ScrollView>
        );
    }

    // Datos del usuario (logueado)
    const userName = user.name || "Usuario";
    const userEmail = user.email || "correo@ejemplo.com";
    const userRole = user.roles && user.roles.length > 0 ? user.roles[0].name : "cliente";
    const userPhone = user.phone || "No registrado";
    const userAddress = user.address || "No registrada";
    const userImage = user.image;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.screenTitle, { color: colors.text }]}>Mi Perfil</Text>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        
        <View style={styles.profileHeader}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <View>
                    {userImage ? (
                        <Avatar.Image 
                            size={80} 
                            source={{ uri: userImage }} 
                            style={{ backgroundColor: colors.surfaceVariant }}
                        />
                    ) : (
                        <Avatar.Icon 
                            size={80} 
                            icon="account" 
                            style={{ backgroundColor: '#ccc' }}
                            color="white"
                        />
                    )}
                    
                    <View style={styles.editIconBadge}>
                        <MaterialCommunityIcons name="pencil" size={16} color="white" />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
        
        <Text style={[styles.userName, { color: colors.text }]}>
            {userName}
        </Text>
        
        <View style={{ alignItems: 'center', marginBottom: 15, marginTop: -15 }}>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' }}>
                {userRole === 'admin' ? 'Administrador' : 'Cliente'}
            </Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.label}>Email</Text>
            <Text style={[styles.value, { color: colors.text }]}>{userEmail}</Text>
            
            <Text style={styles.label}>Teléfono</Text>
            <Text style={[styles.value, { color: colors.text }]}>{userPhone}</Text>

            <Text style={styles.label}>Dirección</Text>
            <Text style={[styles.value, { color: colors.text }]}>{userAddress}</Text>
        </View>

        <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('EditProfile')} 
            style={styles.editButton}
            textColor={colors.secondary}
        >
            EDITAR PERFIL
        </Button>

        <Button 
            mode="contained" 
            onPress={handleLogout} 
            style={[styles.logoutButton, { backgroundColor: colors.primary }]}
            icon="logout"
            contentStyle={{ flexDirection: 'row-reverse' }}
        >
            Cerrar Sesión
        </Button>

        <TouchableOpacity onPress={handleDeleteAccount} style={{marginTop: 20, alignItems: 'center'}}>
            <Text style={{color: colors.error, fontSize: 12, textDecorationLine: 'underline'}}>
                Eliminar mi cuenta permanentemente
            </Text>
        </TouchableOpacity>

      </View>

      <View style={[styles.card, { marginTop: 16, marginBottom: 30, backgroundColor: colors.surface }]}>
        <View style={styles.historyHeader}>
             <MaterialCommunityIcons name="history" size={24} color={colors.text} />
             <Text style={[styles.historyTitle, { color: colors.text }]}>Historial de Compras</Text>
        </View>
        
        <Text style={[styles.sectionSubtitle, { color: colors.text }]}>Pedidos Recientes</Text>
        
        <View style={styles.emptyHistory}>
             <View style={styles.emptyBox}>
                <MaterialCommunityIcons name="chevron-down" size={30} color="#ccc" />
             </View>
             <Text style={{ color: colors.secondary, marginTop: 10 }}>
                 Aún no has realizado pedidos
             </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  screenTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      marginTop: 10,
  },
  card: {
      borderRadius: 15,
      padding: 20,
      elevation: 2,
  },
  profileHeader: {
      alignItems: 'center',
      marginBottom: 10,
  },
  editIconBadge: {
      position: 'absolute',
      right: 0, 
      bottom: 0,
      backgroundColor: '#D81B60', 
      borderRadius: 12,
      padding: 6, 
      borderWidth: 2,
      borderColor: 'white' 
  },
  userName: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
  },
  infoSection: { marginBottom: 20 },
  label: { color: '#888', fontSize: 12, marginBottom: 2 },
  value: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  editButton: { borderColor: '#ccc', borderWidth: 1, marginBottom: 10 },
  logoutButton: { marginTop: 5 },
  historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  historyTitle: { fontSize: 18, marginLeft: 10 },
  sectionSubtitle: { fontSize: 16, marginBottom: 15 },
  emptyHistory: { alignItems: 'center', padding: 20 },
  emptyBox: { width: 50, height: 50, borderWidth: 4, borderColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }
});