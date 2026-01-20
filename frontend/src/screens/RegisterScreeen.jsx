import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  Card,
  useTheme
} from "react-native-paper";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient";

export default function RegisterScreen({ navigation }) {
  const { login } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;

  // Estados del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  
  // Estados de control
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  // 🔎 VALIDACIONES REGEX
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  const handleRegister = async () => {

    // 1. Validaciones Locales
    if (!name || !email || !password || !cpassword || !phone || !address) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!nameRegex.test(name)) {
      setError("El nombre solo debe contener letras y espacios.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("El número de teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    if (password.length < 8) { // Laravel suele pedir min 8
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== cpassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // 2. Conexión al Backend
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.post("/register", {
        name,
        email,
        password,
        // Enviamos phone y address, aunque Laravel los ignorará si no están en la BD aún
        phone, 
        address
      });

      console.log("Registro exitoso:", response.data);

      // 3. Auto-Login (Guardar token y entrar)
      // App.js detectará esto y cambiará la pantalla automáticamente
      await login(response.data.user, response.data.access_token);

    } catch (err) {
      console.log("❌ ERROR REGISTRO", err);
      
      if (err.response) {
        // Manejo de errores de validación de Laravel (ej. Email duplicado)
        const data = err.response.data;
        if (err.response.status === 422) {
             const firstError = data.errors ? Object.values(data.errors)[0][0] : data.message;
             setError(firstError || "Datos inválidos (Email duplicado, etc)");
        } else {
            setError("Error al registrar usuario");
        }
      } else {
        setError("Error de conexión. Verifica tu servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>

          <Text style={[styles.title, { color: colors.primary }]}>
            Crear Cuenta Nueva
          </Text>

          <Text style={[styles.subtitle, { color: "#666" }]}>
            Únete a Yeli's Cake y disfruta de nuestros productos
          </Text>

          {/* Nombre */}
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor="transparent"
            activeUnderlineColor={colors.primary}
          />
          <View style={styles.underline} />

          {/* Email & Phone (En fila) */}
          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 10 }]}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="tu@email.com"
                style={[styles.input, { backgroundColor: colors.surface }]}
                underlineColor="transparent"
                activeUnderlineColor={colors.primary}
              />
              <View style={styles.underline} />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                value={phone}
                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="0987654321"
                style={[styles.input, { backgroundColor: colors.surface }]}
                underlineColor="transparent"
                activeUnderlineColor={colors.primary}
              />
              <View style={styles.underline} />
            </View>
          </View>

          {/* Dirección */}
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Calle Principal #123"
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor="transparent"
            activeUnderlineColor={colors.primary}
          />
          <View style={styles.underline} />

          {/* Contraseña */}
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="********"
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor="transparent"
            activeUnderlineColor={colors.primary}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                color={colors.secondary}
              />
            }
          />
          <View style={styles.underline} />

          {/* Confirmar Contraseña */}
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            value={cpassword}
            onChangeText={setCpassword}
            secureTextEntry={!showCPassword}
            placeholder="********"
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor="transparent"
            activeUnderlineColor={colors.primary}
            right={
              <TextInput.Icon
                icon={showCPassword ? "eye-off" : "eye"}
                onPress={() => setShowCPassword(!showCPassword)}
                color={colors.secondary}
              />
            }
          />
          <View style={styles.underline} />

          {/* Botones */}
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Login")}
              style={{ marginRight: 10, flex: 1, borderColor: colors.secondary }}
              textColor={colors.secondary}
            >
              Volver
            </Button>
            <Button
              mode="contained"
              loading={loading}
              onPress={handleRegister}
              style={{ flex: 1 }}
            >
              Crear Cuenta
            </Button>
          </View>

        </Card.Content>
      </Card>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError("")}
        duration={3000}
        style={{ backgroundColor: '#D32F2F' }}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { borderRadius: 20, elevation: 5 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginTop: 10 },
  subtitle: { textAlign: "center", marginBottom: 20, fontSize: 12 },
  label: { fontWeight: "bold", marginTop: 10, fontSize: 13, color: '#444' },
  input: { height: 40, fontSize: 14, paddingHorizontal: 0 },
  underline: { height: 1, backgroundColor: "#ccc", marginBottom: 5 },
  row: { flexDirection: "row" },
  col: { flex: 1 },
  buttonRow: { flexDirection: "row", marginTop: 30, marginBottom: 10, justifyContent: 'space-between' }
});