import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient'; // <--- IMPORTANTE: Importar tu cliente API

// Creamos el contexto
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- 1. ESTADOS ---
  const [user, setUser] = useState(null);           // Datos del usuario
  const [userToken, setUserToken] = useState(null); // Token JWT
  const [isLoading, setIsLoading] = useState(false); 
  const [loadingAuth, setLoadingAuth] = useState(true); 
  
  const [cart, setCart] = useState([]);             // Carrito
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Tema

  // --- 2. EFECTO INICIAL (Recuperar sesión y tema) ---
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        setLoadingAuth(true);
        
        // A. Recuperar Sesión
        const token = await AsyncStorage.getItem('token');
        const userInfo = await AsyncStorage.getItem('userInfo');
        
        if (token && userInfo) {
          setUserToken(token);
          setUser(JSON.parse(userInfo));
          
          // CRUCIAL: Configurar Axios con el token recuperado
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // B. Recuperar Tema
        const themePref = await AsyncStorage.getItem('theme');
        if (themePref === 'dark') {
          setIsDarkTheme(true);
        }

      } catch (e) {
        console.log("Error cargando datos locales:", e);
      } finally {
        setLoadingAuth(false);
      }
    };

    loadStorageData();
  }, []);

  // --- 3. FUNCIONES DE AUTENTICACIÓN ---
  const login = async (userData, tokenData) => {
    setUserToken(tokenData);
    setUser(userData);
    
    // Configurar Axios para futuras peticiones
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;

    // Solo guardamos en disco si NO es invitado (ID 0)
    if (userData.id !== 0) {
        await AsyncStorage.setItem('token', tokenData);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUser(null);
    
    // Limpiar Axios
    delete apiClient.defaults.headers.common['Authorization'];

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userInfo');
  };

  // --- 4. NUEVA FUNCIÓN: SETAUTH (Para actualizar perfil sin salir) ---
  const setAuth = async (userData, tokenData = null) => {
    try {
        // Actualizar datos del usuario (Nombre, Foto, etc.)
        if (userData) {
            setUser(userData);
            if (userData.id !== 0) {
                await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
            }
        }

        // Actualizar Token (si cambió)
        if (tokenData) {
            setUserToken(tokenData);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
            await AsyncStorage.setItem('token', tokenData);
        }
    } catch (error) {
        console.error("Error en setAuth:", error);
    }
  };

  // --- 5. FUNCIONES DEL CARRITO ---
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- 6. FUNCIONES DEL TEMA ---
  const toggleTheme = async () => {
    const newThemeStatus = !isDarkTheme;
    setIsDarkTheme(newThemeStatus);
    await AsyncStorage.setItem('theme', newThemeStatus ? 'dark' : 'light');
  };

  // --- 7. EXPORTAR EL CONTEXTO ---
  return (
    <AppContext.Provider value={{
      // Auth
      user,
      userToken, // Ojo: en algunos componentes usas 'token', asegúrate de usar 'userToken' o alias
      token: userToken, // Alias por compatibilidad si usas 'token' en otros lados
      login,
      logout,
      setAuth, // <--- ¡AQUÍ ESTÁ LA SOLUCIÓN AL ERROR!
      isLoading,
      loadingAuth,
      
      // Carrito
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      
      // Tema
      isDarkTheme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado
export const useAppContext = () => useContext(AppContext);