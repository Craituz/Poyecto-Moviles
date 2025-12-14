import { useState } from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button, Card, Snackbar, TextInput, useTheme } from "react-native-paper"

export default function RegisterScreen({ navigation }) {
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const { colors } = theme;

    const handleRegister = () => {
        if (!name || !email || !password || !cpassword) {
            setError("Todos los campos son obligatorios.");
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
        <View style = {[styles.container, { backgroundColor: colors.background }]}>
            <Card style = {[styles.card, { backgroundColor: colors.surface }]}>
                <Card.Content>
                    <Text style={[styles.title, { color: colors.primary }]}>Únete a Yeli's Cake</Text>
                    <Text style={[styles.subtitle, { color: colors.secondary }]}>Crea tu cuenta para pedir delicias</Text>

                    <TextInput
                    label = "Nombre completo"
                    mode = "outlined"
                    value = {name}
                    onChangeText = {setName}
                    style = {[styles.input, { backgroundColor: colors.surface }]}
                    autoCapitalize = "none"
                    keyboardType = "email-address"
                    />
                    <TextInput
                    label = "Correo electronico"
                    mode = "outlined"
                    value = {email}
                    onChangeText = {setEmail}
                    style = {[styles.input, { backgroundColor: colors.surface }]}
                    autoCapitalize = "none"
                    keyboardType = "email-address"
                    />

                    <TextInput
                    label = "Contraseña"
                    mode = "outlined"
                    secureTextEntry
                    value = {password}
                    onChangeText = {setPassword}
                    style = {[styles.input, { backgroundColor: colors.surface }]}
                    />

                    <TextInput
                    label = "Confirnmar Contraseña"
                    mode = "outlined"
                    secureTextEntry
                    value = {cpassword}
                    onChangeText = {setCpassword}
                    style = {[styles.input, { backgroundColor: colors.surface }]}
                    />

                    <Button
                    mode = "contained"
                    loading = {loading}
                    onPress={handleRegister}
                    style = {styles.button}
                    >
                    Registrar
                    </Button>
                    <Button
                    mode = "text"
                    onPress={() => navigation.goBack()}
                    style = {{ marginTop: 16 }}
                    labelStyle={{ color: colors.secondary }}
                    >
                    Ya tengo cuenta
                    </Button>

                </Card.Content>
            </Card>
            <Snackbar
            visible = {!!error}
            onDismiss= {() => setError('')}
            duration = {3000}
            >
            {error}
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 22,
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 18,
    },
    input: {
        marginBottom: 14,
    },
    button: {
        marginTop: 8,
        paddingVertical: 6,
    }

})