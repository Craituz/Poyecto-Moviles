import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Text, Avatar, Button, useTheme, ActivityIndicator, Chip, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../services/apiClient";
import { getFontSize, getContrastStyle } from "../services/fontSizeHelper";

export default function PerfilScreen({ navigation }) {
  const { user, logout, fontSize, contrast } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;
  const isGuest = !user || user?.id === 0 || user?.roles?.[0]?.name === 'guest';
  
  // Estados para el historial.
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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

  // Obtener historial de pedidos (solo entregados y cancelados)
  const fetchOrderHistory = async () => {
    if (isGuest) {
      setLoadingOrders(false);
      return;
    }
    
    try {
      setLoadingOrders(true);
      const response = await apiClient.get('/orders');
      
      // Filtrar solo pedidos completados (entregado o cancelado)
      const completedOrders = response.data.filter(
        order => order.status === 'entregado' || order.status === 'cancelado'
      );
      
      setOrders(completedOrders);
    } catch (error) {
      console.error('Error cargando historial:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Recargar historial cada vez que se entra a la pantalla
  useFocusEffect(
    React.useCallback(() => {
      fetchOrderHistory();
    }, [isGuest])
  );

  // Helper para colores de estado
  const getStatusColor = (status) => {
    return status === 'entregado' ? '#4CAF50' : '#F44336';
  };

    // Vista para Invitado (no logueado)
    if (isGuest) {
        return (
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.screenTitle, { color: colors.text, fontSize: getFontSize("2xl", fontSize), ...getContrastStyle(contrast) }]}>Mi Perfil</Text>

                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.profileHeader}>
                        <Avatar.Icon 
                            size={80} 
                            icon="account" 
                            style={{ backgroundColor: '#ccc' }}
                            color="white"
                        />
                    </View>

                    <Text style={[styles.userName, { color: colors.text, fontSize: getFontSize("xl", fontSize) }]}>Invitado</Text>
                    <View style={{ alignItems: 'center', marginBottom: 15, marginTop: -15 }}>
                        <Text style={{ color: colors.primary, fontSize: getFontSize("xs", fontSize), fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Navega el catálogo
                        </Text>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={[styles.label, { fontSize: getFontSize("xs", fontSize) }]}>Estado</Text>
                        <Text style={[styles.value, { color: colors.text, fontSize: getFontSize("base", fontSize) }]}>Modo invitado</Text>
                        <Text style={[styles.label, { fontSize: getFontSize("xs", fontSize) }]}>Acceso</Text>
                        <Text style={[styles.value, { color: colors.text, fontSize: getFontSize("base", fontSize) }]}>Regístrate para comprar y guardar tus datos</Text>
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
      <Text style={[styles.screenTitle, { color: colors.text, fontSize: getFontSize("2xl", fontSize), ...getContrastStyle(contrast) }]}>Mi Perfil</Text>

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
        
        <Text style={[styles.userName, { color: colors.text, fontSize: getFontSize("xl", fontSize) }]}>
            {userName}
        </Text>
        
        <View style={{ alignItems: 'center', marginBottom: 15, marginTop: -15 }}>
            <Text style={{ color: colors.primary, fontSize: getFontSize("xs", fontSize), fontWeight: 'bold', textTransform: 'uppercase' }}>
                {userRole === 'admin' ? 'Administrador' : 'Cliente'}
            </Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={[styles.label, { fontSize: getFontSize("xs", fontSize) }]}>Email</Text>
            <Text style={[styles.value, { color: colors.text, fontSize: getFontSize("base", fontSize) }]}>{userEmail}</Text>
            
            <Text style={[styles.label, { fontSize: getFontSize("xs", fontSize) }]}>Teléfono</Text>
            <Text style={[styles.value, { color: colors.text, fontSize: getFontSize("base", fontSize) }]}>{userPhone}</Text>

            <Text style={[styles.label, { fontSize: getFontSize("xs", fontSize) }]}>Dirección</Text>
            <Text style={[styles.value, { color: colors.text, fontSize: getFontSize("base", fontSize) }]}>{userAddress}</Text>
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
            <Text style={{color: colors.error, fontSize: getFontSize("xs", fontSize), textDecorationLine: 'underline'}}>
                Eliminar mi cuenta permanentemente
            </Text>
        </TouchableOpacity>

      </View>

      <View style={[styles.card, { marginTop: 16, marginBottom: 30, backgroundColor: colors.surface }]}>
        <View style={styles.historyHeader}>
             <MaterialCommunityIcons name="history" size={24} color={colors.text} />
             <Text style={[styles.historyTitle, { color: colors.text, fontSize: getFontSize("lg", fontSize) }]}>Historial de Compras</Text>
        </View>
        
        <Text style={[styles.sectionSubtitle, { color: colors.text, fontSize: getFontSize("lg", fontSize), ...getContrastStyle(contrast) }]}>Pedidos Finalizados</Text>
        
        {loadingOrders ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyHistory}>
               <View style={styles.emptyBox}>
                  <MaterialCommunityIcons name="chevron-down" size={30} color="#ccc" />
               </View>
               <Text style={{ color: colors.secondary, marginTop: 10 }}>
                   No tienes pedidos finalizados
               </Text>
          </View>
        ) : (
          <View>
            {orders.slice(0, 5).map((order) => {
              const date = new Date(order.created_at).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });
              
              return (
                <View key={order.id} style={styles.orderItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={[styles.orderTitle, { color: colors.text, fontSize: getFontSize("base", fontSize) }]}>Pedido #{order.id}</Text>
                    <Chip
                      style={{ backgroundColor: getStatusColor(order.status), height: 28 }}
                      textStyle={{ color: 'white', fontSize: getFontSize("xs", fontSize), fontWeight: 'bold' }}
                    >
                      {order.status.toUpperCase()}
                    </Chip>
                  </View>
                  
                  <Text style={{ fontSize: getFontSize("xs", fontSize), color: colors.secondary, marginBottom: 4 }}>{date}</Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text style={{ fontSize: getFontSize("xs", fontSize), color: colors.secondary }}>
                      {order.items?.length || 0} producto(s)
                    </Text>
                    <Text style={{ fontSize: getFontSize("lg", fontSize), fontWeight: 'bold', color: colors.primary, ...getContrastStyle(contrast) }}>
                      ${Number(order.total).toFixed(2)}
                    </Text>
                  </View>
                  
                  {order !== orders[orders.length > 5 ? 4 : orders.length - 1] && (
                    <Divider style={{ marginTop: 12 }} />
                  )}
                </View>
              );
            })}
            
            {orders.length > 5 && (
              <TouchableOpacity onPress={() => navigation.navigate('Pedidos')} style={{ marginTop: 10 }}>
                <Text style={{ color: colors.primary, textAlign: 'center', fontSize: getFontSize("base", fontSize) }}>
                  Ver todos los pedidos ({orders.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
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
  emptyBox: { width: 50, height: 50, borderWidth: 4, borderColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  orderItem: { marginBottom: 12 },
  orderTitle: { fontSize: 16, fontWeight: 'bold' }
});
