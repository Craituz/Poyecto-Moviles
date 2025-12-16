import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  Card,
  useTheme,
  IconButton
} from "react-native-paper";

export default function RegisterScreen({ navigation }) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const theme = useTheme();
  const { colors } = theme;

  // 🔎 VALIDACIONES
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  const handleRegister = () => {

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

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== cpassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace("Dashboard");
    }, 800);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
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
            style={styles.input}
          />
          <View style={styles.underline} />

          {/* Email & Phone */}
          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 10 }]}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="tu@email.com"
                style={styles.input}
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
                style={styles.input}
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
            style={styles.input}
          />
          <View style={styles.underline} />

          {/* Contraseña */}
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="********"
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
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
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showCPassword ? "eye-off" : "eye"}
                onPress={() => setShowCPassword(!showCPassword)}
              />
            }
          />
          <View style={styles.underline} />

          {/* Botones */}
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Login")}
              style={{ marginRight: 10 }}
            >
              Volver
            </Button>
            <Button
              mode="contained"
              loading={loading}
              onPress={handleRegister}
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
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 20, elevation: 5 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: 20 },
  label: { fontWeight: "bold", marginTop: 10 },
  input: { height: 40, fontSize: 14 },
  underline: { height: 1, backgroundColor: "#ccc", marginBottom: 5 },
  row: { flexDirection: "row" },
  col: { flex: 1 },
  buttonRow: { flexDirection: "row", marginTop: 20 }
});
