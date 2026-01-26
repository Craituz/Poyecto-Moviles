import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView } from "react-native";
import { Card, Text, TextInput, Button, Divider } from "react-native-paper";
import apiClient from "../../services/apiClient";

export default function SeguridadSection({ colors, user }) {
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [changeEmailMode, setChangeEmailMode] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailData, setEmailData] = useState({
    newEmail: user?.email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Cambiar Contraseña
  const handleChangePassword = async () => {
    // Validaciones
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/change-password", {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      Alert.alert("✓ Éxito", "Contraseña cambiada correctamente.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setChangePasswordMode(false);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  // Cambiar Email
  const handleChangeEmail = async () => {
    // Validaciones
    if (!emailData.newEmail || !emailData.password) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      Alert.alert("Error", "El email no es válido.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/change-email", {
        new_email: emailData.newEmail,
        password: emailData.password,
      });

      Alert.alert("✓ Éxito", "Correo electrónico cambiado correctamente.");
      setEmailData({ newEmail: user?.email || "", password: "" });
      setChangeEmailMode(false);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "No se pudo cambiar el email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={{ marginBottom: 20 }}>
        <Card style={[styles.section, { backgroundColor: colors.surface }]}>
          <Card.Title
            title="Seguridad"
            titleStyle={{ color: colors.text, fontSize: 20 }}
          />
          <Card.Content>
            {/* SECCIÓN: Cambiar Contraseña */}
            <View style={styles.optionGroup}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.groupLabel, { color: colors.text }]}>🔐 Contraseña</Text>
                <Button
                  mode={changePasswordMode ? "contained" : "outlined"}
                  onPress={() => setChangePasswordMode(!changePasswordMode)}
                  compact
                  labelStyle={{ fontSize: 12 }}
                  style={{ minWidth: 100 }}
                >
                  {changePasswordMode ? "Cancelar" : "Cambiar"}
                </Button>
              </View>

              {changePasswordMode && (
                <>
                  <Text style={[styles.description, { color: colors.secondary }]}>
                    Ingresa tu contraseña actual y la nueva contraseña.
                  </Text>

                  <TextInput
                    label="Contraseña Actual"
                    secureTextEntry
                    value={passwordData.currentPassword}
                    onChangeText={(text) =>
                      setPasswordData({ ...passwordData, currentPassword: text })
                    }
                    mode="outlined"
                    style={[styles.input, { marginBottom: 12 }]}
                    activeOutlineColor={colors.primary}
                  />

                  <TextInput
                    label="Contraseña Nueva"
                    secureTextEntry
                    value={passwordData.newPassword}
                    onChangeText={(text) =>
                      setPasswordData({ ...passwordData, newPassword: text })
                    }
                    mode="outlined"
                    style={[styles.input, { marginBottom: 12 }]}
                    activeOutlineColor={colors.primary}
                    helperText="Mínimo 8 caracteres"
                  />

                  <TextInput
                    label="Confirmar Contraseña"
                    secureTextEntry
                    value={passwordData.confirmPassword}
                    onChangeText={(text) =>
                      setPasswordData({ ...passwordData, confirmPassword: text })
                    }
                    mode="outlined"
                    style={[styles.input, { marginBottom: 12 }]}
                    activeOutlineColor={colors.primary}
                  />

                  <Button
                    mode="contained"
                    onPress={handleChangePassword}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={{ height: 45 }}
                  >
                    Cambiar Contraseña
                  </Button>
                </>
              )}
            </View>

            <Divider style={{ marginVertical: 16 }} />

            {/* SECCIÓN: Cambiar Email */}
            <View style={styles.optionGroup}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.groupLabel, { color: colors.text }]}>📧 Correo Electrónico</Text>
                <Button
                  mode={changeEmailMode ? "contained" : "outlined"}
                  onPress={() => setChangeEmailMode(!changeEmailMode)}
                  compact
                  labelStyle={{ fontSize: 12 }}
                  style={{ minWidth: 100 }}
                >
                  {changeEmailMode ? "Cancelar" : "Cambiar"}
                </Button>
              </View>

              {!changeEmailMode && (
                <Text style={{ color: colors.text, fontSize: 14, marginTop: 8 }}>
                  {user?.email}
                </Text>
              )}

              {changeEmailMode && (
                <>
                  <Text style={[styles.description, { color: colors.secondary }]}>
                    Ingresa tu nuevo email y contraseña para confirmación.
                  </Text>

                  <TextInput
                    label="Nuevo Correo Electrónico"
                    keyboardType="email-address"
                    value={emailData.newEmail}
                    onChangeText={(text) =>
                      setEmailData({ ...emailData, newEmail: text })
                    }
                    mode="outlined"
                    style={[styles.input, { marginBottom: 12 }]}
                    activeOutlineColor={colors.primary}
                  />

                  <TextInput
                    label="Contraseña (Confirmación)"
                    secureTextEntry
                    value={emailData.password}
                    onChangeText={(text) =>
                      setEmailData({ ...emailData, password: text })
                    }
                    mode="outlined"
                    style={[styles.input, { marginBottom: 12 }]}
                    activeOutlineColor={colors.primary}
                  />

                  <Button
                    mode="contained"
                    onPress={handleChangeEmail}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={{ height: 45 }}
                  >
                    Cambiar Correo
                  </Button>
                </>
              )}
            </View>

            <Divider style={{ marginVertical: 16 }} />

            {/* INFORMACIÓN */}
            <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.outline }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>💡 Consejos de Seguridad</Text>
              <Text style={[styles.infoText, { color: colors.secondary }]}>
                • Usa contraseñas fuertes con números y caracteres especiales{"\n"}
                • Nunca compartas tu contraseña{"\n"}
                • Actualiza tu información regularmente{"\n"}
                • Si olvidas tu contraseña, usa "Recuperar contraseña"
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 16,
  },
  optionGroup: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 12,
    marginBottom: 12,
    fontStyle: "italic",
  },
  input: {
    marginTop: 8,
  },
  button: {
    marginTop: 8,
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
