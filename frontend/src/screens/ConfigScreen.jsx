import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, Button, useTheme, List } from "react-native-paper";
import { useAppContext } from "../context/AppContext";
import TemaSection from "./config-sections/TemaSection";
import UbicacionSection from "./config-sections/UbicacionSection";
import SeguridadSection from "./config-sections/SeguridadSection";
import NotificacionesSection from "./config-sections/NotificacionesSection";

export default function ConfigScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const { user } = useAppContext();

  const [activeSection, setActiveSection] = useState(null);

  const menuItems = [
    { id: 'tema', label: '🌙 Tema', icon: 'palette' },
    { id: 'ubicacion', label: '📍 Ubicación', icon: 'map-marker' },
    { id: 'notificaciones', label: '🔔 Notificaciones', icon: 'bell' },
    { id: 'seguridad', label: '🔒 Seguridad', icon: 'lock' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {activeSection === null ? (
        // --- MENÚ PRINCIPAL  ---
        <>
          <Text style={[styles.mainTitle, { color: colors.text }]}>Configuración</Text>

          {menuItems.map((item) => (
            <Card
              key={item.id}
              style={[styles.menuCard, { backgroundColor: colors.surface }]}
              onPress={() => setActiveSection(item.id)}
            >
              <Card.Content style={styles.menuContent}>
                <View style={styles.menuItemLeft}>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                </View>
                <Text style={{ color: colors.secondary, fontSize: 18 }}>›</Text>
              </Card.Content>
            </Card>
          ))}

          <View style={styles.bottomSpacer} />
        </>
      ) : (
        // --- SECCIONES DETALLADAS ---
        <>
          <Button
            mode="text"
            onPress={() => setActiveSection(null)}
            icon="arrow-left"
            style={styles.backButton}
            labelStyle={{ color: colors.primary }}
          >
            Atrás
          </Button>

          {activeSection === 'tema' && <TemaSection colors={colors} />}
          {activeSection === 'ubicacion' && <UbicacionSection colors={colors} />}
          {activeSection === 'notificaciones' && <NotificacionesSection colors={colors} />}
          {activeSection === 'seguridad' && <SeguridadSection colors={colors} user={user} />}

          <View style={styles.bottomSpacer} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuCard: {
    borderRadius: 14,
    elevation: 2,
    marginBottom: 14,
  },
  menuContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  menuItemLeft: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
  backButton: {
    marginBottom: 20,
  },
  bottomSpacer: {
    height: 30,
  },
});
