import {
MD3LightTheme as DefaultLightTheme,
MD3DarkTheme as DefaultDarkTheme,
MD3LightTheme as DefaultTheme,
} from "react-native-paper";
export const PaperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#D81B60", // Pink
    secondary: "#795548", // Brown
    background: "#FFF0F5", // Light Pinkish White
    surface: "#ffffff",
    text: "#4E342E", // Dark Brown
    error: "#f83737ff",
  },
};

export const PaperLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    primary: "#D81B60",
    secondary: "#795548",
    background: "#FFF0F5",
    text: "#4E342E",
  },
};

export const PaperDarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    primary: "#F48FB1", // Light Pink for Dark Mode
    secondary: "#A1887F", // Light Brown
    background: "#2C1B18", // Very Dark Brown
    surface: "#3E2723", // Dark Brown Surface
    text: "#FCE4EC", // Very Light Pink
    onSurface: "#FCE4EC",
  },
};