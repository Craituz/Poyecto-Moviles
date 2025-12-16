import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

export default function NewProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const saveProduct = () => {
    const product = {
      name,
      price,
      description
    };

    console.log('Producto guardado:', product);
    // Aquí luego conectamos a backend
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Nuevo Producto</Text>

      <TextInput
        label="Nombre del producto"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
      />

      <Button mode="contained" onPress={saveProduct}>
        Guardar Producto
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12
  },
  input: {
    marginBottom: 10
  }
});
