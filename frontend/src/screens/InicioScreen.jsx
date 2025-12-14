import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { useAppContext } from "../context/AppContext";

export default function InicioScreen() {
  const { user } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title 
          title="Bienvenido a Yeli's Cake" 
          titleStyle={[styles.cardTitle, { color: colors.primary }]} 
        />
        <Card.Content>
          <Text variant="titleMedium" style={[styles.saludo, { color: colors.text }]}>
            ¡Hola, {user.nombre || "Amante del dulce"}!
          </Text>
          <Text style={[styles.description, { color: colors.secondary }]}>
            Descubre nuestros deliciosos cupcakes y pasteles hechos con amor.
            ¡Hoy tenemos promociones especiales para ti!
          </Text>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { marginTop: 16, backgroundColor: colors.surface }]}>
        <Card.Title 
          title="Especialidad del Día" 
          titleStyle={[styles.cardTitle, { color: colors.primary }]} 
        />
        <Card.Content>
          <Text style={[styles.productTitle, { color: colors.primary }]}>Cupcake de Fresa y Vainilla</Text>
          <Text style={[styles.productDescription, { color: colors.text }]}>
            Suave bizcocho de vainilla con un frosting cremoso de fresa natural.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 10, elevation: 3 },
  cardTitle: { fontWeight: "bold", fontSize: 20 },
  saludo: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  description: { marginVertical: 10, fontSize: 16 },
  productTitle: { fontSize: 18, fontWeight: "bold", marginTop: 8 },
  productDescription: { marginTop: 4, fontStyle: "italic" }
});