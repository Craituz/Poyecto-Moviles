import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // 🛒 CARRITO
    const [cart, setCart] = useState([]);

    // LOGIN
    const login = (username, password) => {
        if (username === 'admin@yeliscake.com' && password === 'admin123') {
            setUser({
                nombre: "Administrador",
                correo: "admin@yeliscake.com",
                rol: "admin",
                ingreso: new Date().toISOString().split('T')[0],
                bio: "Gerente General"
            });
            return true;
        } 
        else if (username && password) {
            setUser({
                nombre: "Cristhian Perez",
                correo: username.includes('@') ? username : "cristhianperez@gmail.com",
                rol: "client",
                ingreso: "2025-12-11",
                bio: "Aplicaciones móviles séptimo A"
            });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setCart([]); // vaciar carrito al cerrar sesión
    };

    const toggleTheme = () => {
        setIsDarkTheme((prev) => !prev);
    };

    // ➕ Añadir producto al carrito
    const addToCart = (product) => {
        setCart((prev) => [...prev, product]);
    };

    // ❌ Vaciar carrito
    const clearCart = () => {
        setCart([]);
    };

    return (
        <AppContext.Provider value={{ 
            user, 
            login, 
            logout, 
            isDarkTheme, 
            toggleTheme,
            cart,
            addToCart,
            clearCart
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
