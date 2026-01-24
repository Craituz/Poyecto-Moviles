import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, Snackbar, useTheme } from 'react-native-paper';
import apiClient from '../services/apiClient';

export default function ResetPasswordScreen({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (!email || !code || !password || !password_confirmation) {
      setMessage('Completa todos los campos');
      return;
    }
    if (code.length !== 6) {
      setMessage('El código debe tener 6 dígitos');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      const res = await apiClient.post('/password/reset', {
        email,
        code,
        password,
        password_confirmation,
      });
      setMessage('Contraseña restablecida. Ahora puedes iniciar sesión.');
      setTimeout(() => navigation.navigate('Login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo restablecer la contraseña';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text style={[styles.title, { color: colors.primary }]}>Restablecer contraseña</Text>
          <Text style={[styles.subtitle]}>Ingresa el código de 6 dígitos que recibiste</Text>

          <TextInput value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none' placeholder='tu@gmail.com' style={[styles.input, { backgroundColor: colors.surface }]} underlineColor='transparent' activeUnderlineColor={colors.primary} />

          <TextInput value={code} onChangeText={setCode} keyboardType='number-pad' maxLength={6} placeholder='123456' style={[styles.input, { backgroundColor: colors.surface }]} underlineColor='transparent' activeUnderlineColor={colors.primary} />

          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder='Nueva contraseña' style={[styles.input, { backgroundColor: colors.surface }]} underlineColor='transparent' activeUnderlineColor={colors.primary} />

          <TextInput value={password_confirmation} onChangeText={setPasswordConfirmation} secureTextEntry placeholder='Confirmar contraseña' style={[styles.input, { backgroundColor: colors.surface }]} underlineColor='transparent' activeUnderlineColor={colors.primary} />

          <Button mode='contained' loading={loading} onPress={handleReset} style={{ marginTop: 16 }}>
            Restablecer
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
  input: { height: 40, marginBottom: 10 }
});
