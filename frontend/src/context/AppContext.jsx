import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient'; 

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);           
  const [userToken, setUserToken] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [loadingAuth, setLoadingAuth] = useState(true); 
  
  const [cart, setCart] = useState([]);             
  const [isDarkTheme, setIsDarkTheme] = useState(false); 
  const [location, setLocation] = useState(null);
  const [fontSize, setFontSize] = useState("medium"); // small, medium, large
  const [contrast, setContrast] = useState("normal"); // normal, high
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const [inAppNotifications, setInAppNotifications] = useState([]);

  // Función para cargar notificaciones del backend
  const fetchNotifications = async (token = null) => {
    try {
      // Solo intentar cargar si hay token (usuario autenticado)
      const tokenToUse = token || userToken;
      if (!tokenToUse) {
        console.log('No hay sesión activa, notificaciones no disponibles');
        return;
      }

      const headers = { Authorization: `Bearer ${tokenToUse}` };
      const response = await apiClient.get('/notifications', { headers });
      
      if (response.data && response.data.notifications) {
        const backendNotifications = response.data.notifications.map(notif => ({
          id: notif.id,
          type: notif.type,
          title: notif.title,
          body: notif.body,
          timestamp: notif.created_at,
          read: !!notif.read_at,
        }));
        
        setInAppNotifications(backendNotifications);
        await AsyncStorage.setItem('inAppNotifications', JSON.stringify(backendNotifications));
      }
    } catch (error) {
      // Silenciar 401 (no autenticado) para modo invitado
      if (error.response && error.response.status === 401) {
        return; // Usuario no autenticado, esto es normal
      }
      // Otros errores sí reportar
      if (error.response) {
        console.error('Error cargando notificaciones:', error.response.status);
      } else {
        console.log('No se pudieron cargar notificaciones del servidor');
      }
    }
  };

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        setLoadingAuth(true);
        
        const token = await AsyncStorage.getItem('token');
        const userInfo = await AsyncStorage.getItem('userInfo');
        
        if (token && userInfo) {
          setUserToken(token);
          setUser(JSON.parse(userInfo));
          
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Cargar notificaciones del servidor al restaurar sesión
          await fetchNotifications(token);
        }

        const themePref = await AsyncStorage.getItem('theme');
        if (themePref === 'dark') {
          setIsDarkTheme(true);
        }

        const savedLocation = await AsyncStorage.getItem('userLocation');
        if (savedLocation) {
          setLocation(JSON.parse(savedLocation));
        }

        const savedFontSize = await AsyncStorage.getItem('fontSize');
        if (savedFontSize) {
          setFontSize(savedFontSize);
        }

        const savedContrast = await AsyncStorage.getItem('contrast');
        if (savedContrast) {
          setContrast(savedContrast);
        }

        const savedNotificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
        if (savedNotificationsEnabled !== null) {
          setNotificationsEnabled(JSON.parse(savedNotificationsEnabled));
        }

        

                const savedInAppNotifications = await AsyncStorage.getItem('inAppNotifications');
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        if (savedInAppNotifications) {
          setInAppNotifications(JSON.parse(savedInAppNotifications));
        }

      } catch (e) {
        console.log("Error cargando datos locales:", e);
      } finally {
        setLoadingAuth(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (userData, tokenData) => {
    setUserToken(tokenData);
    setUser(userData);
    
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;

    if (userData.id !== 0) {
        await AsyncStorage.setItem('token', tokenData);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
    }

    // Cargar notificaciones del backend
    await fetchNotifications(tokenData);
  };

  const logout = async () => {
    setUserToken(null);
    setUser(null);
    
    delete apiClient.defaults.headers.common['Authorization'];

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userInfo');
    
    // Limpiar notificaciones al cerrar sesión
    setInAppNotifications([]);
    await AsyncStorage.removeItem('inAppNotifications');
  };

  const setAuth = async (userData, tokenData = null) => {
    try {
        if (userData) {
            setUser(userData);
            if (userData.id !== 0) {
                await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
            }
        }

        if (tokenData) {
            setUserToken(tokenData);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
            await AsyncStorage.setItem('token', tokenData);
        }
    } catch (error) {
        console.error("Error en setAuth:", error);
    }
  };

  const addToCart = async (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = async (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem('cart');
  };

  const saveLocation = async (coords) => {
    try {
      setLocation(coords);
      await AsyncStorage.setItem('userLocation', JSON.stringify(coords));
      
      // Enviar a la API del backend
      if (userToken && user?.id) {
        try {
          await apiClient.post(`/users/${user.id}/location`, {
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          console.log('Ubicación guardada en el servidor');
        } catch (apiError) {
          console.error('Error guardando ubicación en servidor:', apiError);
        }
      }
    } catch (error) {
      console.error('Error guardando ubicación:', error);
    }
  };

  const toggleTheme = async () => {
    const newThemeStatus = !isDarkTheme;
    setIsDarkTheme(newThemeStatus);
    await AsyncStorage.setItem('theme', newThemeStatus ? 'dark' : 'light');
  };

  const updateFontSize = async (newSize) => {
    setFontSize(newSize);
    await AsyncStorage.setItem('fontSize', newSize);
  };

  const updateContrast = async (newContrast) => {
    setContrast(newContrast);
    await AsyncStorage.setItem('contrast', newContrast);
  };

  const toggleNotificationsEnabled = async () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newStatus));
  };

  

  const addInAppNotification = async (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    setInAppNotifications((prev) => {
      const updated = [newNotification, ...prev];
      AsyncStorage.setItem('inAppNotifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllNotifications = async () => {
    setInAppNotifications([]);
    await AsyncStorage.removeItem('inAppNotifications');
    
    // También limpiar en el backend
    try {
      await apiClient.delete('/notifications');
    } catch (error) {
      console.error('Error eliminando notificaciones del servidor:', error);
    }
  };

  const markNotificationAsRead = async (id) => {
    // Actualizar en el backend
    try {
      await apiClient.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }

    // Actualizar localmente
    setInAppNotifications((prev) => {
      const updated = prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      AsyncStorage.setItem('inAppNotifications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = async (id) => {
    // Eliminar en el backend
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }

    // Eliminar localmente
    setInAppNotifications((prev) => {
      const updated = prev.filter((notif) => notif.id !== id);
      AsyncStorage.setItem('inAppNotifications', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      userToken, 
      token: userToken, 
      login,
      logout,
      setAuth, 
      isLoading,
      loadingAuth,
      
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      location,
      saveLocation,
      
      fontSize,
      updateFontSize,
      contrast,
      updateContrast,
      notificationsEnabled,
      toggleNotificationsEnabled,
      
      
      inAppNotifications,
      addInAppNotification,
      markNotificationAsRead,
      deleteNotification,
      clearAllNotifications,
      fetchNotifications,
      
      isDarkTheme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
