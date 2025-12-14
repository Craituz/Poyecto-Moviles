import React, { useState } from 'react'; 
import { View, Text, StyleSheet } from "react-native";
import { Button, Card, Snackbar, TextInput } from "react-native-paper"; 

export default function RegisterScreen() {
  const[nombre, setNombre] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const[loading, setLoading] = useState(false);
  
  return(
    <View style={styles.container}>
    <Card style={styles.card}>
        <Card.Content>
            <Text style={styles.title}>Regristro</Text>

            <TextInput
                label="Nombre Completo"
                mode= "outlined"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="default"
            />
            <TextInput
                label="Correo Electrónico"
                mode= "outlined"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                label="Contraseña"
                mode= "outlined"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />
            <TextInput
                label="Confirmar Contraseña"
                mode= "outlined"
                secureTextEntry
                value={confirmarPassword}
                onChangeText={setConfirmarPassword}
                style={styles.input}
            />
            <Button
                mode="contained"
                loading={loading}
                //Crear onpress
                style = {styles.button}
            >
                Registrarse
            </Button>
        </Card.Content>
    </Card>
    <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
    >
 
    </Snackbar>
    </View>
  )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 22,
      backgroundColor: '#D3D3D3',
    },
    card: {
      paddingVertical: 18,
      paddingHorizontal: 12,
      elevation: 5,
      borderRadius: 10,
      },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    input: {
      marginBottom: 14,

    },
    button: {
      marginTop: 8,
      paddingVertical: 6,
    },
  });