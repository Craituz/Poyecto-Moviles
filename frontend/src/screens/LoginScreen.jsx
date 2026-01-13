import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Snackbar, Card, useTheme, Checkbox } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient";

export default function LoginScreen({ navigation }) {
  const { login } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleLogin = async () => {
    console.log("📢 INTENTO DE LOGIN:");
    console.log("   Email:", email);
    console.log("   Pass :", password);

    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("🚀 Enviando petición al servidor...");
      
      const { data } = await apiClient.post("/login", { 
        email, 
        password 
      });

      console.log("✅ RESPUESTA EXITOSA:", data);

      await login(data.user, data.token);
      navigation.replace("Dashboard");

    } catch (err) {
      console.log("❌ ------- ERROR DETECTADO ------- ❌");
      if (err.response) {
        console.log("📥 Datos del error:", err.response.data);
        console.log("🔢 Código de estado:", err.response.status);
        
        if (err.response.status === 422) {
             setError("Datos inválidos (Revisa el correo)");
        } else if (err.response.status === 401) {
             setError("Contraseña incorrecta");
        } else {
             setError("Error del servidor: " + err.response.status);
        }

      } else if (err.request) {
        console.log("📡 Error de Red: El servidor no responde a la IP configurada.");
        setError("Error de conexión. Revisa la IP y el Wifi.");
      } else {
        console.log("💥 Error Varios:", err.message);
        setError("Ocurrió un error inesperado.");
      }
      console.log("-------------------------------------");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="cake-variant" size={40} color={colors.primary} />
              <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.logoBadgeText}>Yeli's Cake</Text>
              </View>
          </View>
          
          <Text style={[styles.title, { color: colors.primary }]}>Yeli's Cake</Text>
          <Text style={[styles.subtitle, { color: '#666' }]}>Ingresa a tu cuenta para continuar</Text>
          
          <Text style={styles.label}>Usuario / Correo</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { backgroundColor: colors.surface }]}
            autoCapitalize="none"
            underlineColor="transparent"
            activeUnderlineColor={colors.primary}
            placeholder="ej. admin@yeliscake.com"
          />
          <View style={styles.underline} />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor="transparent"
            activeUnderlineColor={colors.primary}
            placeholder="........"
          />
          <View style={styles.underline} />

          <View style={styles.rememberRow}>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => setChecked(!checked)}
                    color={colors.primary}
                />
                <Text style={{ color: colors.text }}>Recordarme</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => {}} style={styles.forgotContainer}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            loading={loading}
            onPress={handleLogin}
            style={styles.button}
            contentStyle={{ paddingVertical: 5 }}
          >
            Iniciar Sesión
          </Button>

          <Text style={styles.newHere}>¿NUEVO AQUÍ?</Text>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Register")}
            style={styles.registerButton}
            contentStyle={{ paddingVertical: 5 }}
            textColor={colors.primary}
          >
            CREAR CUENTA NUEVA
          </Button>

            <TouchableOpacity onPress={() => {}} style={styles.catalogContainer}>
                <MaterialCommunityIcons name="magnify" size={20} color={colors.secondary} />
                <Text style={[styles.catalogText, { color: colors.primary }]}>Ver Catálogo Público</Text>
          </TouchableOpacity>

        </Card.Content>
      </Card>
      <Snackbar
        visible={!!error}
        onDismiss={() => setError("")}
        duration={3000}
      >
        {error}
      </Snackbar>
      
      <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Yeli's Cake</Text>
          <Text style={styles.footerSubText}>Endulzando tus momentos especiales</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 22 },
  card: { paddingVertical: 10, elevation: 5, borderRadius: 20, marginBottom: 20 },
  cardContent: { alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  logoBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, marginTop: -5 },
  logoBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 5, marginTop: 10 },
  subtitle: { fontSize: 14, marginBottom: 30 },
  label: { alignSelf: 'flex-start', fontWeight: 'bold', marginBottom: 5, marginTop: 10, width: '100%' },
  input: { width: '100%', height: 40, paddingHorizontal: 0 },
  underline: { height: 1, backgroundColor: '#ccc', width: '100%', marginBottom: 5 },
  rememberRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  forgotContainer: { alignSelf: 'flex-end', marginBottom: 20, marginTop: 10, width: '100%', alignItems: 'flex-end' },
  forgotText: { fontSize: 14 },
  button: { width: '100%', borderRadius: 25, marginBottom: 20 },
  newHere: { color: '#666', marginBottom: 10 },
  registerButton: { width: '100%', borderRadius: 25, borderColor: '#D81B60', marginBottom: 20 },
  catalogContainer: { flexDirection: 'row', alignItems: 'center' },
  catalogText: { marginLeft: 5, fontSize: 16 },
  footer: { alignItems: 'center' },
  footerText: { color: '#666', fontSize: 12 },
  footerSubText: { color: '#666', fontSize: 12 }
});