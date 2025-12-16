import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // MODIFICADO: Función de login actualizada
    const login = (username, password) => {
        
        // 1. CASO ADMIN: Credenciales específicas (Correo y Contraseña exactos)
        // Se cambió la validación para requerir el correo completo
        if (username === 'admin@yeliscake.com' && password === 'admin123') {
            setUser({
                nombre: "Administrador",
                correo: "admin@yeliscake.com",
                rol: "admin", // <--- ESTO ACTIVA EL PANEL DE ADMINISTRACIÓN
                ingreso: new Date().toISOString().split('T')[0],
                bio: "Gerente General"
            });
            return true; // Login exitoso
        } 
        
        // 2. CASO CLIENTE: Cualquier otra credencial válida
        // Si ingresan cualquier otra cosa, entran como cliente normal (Cristhian)
        else if (username && password) {
            setUser({
                nombre: "Cristhian Perez",
                // Si ingresaron un correo, lo usamos; si no, ponemos el de default
                correo: username.includes('@') ? username : "cristhianperez@gmail.com",
                rol: "client", // <--- Rol de cliente (NO ve el panel admin)
                ingreso: "2025-12-11",
                bio: "Aplicaciones móviles séptimo A"
            });
            return true;
        }

        // 3. Si faltan datos o las credenciales no coinciden con nada lógico
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const toggleTheme = () => {
        setIsDarkTheme((prev) => !prev);
    };

    return (
        <AppContext.Provider value={{ 
            user, 
            login, 
            logout, 
            isDarkTheme, 
            toggleTheme 
        }}>
            {children}
        </AppContext.Provider>
    );
}
export const useAppContext = () => {
    return useContext(AppContext);
};