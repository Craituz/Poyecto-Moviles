import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Avatar, useTheme, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; 
import apiClient from '../services/apiClient';
import { useAppContext } from '../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { user, setAuth } = useAppContext(); 
  const theme = useTheme();

  // 1. PROTECCIÓN: Si el usuario no ha cargado, no renderizamos nada para evitar errores
  if (!user) {
      return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" />
          </View>
      );
  }

  // Estados iniciales
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [password, setPassword] = useState(''); 
  
  const [image, setImage] = useState(user.image); 
  const [isNewImage, setIsNewImage] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- 2. FUNCIÓN PARA ABRIR GALERÍA (SOLUCIÓN DEFINITIVA) ---
  const pickImage = async () => {
    console.log("1. Iniciando proceso de galería...");

    try {
        // A. Verificar permisos
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
          Alert.alert("Permiso denegado", "Es necesario permitir el acceso a la galería en la configuración de tu celular.");
          return;
        }

        console.log("2. Permisos otorgados. Abriendo selector...");

        // B. Abrir selector usando STRING DIRECTO ('Images')
        // Esto evita el error "cannot read property of undefined" con las constantes
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images', // <--- ESTO ES LO QUE ARREGLA EL ERROR
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

        console.log("3. Resultado galería:", result.canceled ? "Cancelado" : "Foto seleccionada");

        if (!result.canceled && result.assets && result.assets.length > 0) {
          setImage(result.assets[0].uri);
          setIsNewImage(true);
        }

    } catch (error) {
        console.error("CRITICAL ERROR GALERÍA:", error);
        Alert.alert("Error Técnico", `No se pudo abrir la galería. Detalle: ${error.message}`);
    }
  };

  // --- 3. GUARDAR DATOS ---
  const handleUpdate = async () => {
    setLoading(true);
    try {
        const formData = new FormData();
        
        // Truco para Laravel (simular PUT en una petición POST multipart)
        formData.append('_method', 'PUT'); 
        
        formData.append('name', name);
        formData.append('email', user.email); 
        formData.append('phone', phone || '');
        formData.append('address', address || '');
        
        if (password.length > 0) {
            if (password.length < 8) {
                Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
                setLoading(false);
                return;
            }
            formData.append('password', password);
        }

        if (isNewImage) {
            const localUri = image;
            const filename = localUri.split('/').pop();
            // Inferir tipo de archivo
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            console.log("Preparando imagen para subir:", filename);

            formData.append('image', {
                uri: localUri,
                name: filename,
                type: type,
            });
        }

        // Petición POST
        const response = await apiClient.post(`/users/${user.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Actualizar contexto global
        setAuth(response.data.user, null);

        Alert.alert("¡Éxito!", "Perfil actualizado correctamente.");
        navigation.goBack();

    } catch (error) {
        console.error("Error backend:", error);
        const msg = error.response?.data?.message || "No se pudo actualizar el perfil.";
        Alert.alert("Error", msg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      {/* --- SECCIÓN DE FOTO TÁCTIL --- */}
      <View style={styles.header}>
        <TouchableOpacity 
            onPress={pickImage} 
            activeOpacity={0.6}
            style={styles.avatarContainer}
        >
            {image ? (
                <Avatar.Image size={120} source={{ uri: image }} />
            ) : (
                <Avatar.Icon size={120} icon="account" style={{backgroundColor: '#ccc'}} />
            )}
            
            {/* ÍCONO DE CÁMARA */}
            <View style={[styles.cameraIcon, { backgroundColor: theme.colors.primary }]}>
                <Avatar.Icon size={36} icon="camera" color="white" style={{backgroundColor:'transparent'}}/>
            </View>
        </TouchableOpacity>

        <Text style={{marginTop:15, color: theme.colors.secondary}}>
            Toca la imagen para cambiarla
        </Text>
      </View>

      {/* --- FORMULARIO --- */}
      <Text style={[styles.sectionTitle, {color: theme.colors.primary}]}>Información Personal</Text>
      
      <TextInput 
        label="Nombre Completo" 
        value={name} 
        onChangeText={setName} 
        mode="outlined" 
        style={styles.input} 
        left={<TextInput.Icon icon="account" />}
      />
      
      <TextInput 
        label="Teléfono" 
        value={phone} 
        onChangeText={setPhone} 
        keyboardType="phone-pad" 
        mode="outlined" 
        style={styles.input} 
        placeholder="Ej: 0991234567"
        left={<TextInput.Icon icon="phone" />}
      />
      
      <TextInput 
        label="Dirección de Envío" 
        value={address} 
        onChangeText={setAddress} 
        mode="outlined" 
        style={styles.input} 
        multiline 
        numberOfLines={2}
        left={<TextInput.Icon icon="map-marker" />}
      />
      
      <Text style={[styles.sectionTitle, {color: theme.colors.primary, marginTop: 10}]}>Seguridad</Text>
      
      <TextInput 
        label="Nueva Contraseña (Opcional)" 
        value={password} 
        onChangeText={setPassword} 
        mode="outlined" 
        secureTextEntry 
        style={styles.input} 
        left={<TextInput.Icon icon="lock" />}
        placeholder="Dejar vacío para no cambiar"
      />

      <Button 
        mode="contained" 
        onPress={handleUpdate} 
        loading={loading} 
        disabled={loading}
        style={styles.button}
        contentStyle={{ height: 50 }}
      >
        Guardar Cambios
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarContainer: { position: 'relative' }, 
  cameraIcon: { 
      position: 'absolute', 
      bottom: 0, 
      right: 0, 
      borderRadius: 20, 
      elevation: 4 
  }, 
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { marginBottom: 15, backgroundColor: 'white' },
  button: { marginTop: 20 }
});