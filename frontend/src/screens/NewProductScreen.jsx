import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, Linking } from 'react-native';
import { TextInput, Button, Text, useTheme, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../services/apiClient'; // Asegúrate de que la ruta sea correcta
import { useAppContext } from '../context/AppContext';
import { getFontSize, getContrastStyle } from '../services/fontSizeHelper';

export default function NewProductScreen({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  const { fontSize, contrast } = useAppContext();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // Aquí guardamos la URI de la imagen
  const [loading, setLoading] = useState(false);

  // Solicita permisos solo cuando son necesarios y evita re-preguntar si ya están otorgados o bloqueados
  const requestPermissionIfNeeded = async (getPermissionAsync, requestPermissionAsync, messages) => {
    const current = await getPermissionAsync();
    if (current.status === 'granted') return { granted: true };

    // Si el usuario bloqueó los permisos, lo llevamos a la configuración
    if (current.status === 'denied' && current.canAskAgain === false) {
      Alert.alert(messages.blockedTitle, messages.blockedMessage, [
        { text: 'Abrir configuración', onPress: Linking.openSettings },
        { text: 'Cancelar', style: 'cancel' },
      ]);
      return { granted: false, blocked: true };
    }

    const requested = await requestPermissionAsync();
    if (requested.status !== 'granted') {
      Alert.alert(messages.deniedTitle, messages.deniedMessage);
      return { granted: false };
    }
    return { granted: true };
  };

  const pickFromLibrary = async () => {
    const permission = await requestPermissionIfNeeded(
      ImagePicker.getMediaLibraryPermissionsAsync,
      ImagePicker.requestMediaLibraryPermissionsAsync,
      {
        blockedTitle: 'Permiso de galería bloqueado',
        blockedMessage: 'Activa el permiso de galería desde la configuración del dispositivo para seleccionar imágenes.',
        deniedTitle: 'Permiso requerido',
        deniedMessage: 'Necesitamos acceso a tu galería para seleccionar imágenes.',
      },
    );

    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await requestPermissionIfNeeded(
      ImagePicker.getCameraPermissionsAsync,
      ImagePicker.requestCameraPermissionsAsync,
      {
        blockedTitle: 'Permiso de cámara bloqueado',
        blockedMessage: 'Activa el permiso de cámara desde la configuración del dispositivo para tomar fotos.',
        deniedTitle: 'Permiso requerido',
        deniedMessage: 'Necesitamos acceso a tu cámara para tomar fotos.',
      },
    );

    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, // No forzar recorte
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSelectImage = () => {
    Alert.alert('Selecciona una opción', 'Elige cómo deseas agregar la imagen', [
      { text: 'Tomar foto', onPress: takePhoto },
      { text: 'Elegir de galería', onPress: pickFromLibrary },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  // 2. FUNCIÓN PARA GUARDAR (POST)
  const saveProduct = async () => {
    if (!name || !price || !description) {
        Alert.alert("Error", "Por favor completa nombre, precio y descripción.");
        return;
    }

    setLoading(true);

    try {
        // --- PREPARAR LOS DATOS (FORM DATA) ---
        // Para subir archivos, NO se usa JSON normal, se usa FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);

        if (image) {
            // Truco para extraer el tipo de archivo (jpg/png)
            const localUri = image;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            // Añadimos la imagen como archivo
            formData.append('image', {
                uri: localUri,
                name: filename,
                type: type,
            });
        }

        // --- ENVIAR AL BACKEND ---
        // Nota: Al usar apiClient con FormData, Axios suele detectar automáticamente 
        // el Content-Type 'multipart/form-data', pero lo forzamos por seguridad.
        await apiClient.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        Alert.alert("¡Éxito!", "Producto creado correctamente");
        
        // Limpiar formulario
        setName('');
        setPrice('');
        setDescription('');
        setImage(null);
        
        // Opcional: Regresar al dashboard
        // navigation.goBack(); 

    } catch (error) {
        console.error("Error subiendo producto:", error);
        Alert.alert("Error", "No se pudo guardar el producto. Revisa tu conexión.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={{color: colors.primary, fontWeight: 'bold', fontSize: getFontSize("2xl", fontSize), ...getContrastStyle(contrast)}}>
        Nuevo Producto
      </Text>

      {/* VISTA PREVIA DE IMAGEN */}
      <View style={styles.imageContainer}>
          {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
              <View style={[styles.placeholder, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={{color: colors.secondary, fontSize: getFontSize("sm", fontSize)}}>Sin imagen</Text>
              </View>
          )}
            <Button mode="outlined" onPress={handleSelectImage} icon="camera">
              Seleccionar Imagen
          </Button>
      </View>

      <TextInput
        label="Nombre del producto"
        value={name}
        onChangeText={setName}
        style={[styles.input, { backgroundColor: colors.surface }]}
        textColor={colors.onSurface}
        placeholderTextColor={colors.onSurfaceVariant}
        mode="outlined"
        labelStyle={{ fontSize: getFontSize("sm", fontSize) }}
      />

      <TextInput
        label="Precio ($)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={[styles.input, { backgroundColor: colors.surface }]}
        textColor={colors.onSurface}
        placeholderTextColor={colors.onSurfaceVariant}
        mode="outlined"
        labelStyle={{ fontSize: getFontSize("sm", fontSize) }}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[styles.input, { backgroundColor: colors.surface }]}
        textColor={colors.onSurface}
        placeholderTextColor={colors.onSurfaceVariant}
        mode="outlined"
        labelStyle={{ fontSize: getFontSize("sm", fontSize) }}
      />

      <Button 
        mode="contained" 
        onPress={saveProduct} 
        loading={loading}
        disabled={loading}
        style={styles.saveButton}
      >
        Guardar Producto
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  imageContainer: {
      alignItems: 'center',
      marginBottom: 20,
      gap: 10
  },
  previewImage: {
      width: 200,
      height: 150,
      borderRadius: 10,
      resizeMode: 'cover'
  },
  placeholder: {
      width: 200,
      height: 150,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderStyle: 'dashed'
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white'
  },
  saveButton: {
      marginTop: 10,
      paddingVertical: 5
  }
});