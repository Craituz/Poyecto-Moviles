import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar, Card, useTheme } from "react-native-paper";
import { useAppContext } from "../context/AppContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simula login: guarda usuario demo en contexto
      login();
      // Navega al Dashboard (reemplaza la pantalla de Login)
      navigation.replace("Dashboard");
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text style={[styles.title, { color: colors.primary }]}>Yeli's Cake</Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>Bienvenido a la dulzura</Text>
          <TextInput
            label="Correo"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { backgroundColor: colors.surface }]}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            label="Contraseña"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { backgroundColor: colors.surface }]}
          />
          <Button
            mode="contained"
            loading={loading}
            onPress={handleLogin}
            style={styles.button}
          >
            Entrar
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 16 }}
            labelStyle={{ color: colors.secondary }}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </Card.Content>
      </Card>
      <Snackbar
        visible={!!error}
        onDismiss={() => setError("")}
        duration={3000}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },
  card: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    elevation: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "serif", // Adding a serif font for a bakery feel
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    fontStyle: "italic",
  },
  input: {
    marginBottom: 14,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});