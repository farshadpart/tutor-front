import { Alert, TouchableOpacity, Text, View, TextInput, StyleSheet, Keyboard } from "react-native";
import { useState } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import KeyboardShiftView from "../components/keyboardShiftView/KeyboardShiftView";
import InputArea from "../components/keyboardShiftView/InputArea";

const Login = () => {
    const authStore = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginPress = async (email: string, password: string) => {
        const loginResult = await authStore.logIn({ email, password });

        if (!loginResult) {
            Alert.alert("Login Failed", "Login failed, please try again later!");
            return;
        }

        Keyboard.dismiss();
    }

    return (
        <KeyboardShiftView>
            <ThemedView style={styles.container}>
                <Text style={styles.title}>Login</Text>

                <InputArea>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </InputArea>

                <InputArea>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </InputArea>

                <TouchableOpacity style={styles.button} onPress={() => handleLoginPress(email, password)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </ThemedView>
        </KeyboardShiftView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#111827",
    },
    label: {
        fontSize: 16,
        color: "#374151",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});

export default Login;
