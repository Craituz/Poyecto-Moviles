import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Switch, List, useTheme } from "react-native-paper";
import { useAppContext } from "../context/AppContext";

export default function ConfigScreen() {
  const { isDarkTheme, toggleTheme } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title title="Configuración" titleStyle={{ color: colors.text }} />
        <Card.Content>
          <List.Item
            title="Tema oscuro"
            titleStyle={{ color: colors.text }}
            description="Activa o desactiva el modo oscuro."
            descriptionStyle={{ color: colors.secondary }}
            // El componente Switch controla el tema
            right={() => <Switch value={isDarkTheme} onValueChange={toggleTheme} color={colors.primary} />}
          />
          <Text style={styles.nota}>
            * Esta pantalla se puede extender con más opciones de usuario,
            idioma, notificaciones, etc.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 10,
    elevation: 3,
  },
  nota: {
    marginTop: 20,
    fontSize: 12,
    color: "#888",
    fontStyle: 'italic',
    textAlign: 'center'
  },
});