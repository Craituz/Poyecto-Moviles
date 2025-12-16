import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Avatar, Button, useTheme, Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
// 1. IMPORTAR ACCIONES DE NAVEGACIÓN
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function PerfilScreen() {
  // 2. USAMOS 'logout' DEL CONTEXTO EN LUGAR DE 'setUser' MANUAL
  const { user, logout } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;
  
  // 3. HOOK DE NAVEGACIÓN
  const navigation = useNavigation();

  // 4. FUNCIÓN DE CIERRE DE SESIÓN SEGURO
  const handleLogout = () => {
    // A. Limpia el usuario del contexto global
    logout(); 
    
    // B. Resetea la pila de navegación para ir al Login y borrar historial
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  // Protección simple por si el usuario es null momentáneamente
  if (!user) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.screenTitle, { color: colors.text }]}>Mi Perfil</Text>

      {/* TARJETA DE INFORMACIÓN DE USUARIO */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.profileHeader}>
            <Avatar.Icon 
                size={80} 
                icon="account" 
                style={{ backgroundColor: '#ccc' }}
                color="white"
            />
            <View style={styles.editIconBadge}>
                 <MaterialCommunityIcons name="pencil" size={16} color="white" />
            </View>
        </View>
        
        <Text style={[styles.userName, { color: colors.text }]}>
            {user.nombre || "Usuario"}
        </Text>
        
        {/* Mostramos el Rol como una pequeña etiqueta */}
        <View style={{ alignItems: 'center', marginBottom: 15, marginTop: -15 }}>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' }}>
                {user.rol === 'admin' ? 'Administrador' : 'Cliente'}
            </Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.label}>Email</Text>
            <Text style={[styles.value, { color: colors.text }]}>
                {user.correo || "correo@ejemplo.com"}
            </Text>
            
            <Text style={styles.label}>Teléfono</Text>
            <Text style={[styles.value, { color: colors.text }]}>096 350 7429</Text>

            <Text style={styles.label}>Dirección</Text>
            <Text style={[styles.value, { color: colors.text }]}>Villa María</Text>
        </View>

        <Button 
            mode="outlined" 
            onPress={() => {}} 
            style={styles.editButton}
            textColor={colors.secondary}
        >
            EDITAR PERFIL
        </Button>

        <Button 
            mode="contained" 
            onPress={handleLogout} // <--- USAMOS LA NUEVA FUNCIÓN AQUÍ
            style={[styles.logoutButton, { backgroundColor: colors.primary }]}
            icon="logout"
            contentStyle={{ flexDirection: 'row-reverse' }}
        >
            Cerrar Sesión
        </Button>
      </View>

      {/* SECCIÓN DE HISTORIAL */}
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
      position: 'relative',
  },
  editIconBadge: {
      position: 'absolute',
      right: '35%',
      bottom: 0,
      backgroundColor: '#D81B60', // Pink
      borderRadius: 12,
      padding: 4,
  },
  userName: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
  },
  infoSection: {
      marginBottom: 20,
  },
  label: {
      color: '#888',
      fontSize: 12,
      marginBottom: 2,
  },
  value: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 15,
  },
  editButton: {
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 10,
  },
  logoutButton: {
      marginTop: 5,
  },
  historyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  historyTitle: {
      fontSize: 18,
      marginLeft: 10,
  },
  sectionSubtitle: {
      fontSize: 16,
      marginBottom: 15,
  },
  emptyHistory: {
      alignItems: 'center',
      padding: 20,
  },
  emptyBox: {
      width: 50,
      height: 50,
      borderWidth: 4,
      borderColor: '#e0e0e0',
      justifyContent: 'center',
      alignItems: 'center',
  }
});
