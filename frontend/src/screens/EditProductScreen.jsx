import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../services/apiClient';
import { useAppContext } from '../context/AppContext';
import { getFontSize, getContrastStyle } from '../services/fontSizeHelper';

export default function EditProductScreen({ route, navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  const { fontSize, contrast } = useAppContext();
  
  // Recibimos el producto a editar por parámetros
  const { product } = route.params;

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState(product.image); // URL actual o nueva URI
  const [isNewImage, setIsNewImage] = useState(false); // Bandera para saber si cambió
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setIsNewImage(true); // ¡Marcamos que hay imagen nueva!
    }
  };

  const updateProduct = async () => {
    setLoading(true);
    try {
        // TRUCO LARAVEL: Para enviar archivos con PUT, es mejor usar POST
        // y agregar el campo _method: 'PUT' dentro del FormData.
        // Axios y Laravel a veces pelean con multipart/form-data en PUT directos.
        
        const formData = new FormData();
        formData.append('_method', 'PUT'); // <--- EL TRUCO
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description || '');

        if (isNewImage) {
            const localUri = image;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', {
                uri: localUri,
                name: filename,
                type: type,
            });
        }

        // Notar que usamos POST a la URL del ID, pero Laravel lo tratará como PUT por el _method
        await apiClient.post(`/products/${product.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        Alert.alert("¡Éxito!", "Producto actualizado.");
        navigation.goBack(); // Volver a la lista

    } catch (error) {
        console.error("Error actualizando:", error);
        Alert.alert("Error", "No se pudo actualizar.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={{color: colors.primary, marginBottom:20, fontSize: getFontSize("2xl", fontSize), ...getContrastStyle(contrast)}}>
        Editar Producto
      </Text>

      <View style={styles.imageContainer}>
          {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
          ) : null}
          <Button mode="outlined" onPress={pickImage} icon="camera">
              Cambiar Imagen
          </Button>
      </View>

      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={[styles.input, { backgroundColor: colors.surface }]}
        textColor={colors.onSurface}
        placeholderTextColor={colors.onSurfaceVariant}
        mode="outlined"
        labelStyle={{ fontSize: getFontSize("sm", fontSize) }}
      />
      <TextInput
        label="Precio"
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

      <Button mode="contained" onPress={updateProduct} loading={loading} style={{marginTop:10}}>
        Guardar Cambios
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  imageContainer: { alignItems: 'center', marginBottom: 20, gap: 10 },
  previewImage: { width: 200, height: 150, borderRadius: 10, resizeMode: 'cover' },
  input: { marginBottom: 15, backgroundColor: 'white' },
});