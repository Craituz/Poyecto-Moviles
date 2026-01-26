import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import apiClient from '../services/apiClient';

const AdminNotificationsScreen = ({ navigation }) => {
  const { user, pushToken, inAppNotifications, markNotificationAsRead, deleteNotification, clearAllNotifications } = useAppContext();
  const [databaseNotifications, setDatabaseNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('database'); // 'database' o 'inapp'

  useEffect(() => {
    loadDatabaseNotifications();
  }, []);

  const loadDatabaseNotifications = async () => {
    try {
      setLoading(true);
      // En Laravel, las notificaciones se guardan en la tabla notifications
      // Aquí puedes crear un endpoint específico en el backend si lo necesitas
      // Por ahora, mostraremos las notificaciones in-app
      setLoading(false);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDatabaseNotifications();
    setRefreshing(false);
  };

  const handleDeleteNotification = (id) => {
    Alert.alert(
      'Eliminar Notificación',
      '¿Estás seguro de que deseas eliminar esta notificación?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => deleteNotification(id),
          style: 'destructive',
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpiar Todas',
      '¿Eliminar todas las notificaciones?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => clearAllNotifications(),
          style: 'destructive',
        },
      ]
    );
  };

  const renderInAppNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        item.read && styles.notificationCardRead,
      ]}
      onPress={() => markNotificationAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationIcon}>{item.icon || '🔔'}</Text>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationBody}>{item.body}</Text>
          {item.type === 'new_order' && (
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate('PedidosScreen', { orderId: item.order_id })}
            >
              <Text style={styles.viewButtonText}>Ver Pedido</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );

  const renderDatabaseNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        item.read_at && styles.notificationCardRead,
      ]}
      onPress={() => markNotificationAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationIcon}>{item.data?.icon || '🔔'}</Text>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.data?.title}</Text>
          <Text style={styles.notificationBody}>{item.data?.body}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.timestamp}>
        {new Date(item.created_at).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );

  const notificationsToShow = activeTab === 'database' ? databaseNotifications : inAppNotifications;
  const isEmpty = notificationsToShow.length === 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📢 Notificaciones</Text>
        <Text style={styles.headerSubtitle}>
          Token Push: {pushToken ? '✅ Activo' : '❌ Inactivo'}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inapp' && styles.tabActive]}
          onPress={() => setActiveTab('inapp')}
        >
          <Text style={[styles.tabText, activeTab === 'inapp' && styles.tabTextActive]}>
            In-App ({inAppNotifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'database' && styles.tabActive]}
          onPress={() => setActiveTab('database')}
        >
          <Text style={[styles.tabText, activeTab === 'database' && styles.tabTextActive]}>
            Base de Datos ({databaseNotifications.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
      ) : isEmpty ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No hay notificaciones</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={notificationsToShow}
            keyExtractor={(item) => item.id.toString()}
            renderItem={activeTab === 'database' ? renderDatabaseNotification : renderInAppNotification}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContent}
          />

          {notificationsToShow.length > 0 && (
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearAllButtonText}>Limpiar Todas</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#FF6B6B',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    padding: 10,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    elevation: 2,
  },
  notificationCardRead: {
    opacity: 0.6,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  viewButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  clearAllButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AdminNotificationsScreen;
