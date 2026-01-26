// Helper para obtener tamaños de fuente basados en la preferencia del usuario
export const getFontSize = (baseName, appFontSize = "medium") => {
  const fontSizeMap = {
    small: {
      xs: 10,
      sm: 12,
      base: 13,
      lg: 14,
      xl: 16,
      "2xl": 18,
      "3xl": 20,
      "4xl": 24,
      "5xl": 28,
    },
    medium: {
      xs: 11,
      sm: 13,
      base: 14,
      lg: 16,
      xl: 18,
      "2xl": 20,
      "3xl": 22,
      "4xl": 26,
      "5xl": 30,
    },
    large: {
      xs: 12,
      sm: 14,
      base: 15,
      lg: 18,
      xl: 20,
      "2xl": 22,
      "3xl": 24,
      "4xl": 28,
      "5xl": 32,
    },
  };

  return fontSizeMap[appFontSize]?.[baseName] || fontSizeMap["medium"][baseName] || 14;
};

// Helper para obtener el peso de fuente basado en contraste
export const getContrastStyle = (contrast = "normal") => {
  if (contrast === "high") {
    return {
      fontWeight: "bold",
      letterSpacing: 0.5,
    };
  }
  return {};
};
