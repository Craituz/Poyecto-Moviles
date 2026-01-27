import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  Card,
  useTheme,
  HelperText
} from "react-native-paper";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient";
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  validateAddress, 
  validatePassword, 
  validateConfirmPassword,
  sanitizePhone,
  countWords
} from "../utils/validators";
import { LIMITS } from "../utils/constants";

export default function RegisterScreen({ navigation }) {
  const { login } = useAppContext();
  const theme = useTheme();
  const { colors } = theme;

  // Estados del formulario.
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

  // === VALIDACIONES DE CAMPOS INDIVIDUALES ===
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const phoneError = validatePhone(phone);
  const addressError = validateAddress(address);
  const passwordError = validatePassword(password);
  const cpasswordError = validateConfirmPassword(password, cpassword);

  // === VALIDACIÓN COMPLETA ===
  const isFormValid = 
    name && !nameError &&
    email && !emailError &&
    phone && !phoneError &&
    address && !addressError &&
    password && !passwordError &&
    cpassword && !cpasswordError;

  // === MANEJADORES DE CAMBIO DE TEXTO ===
  const handleNameChange = (text) => {
    if (text.length <= LIMITS.NAME.MAX) {
      setName(text);
    }
  };

  const handleEmailChange = (text) => {
    if (text.length <= LIMITS.EMAIL.MAX) {
      setEmail(text.toLowerCase());
    }
  };

  const handlePhoneChange = (text) => {
    const cleanText = sanitizePhone(text);
    if (cleanText.length <= LIMITS.PHONE.EXACT) {
      setPhone(cleanText);
    }
  };

  const handleAddressChange = (text) => {
    const wordCount = countWords(text);
    if (wordCount <= LIMITS.ADDRESS.MAX_WORDS && text.length <= LIMITS.ADDRESS.MAX_CHARS) {
      setAddress(text);
    }
  };

  const handlePasswordChange = (text) => {
    if (text.length <= LIMITS.PASSWORD.MAX) {
      setPassword(text);
    }
  };

  const handleCPasswordChange = (text) => {
    if (text.length <= LIMITS.PASSWORD.MAX) {
      setCpassword(text);
    }
  };

  const handleRegister = async () => {
    // Validación final del frontend
    if (!isFormValid) {
      setError("Por favor, completa correctamente todos los campos");
      return;
    }

    // Conexión al Backend
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.post("/register", {
        name,
        email,
        password,
        phone, 
        address
      });

      console.log("✅ Registro exitoso:", response.data);

      // Auto-Login
      await login(response.data.user, response.data.access_token);

    } catch (err) {
      console.log("❌ ERROR REGISTRO", err);
      
      if (err.response) {
        const data = err.response.data;
        
        // Manejo mejorado de errores de validación (422)
        if (err.response.status === 422 && data.errors) {
          // Extraer todos los mensajes de error
          const errorMessages = Object.values(data.errors).flat();
          setError(errorMessages.join('\n'));
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Error al registrar usuario");
        }
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Verifica tu conexión.");
      } else {
        setError("Error inesperado. Intenta nuevamente.");
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

          {/* === NOMBRE === */}
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder="Tu nombre"
            maxLength={50}
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor="transparent"
            activeUnderlineColor={nameError ? '#D32F2F' : colors.primary}
            error={!!nameError}
          />
          {nameError && (
            <HelperText type="error" visible={!!nameError}>
              {nameError}
            </HelperText>
          )}
          <Text style={styles.charCount}>{name.length}/{LIMITS.NAME.MAX}</Text>

          {/* === EMAIL & TELÉFONO (Fila) === */}
          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 10 }]}>
              <Text style={styles.label}>Correo @Gmail</Text>
              <TextInput
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="example@gmail.com"
                maxLength={LIMITS.EMAIL.MAX}
                style={[styles.input, { backgroundColor: colors.surface }]}
                underlineColor="transparent"
                activeUnderlineColor={emailError ? '#D32F2F' : colors.primary}
                error={!!emailError}
              />
              {emailError && (
                <HelperText type="error" visible={!!emailError} style={{ fontSize: 11 }}>
                  {emailError}
                </HelperText>
              )}
              <Text style={styles.charCount}>{email.length}/{LIMITS.EMAIL.MAX}</Text>
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={LIMITS.PHONE.EXACT}
                placeholder="0987654321"
                style={[styles.input, { backgroundColor: colors.surface }]}
                underlineColor="transparent"
                activeUnderlineColor={phoneError ? '#D32F2F' : colors.primary}
                error={!!phoneError}
              />
              {phoneError && (
                <HelperText type="error" visible={!!phoneError} style={{ fontSize: 11 }}>
                  {phoneError}
                </HelperText>
              )}
              <Text style={styles.charCount}>{phone.length}/{LIMITS.PHONE.EXACT}</Text>
            </View>
          </View>

          {/* === DIRECCIÓN === */}
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            value={address}
            onChangeText={handleAddressChange}
            placeholder="Calle Principal #123"
            maxLength={LIMITS.ADDRESS.MAX_CHARS}
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor="transparent"
            activeUnderlineColor={addressError ? '#D32F2F' : colors.primary}
            error={!!addressError}
          />
          {addressError && (
            <HelperText type="error" visible={!!addressError}>
              {addressError}
            </HelperText>
          )}
          <View style={styles.charCountRow}>
            <Text style={styles.charCount}>{address.length}/{LIMITS.ADDRESS.MAX_CHARS}</Text>
            <Text style={styles.wordCount}>
              {countWords(address)}/{LIMITS.ADDRESS.MAX_WORDS} palabras
            </Text>
          </View>

          {/* === CONTRASEÑA === */}
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            placeholder="Mínimo 8, máximo 15 caracteres"
            maxLength={LIMITS.PASSWORD.MAX}
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor="transparent"
            activeUnderlineColor={passwordError ? '#D32F2F' : colors.primary}
            error={!!passwordError}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                color={colors.secondary}
              />
            }
          />
          {passwordError && (
            <HelperText type="error" visible={!!passwordError}>
              {passwordError}
            </HelperText>
          )}
          <Text style={styles.charCount}>{password.length}/{LIMITS.PASSWORD.MAX}</Text>

          {/* === CONFIRMAR CONTRASEÑA === */}
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            value={cpassword}
            onChangeText={handleCPasswordChange}
            secureTextEntry={!showCPassword}
            placeholder="Repite tu contraseña"
            maxLength={LIMITS.PASSWORD.MAX}
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor="transparent"
            activeUnderlineColor={cpasswordError ? '#D32F2F' : colors.primary}
            error={!!cpasswordError}
            right={
              <TextInput.Icon
                icon={showCPassword ? "eye-off" : "eye"}
                onPress={() => setShowCPassword(!showCPassword)}
                color={colors.secondary}
              />
            }
          />
          {cpasswordError && (
            <HelperText type="error" visible={!!cpasswordError}>
              {cpasswordError}
            </HelperText>
          )}
          <Text style={styles.charCount}>{cpassword.length}/{LIMITS.PASSWORD.MAX}</Text>

          {/* === BOTONES === */}
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
              disabled={!isFormValid || loading}
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
  label: { fontWeight: "bold", marginTop: 12, fontSize: 13, color: '#444' },
  input: { height: 40, fontSize: 14, paddingHorizontal: 0 },
  row: { flexDirection: "row" },
  col: { flex: 1 },
  charCount: { fontSize: 11, color: '#999', marginTop: 2, marginBottom: 8 },
  charCountRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 2, 
    marginBottom: 8 
  },
  wordCount: { fontSize: 11, color: '#999' },
  buttonRow: { 
    flexDirection: "row", 
    marginTop: 30, 
    marginBottom: 10, 
    justifyContent: 'space-between' 
  }
});
