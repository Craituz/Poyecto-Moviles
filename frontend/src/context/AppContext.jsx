import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../services/apiClient";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [cart, setCart] = useState([]);


    const login = async (userData, tokenValue) => {
        try {
            setUser(userData);
            setToken(tokenValue);

            await AsyncStorage.setItem("token", tokenValue);
            await AsyncStorage.setItem("user", JSON.stringify(userData));
            
            console.log("💾 Sesión guardada: ", userData.email);
            return true;
        } catch (error) {
            console.log("Error guardando sesión:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await apiClient.post("/logout");
        } catch (e) {
            console.log("Logout local (sin conexión al server)");
        }
        
        setUser(null);
        setToken(null);
        setCart([]); 
        
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
    };

    useEffect(() => {
        const loadSession = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                const storedUser = await AsyncStorage.getItem("user");

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.log("Error recuperando sesión:", e);
            } finally {
                setLoadingAuth(false);
            }
        };
        loadSession();
    }, []);

    const toggleTheme = () => setIsDarkTheme((prev) => !prev);
    const addToCart = (product) => setCart((prev) => [...prev, product]);
    const clearCart = () => setCart([]);

    const value = useMemo(() => ({
        user,
        token,
        loadingAuth,
        login,
        logout,
        isDarkTheme,
        toggleTheme,
        cart,
        addToCart,
        clearCart
    }), [user, token, loadingAuth, isDarkTheme, cart]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);