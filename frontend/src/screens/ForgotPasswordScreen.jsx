import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, Snackbar, useTheme } from 'react-native-paper';
import apiClient from '../services/apiClient';

export default function ForgotPasswordScreen({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!email) {
      setMessage('Ingresa tu correo');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      const res = await apiClient.post('/password/forgot', { email });
      setMessage('Te enviamos un enlace para restablecer tu contraseña. Revisa tu correo.');
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo enviar el enlace';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text style={[styles.title, { color: colors.primary }]}>Recuperar contraseña</Text>
          <Text style={[styles.subtitle]}>Ingresa tu correo y te enviaremos un enlace</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            placeholder='tu@gmail.com'
            style={[styles.input, { backgroundColor: colors.surface }]}
            underlineColor='transparent'
            activeUnderlineColor={colors.primary}
          />

          <Button mode='contained' loading={loading} onPress={handleSend} style={{ marginTop: 16 }}>
            Enviar enlace
          </Button>

          <Button mode='outlined' onPress={() => navigation.navigate('ResetPassword')} style={{ marginTop: 10 }}>
            Ya tengo el código
          </Button>

          <Button mode='outlined' onPress={() => navigation.navigate('Login')} style={{ marginTop: 10 }}>
            Volver al login
          </Button>
        </Card.Content>
      </Card>

      <Snackbar visible={!!message} onDismiss={() => setMessage('')} duration={3000}>
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 22 },
  card: { borderRadius: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#666', marginBottom: 16 },
  input: { height: 40 }
});
