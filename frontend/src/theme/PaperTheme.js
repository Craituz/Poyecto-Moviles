import {
MD3LightTheme as DefaultLightTheme,
MD3DarkTheme as DefaultDarkTheme,
MD3LightTheme as DefaultTheme,
} from "react-native-paper";

export const PaperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#C2185B", // Rosa elegante (Magenta oscuro)
    secondary: "#D32F2F", // Rojo suave para acentos
    background: "#FAFAFA", // Blanco muy suave (casi gris claro)
    surface: "#FFFFFF", // Blanco puro
    text: "#212121", // Gris muy oscuro/negro
    error: "#D32F2F",
    tertiary: "#7B1FA2", // Púrpura para elementos especiales
  },
};

export const PaperLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    primary: "#C2185B", // Rosa elegante
    secondary: "#D32F2F", // Rojo suave
    background: "#FAFAFA", // Blanco suave
    surface: "#FFFFFF", // Blanco puro
    text: "#212121", // Texto oscuro
    tertiary: "#7B1FA2", // Púrpura
  },
};

export const PaperDarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    primary: "#F06292", // Rosa claro para dark mode
    secondary: "#EF5350", // Rojo claro
    background: "#121212", // Gris muy oscuro (no café)
    surface: "#1E1E1E", // Gris oscuro para cards
    text: "#FFFFFF", // Blanco puro
    onSurface: "#FFFFFF", // Blanco para elementos sobre surface
    tertiary: "#CE93D8", // Púrpura claro
    error: "#EF5350",
  },
};