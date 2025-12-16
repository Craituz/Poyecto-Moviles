import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Snackbar, Card, useTheme } from "react-native-paper";

export default function RegisterScreen({ navigation }) {
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const { colors } = theme;

    const handleRegister = () => {
        if (!name || !email || !password || !cpassword || !phone || !address) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        if (password.length < 6) {
             setError("La contraseña debe tener al menos 6 caracteres.");
             return;
        }
        if (password !== cpassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Simula registro exitoso
            navigation.replace("Dashboard");
        }, 800);
    };

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={[styles.container, { backgroundColor: colors.background }]}>
            <Card style={[styles.card, { backgroundColor: colors.surface }]}>
                <Card.Content>
                    <Text style={[styles.title, { color: colors.primary }]}>Crear Cuenta Nueva</Text>
                    <Text style={[styles.subtitle, { color: '#666' }]}>Únete a Yeli's Cake y disfruta de nuestros productos</Text>

                    {/* Nombre */}
                    <Text style={styles.label}>Nombre Completo</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={[styles.input, { backgroundColor: colors.surface }]}
                        placeholder="Tu nombre"
                        underlineColor="transparent"
                        activeUnderlineColor={colors.primary}
                    />
                    <View style={styles.underline} />

                    {/* Row: Email & Phone */}
                    <View style={styles.row}>
                        <View style={[styles.col, { marginRight: 10 }]}>
                             <Text style={styles.label}>Correo Electrónico</Text>
                             <TextInput
                                value={email}
                                onChangeText={setEmail}
                                style={[styles.input, { backgroundColor: colors.surface }]}
                                placeholder="tu@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                underlineColor="transparent"
                                activeUnderlineColor={colors.primary}
                            />
                            <View style={styles.underline} />
                        </View>
                        <View style={styles.col}>
                             <Text style={styles.label}>Teléfono</Text>
                             <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                style={[styles.input, { backgroundColor: colors.surface }]}
                                placeholder="0987654321"
                                keyboardType="phone-pad"
                                underlineColor="transparent"
                                activeUnderlineColor={colors.primary}
                            />
                            <View style={styles.underline} />
                        </View>
                    </View>

                    {/* Dirección */}
                    <Text style={styles.label}>Dirección</Text>
                    <TextInput
                        value={address}
                        onChangeText={setAddress}
                        style={[styles.input, { backgroundColor: colors.surface }]}
                        placeholder="Calle Principal #123, Ciudad"
                        underlineColor="transparent"
                        activeUnderlineColor={colors.primary}
                    />
                    <View style={styles.underline} />

                    {/* Contraseña */}
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={[styles.input, { backgroundColor: colors.surface }]}
                        placeholder="********"
                        underlineColor="transparent"
                        activeUnderlineColor={colors.primary}
                    />
                    <View style={styles.underline} />

                     {/* Confirmar Contraseña */}
                    <Text style={styles.label}>Confirmar Contraseña</Text>
                    <TextInput
                        secureTextEntry
                        value={cpassword}
                        onChangeText={setCpassword}
                        style={[styles.input, { backgroundColor: colors.surface }]}
                        placeholder="********"
                        underlineColor="transparent"
                        activeUnderlineColor={colors.primary}
                    />
                    <View style={styles.underline} />

                    {/* Note Box */}
                    <View style={styles.noteBox}>
                        <Text style={styles.noteText}>Nota: La contraseña debe tener al menos 6 caracteres</Text>
                    </View>

                    {/* Buttons Row */}
                    <View style={styles.buttonRow}>
                         <Button
                            mode="outlined"
                            onPress={() => navigation.navigate("Login")}
                            style={[styles.actionButton, { borderColor: colors.primary, marginRight: 10 }]}
                            textColor={colors.primary}
                            contentStyle={{ height: 45 }}
                            labelStyle={{ fontSize: 12 }}
                        >
                            VOLVER AL INICIO
                        </Button>
                         <Button
                            mode="contained"
                            loading={loading}
                            onPress={handleRegister}
                            style={[styles.actionButton, { flex: 1 }]}
                            contentStyle={{ height: 45 }}
                        >
                            Crear Cuenta
                        </Button>
                    </View>
                    
                    {/* Footer */}
                     <View style={styles.footerContainer}>
                        <Text style={{ color: colors.text }}>¿YA TIENES CUENTA?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={[styles.loginLink, { color: colors.primary }]}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </View>

                </Card.Content>
            </Card>
            <Snackbar
            visible = {!!error}
            onDismiss= {() => setError('')}
            duration = {3000}
            >
            {error}
            </Snackbar>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        paddingVertical: 10,
        elevation: 5,
        borderRadius: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        height: 40,
        paddingHorizontal: 0,
        fontSize: 14,
    },
    underline: {
        height: 1,
        backgroundColor: '#ccc',
        width: '100%',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    col: {
        flex: 1,
    },
    noteBox: {
        backgroundColor: '#E3F2FD', // Light blue
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 20,
    },
    noteText: {
        color: '#0D47A1',
        fontSize: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        borderRadius: 25,
        justifyContent: 'center',
        flex: 1,
    },
    footerContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    loginLink: {
        fontWeight: 'bold',
        marginTop: 5,
        fontSize: 16,
    }
})