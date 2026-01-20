import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // <--- Importamos esto
import apiClient from '../services/apiClient'; // Asegúrate de que la ruta sea correcta

export default function NewProductScreen({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // Aquí guardamos la URI de la imagen
  const [loading, setLoading] = useState(false);

  // 1. FUNCIÓN PARA ABRIR GALERÍA
  const pickImage = async () => {
    // Pedir permisos
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Se requieren permisos para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Calidad un poco reducida para subir más rápido
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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
      <Text variant="headlineMedium" style={{color: colors.primary, fontWeight: 'bold'}}>
        Nuevo Producto
      </Text>

      {/* VISTA PREVIA DE IMAGEN */}
      <View style={styles.imageContainer}>
          {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
              <View style={[styles.placeholder, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={{color: colors.secondary}}>Sin imagen</Text>
              </View>
          )}
          <Button mode="outlined" onPress={pickImage} icon="camera">
              Seleccionar Imagen
          </Button>
      </View>

      <TextInput
        label="Nombre del producto"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Precio ($)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.input}
        mode="outlined"
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