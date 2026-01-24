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
        }

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

  const login = async (userData, tokenData) => {
    setUserToken(tokenData);
    setUser(userData);
    
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;

    if (userData.id !== 0) {
        await AsyncStorage.setItem('token', tokenData);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUser(null);
    
    delete apiClient.defaults.headers.common['Authorization'];

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userInfo');
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

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleTheme = async () => {
    const newThemeStatus = !isDarkTheme;
    setIsDarkTheme(newThemeStatus);
    await AsyncStorage.setItem('theme', newThemeStatus ? 'dark' : 'light');
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
      
      isDarkTheme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);