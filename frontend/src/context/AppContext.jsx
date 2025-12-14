import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const login = () => {
        const demoUser = {
            nombre: "Cristhian Perez",
            correo: "cristhianperez@gmail.com",
            rol: "estudiante",
            ingreso: "2025-12-11",
            bio: "Aplicaciones móviles séptimo A"
        };
        setUser(demoUser);
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