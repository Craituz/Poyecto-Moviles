import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Card, IconButton, useTheme, Divider, Button, Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import { getFontSize, getContrastStyle } from "../services/fontSizeHelper";

export default function NotificacionesScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const { 
    inAppNotifications, 
    markNotificationAsRead, 
    deleteNotification, 
    clearAllNotifications,
    fetchNotifications,
    fontSize,
    contrast,
    user,
    userToken
  } = useAppContext();

  // Recargar notificaciones al abrir la pantalla (solo si está autenticado)
  useEffect(() => {
    if (userToken) {
      fetchNotifications();
    }
  }, []);

  const unreadCount = inAppNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return 'package-variant';
      case 'promotion': return 'sale';
      case 'system': return 'information';
      default: return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order': return '#4CAF50';
      case 'promotion': return '#FF9800';
      case 'system': return '#2196F3';
      default: return colors.primary;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontSize: getFontSize("2xl", fontSize), ...getContrastStyle(contrast) }]}>
          Notificaciones
        </Text>
        {unreadCount > 0 && (
          <Chip style={{ backgroundColor: colors.primary }}>
            <Text style={{ color: 'white', fontSize: getFontSize("xs", fontSize), fontWeight: 'bold' }}>
              {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
            </Text>
          </Chip>
        )}
      </View>

      {inAppNotifications.length > 0 && (
        <Button 
          mode="text" 
          onPress={clearAllNotifications}
          style={{ alignSelf: 'flex-end', marginRight: 16 }}
          textColor={colors.error}
        >
          Limpiar todas
        </Button>
      )}

      <ScrollView style={styles.scrollView}>
        {inAppNotifications.length === 0 ? (
          // Estado vacío
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-off-outline" size={80} color="#ccc" />
            <Text style={[styles.emptyText, { color: colors.secondary, fontSize: getFontSize("lg", fontSize) }]}>
              No tienes notificaciones
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.secondary, fontSize: getFontSize("sm", fontSize) }]}>
              Aquí verás actualizaciones de tus pedidos y promociones
            </Text>
          </View>
        ) : (
          inAppNotifications.map((notification, index) => (
            <TouchableOpacity 
              key={notification.id} 
              onPress={() => handleNotificationPress(notification)}
              activeOpacity={0.7}
            >
              <Card 
                style={[
                  styles.notificationCard,
                  { 
                    backgroundColor: notification.read ? colors.surface : colors.surfaceVariant,
                    borderLeftWidth: 4,
                    borderLeftColor: getNotificationColor(notification.type)
                  }
                ]}
              >
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) + '20' }]}>
                    <MaterialCommunityIcons 
                      name={getNotificationIcon(notification.type)} 
                      size={24} 
                      color={getNotificationColor(notification.type)} 
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <View style={styles.headerRow}>
                      <Text 
                        style={[
                          styles.notificationTitle, 
                          { 
                            color: colors.text, 
                            fontWeight: notification.read ? 'normal' : 'bold',
                            fontSize: getFontSize("base", fontSize)
                          }
                        ]}
                      >
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                      )}
                    </View>

                    <Text 
                      style={[
                        styles.notificationBody, 
                        { 
                          color: colors.secondary,
                          fontSize: getFontSize("sm", fontSize)
                        }
                      ]}
                      numberOfLines={2}
                    >
                      {notification.body}
                    </Text>

                    <Text 
                      style={[
                        styles.notificationTime, 
                        { 
                          color: colors.secondary,
                          fontSize: getFontSize("xs", fontSize)
                        }
                      ]}
                    >
                      {formatDate(notification.timestamp)}
                    </Text>
                  </View>

                  <IconButton
                    icon="close"
                    size={20}
                    iconColor={colors.secondary}
                    onPress={() => deleteNotification(notification.id)}
                  />
                </View>
              </Card>
              {index < inAppNotifications.length - 1 && <Divider />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  notificationCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationBody: {
    marginBottom: 4,
  },
  notificationTime: {
    fontStyle: 'italic',
  },
});
