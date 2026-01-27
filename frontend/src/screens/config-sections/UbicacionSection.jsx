import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Text, List, Button, ActivityIndicator, Divider } from "react-native-paper";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { useAppContext } from "../../context/AppContext";

export default function UbicacionSection({ colors }) {
  const { saveLocation } = useAppContext();
  const [requesting, setRequesting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);

  // Cargar permisos al iniciar
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const locStatus = await Location.getForegroundPermissionsAsync();
      setLocationPermission(locStatus.status);

      const camStatus = await ImagePicker.getCameraPermissionsAsync();
      setCameraPermission(camStatus.status);
    } catch (error) {
      console.error("Error verificando permisos:", error);
    }
  };

  const handleRequestLocationPermission = useCallback(async () => {
    setRequesting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);

      if (status === "granted") {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        };

        await saveLocation(coords);
        setSuccessMsg("✓ Ubicación obtenida y guardada correctamente.");
      } else {
        setErrorMsg("Permiso de ubicación denegado.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("No se pudo obtener la ubicación.");
    } finally {
      setRequesting(false);
    }
  }, [saveLocation]);

  const handleRequestCameraPermission = useCallback(async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(status);

      if (status === "granted") {
        setSuccessMsg("✓ Permiso de cámara otorgado.");
      } else {
        setErrorMsg("Permiso de cámara denegado.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Error solicitando permiso de cámara.");
    }
  }, []);

  const getPermissionStatusLabel = (status) => {
    if (status === "granted") return { text: "Otorgado", color: "#4caf50" };
    if (status === "denied") return { text: "Denegado", color: "#f44336" };
    return { text: "No solicitado", color: "#ff9800" };
  };

  const locStatus = getPermissionStatusLabel(locationPermission);
  const camStatus = getPermissionStatusLabel(cameraPermission);

  return (
    <ScrollView style={{ marginBottom: 20 }}>
      <Card style={[styles.section, { backgroundColor: colors.surface }]}>
        <Card.Title
          title="Permisos de Ubicación y Cámara"
          titleStyle={{ color: colors.text, fontSize: 20 }}
        />
        <Card.Content>
          {/* Permiso de Ubicación */}
          <View style={styles.optionGroup}>
            <Text style={[styles.groupLabel, { color: colors.text }]}>📍 Permiso de Ubicación</Text>
            <Text style={[styles.description, { color: colors.secondary }]}>
              Permite obtener tu ubicación para entregas precisas y búsqueda de usuarios cercanos.
            </Text>

            <View style={styles.permissionStatus}>
              <Text style={{ color: colors.text }}>Estado:</Text>
              <Text style={[styles.statusBadge, { color: locStatus.color, borderColor: locStatus.color }]}>
                {locStatus.text}
              </Text>
            </View>

            <Button
              mode={locationPermission === "granted" ? "outlined" : "contained"}
              onPress={handleRequestLocationPermission}
              loading={requesting}
              disabled={requesting}
              icon="map-marker"
              style={styles.button}
            >
              {locationPermission === "granted"
                ? "Actualizar ubicación"
                : "Solicitar permiso"}
            </Button>

            {successMsg && (
              <Text style={[styles.messageText, { color: colors.primary }]}>{successMsg}</Text>
            )}
            {errorMsg && (
              <Text style={[styles.messageText, { color: colors.error }]}>{errorMsg}</Text>
            )}
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Permiso de Cámara */}
          <View style={styles.optionGroup}>
            <Text style={[styles.groupLabel, { color: colors.text }]}>📷 Permiso de Cámara</Text>
            <Text style={[styles.description, { color: colors.secondary }]}>
              Permite tomar fotos de productos, perfil y documentos para el sistema.
            </Text>

            <View style={styles.permissionStatus}>
              <Text style={{ color: colors.text }}>Estado:</Text>
              <Text style={[styles.statusBadge, { color: camStatus.color, borderColor: camStatus.color }]}>
                {camStatus.text}
              </Text>
            </View>

            <Button
              mode={cameraPermission === "granted" ? "outlined" : "contained"}
              onPress={handleRequestCameraPermission}
              icon="camera"
              style={styles.button}
            >
              {cameraPermission === "granted"
                ? "Permiso otorgado"
                : "Solicitar permiso"}
            </Button>
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Información adicional */}
          <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.outline }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>💡 Información</Text>
            <Text style={[styles.infoText, { color: colors.secondary }]}>
              Los permisos son necesarios para funcionalidades clave de la app. Puedes cambiarlos en cualquier momento desde la configuración de tu dispositivo.
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
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
  groupLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    marginBottom: 12,
    fontStyle: "italic",
  },
  permissionStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    marginVertical: 8,
  },
  messageText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "500",
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
