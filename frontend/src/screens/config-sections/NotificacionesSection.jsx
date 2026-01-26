import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Switch, List } from "react-native-paper";
import { useAppContext } from "../../context/AppContext";

export default function NotificacionesSection({ colors }) {
  const { notificationsEnabled, toggleNotificationsEnabled } = useAppContext();

  return (
    <Card style={[styles.section, { backgroundColor: colors.surface }]}>
      <Card.Title title="Notificaciones" titleStyle={{ color: colors.text, fontSize: 20 }} />
      <Card.Content>
        <View style={styles.optionGroup}>
          <List.Item
            title="Notificaciones"
            titleStyle={{ color: colors.text }}
            description={notificationsEnabled ? "Activadas" : "Desactivadas"}
            descriptionStyle={{ color: colors.secondary }}
            right={() => (
              <Switch value={notificationsEnabled} onValueChange={toggleNotificationsEnabled} color={colors.primary} />
            )}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: { borderRadius: 12, elevation: 2, marginBottom: 16 },
  optionGroup: { marginBottom: 16 },
  groupLabel: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
});
