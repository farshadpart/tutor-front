import { Alert, StyleSheet, Keyboard } from "react-native";
import { useState } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import { ThemedText } from "@/src/components/themedText/ThemedText";
import { ThemedTextInput } from "@/src/components/themedTextInput/ThemedTextInput";
import { ThemedTouchableOpacity } from "@/src/components/themedTouchableOpacity/ThemedTouchableOpacity";
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
                <ThemedText style={styles.title}>Login</ThemedText>

                <InputArea>
                    <ThemedText style={styles.label}>Email</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </InputArea>

                <InputArea>
                    <ThemedText style={styles.label}>Password</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </InputArea>

                <ThemedTouchableOpacity style={styles.button} onPress={() => handleLoginPress(email, password)}>
                    <ThemedText style={styles.buttonText}>Login</ThemedText>
                </ThemedTouchableOpacity>
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
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    },
});

export default Login;
