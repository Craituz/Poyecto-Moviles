import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Avatar, Divider, useTheme } from "react-native-paper";
import { useAppContext } from "../context/AppContext";

export default function PerfilScreen() {
  const { user } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title
          title={user.nombre}
          titleStyle={{ color: colors.text }}
          subtitle={user.rol}
          subtitleStyle={{ color: colors.secondary }}
          left={(props) => <Avatar.Text {...props} label={user.nombre[0]} style={{ backgroundColor: colors.primary }} />}
        />  
        <Card.Content>
          <Text style={[styles.label, { color: colors.secondary }]}>Correo:</Text>
          <Text style={{ color: colors.text }}>{user?.correo}</Text>
          <Divider style={{ marginVertical: 10 }} />
          <Text style={[styles.label, { color: colors.secondary }]}>Fecha de ingreso:</Text>
          <Text style={{ color: colors.text }}>{user?.ingreso}</Text>
          <Divider style={{ marginVertical: 10 }} />
          <Text style={[styles.label, { color: colors.secondary }]}>Biografía:</Text>
          <Text style={{ color: colors.text }}>{user?.bio}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 10, elevation: 3 },
  label: { fontWeight: "bold", marginTop: 8 },
});