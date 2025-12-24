import { ActConfirm } from '@/src/components/modalTemplates/confirm/ActConfirm';
import { useModal } from '@/src/components/themedModal/ThemedModalContext';
import { ThemedText } from "@/src/components/themedText/ThemedText";
import { ThemedTextInput } from "@/src/components/themedTextInput/ThemedTextInput";
import { ThemedTouchableOpacity } from "@/src/components/themedTouchableOpacity/ThemedTouchableOpacity";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import { useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import InputArea from "../components/keyboardShiftView/InputArea";
import KeyboardShiftView from "../components/keyboardShiftView/KeyboardShiftView";
import { useAuthStore } from "../hooks/useAuthStore";

const Login = () => {
    const { showModal, closeModal } = useModal();
    const authStore = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginPress = async (email: string, password: string) => {
        const loginResult = await authStore.logIn({ email, password });

        if (!loginResult.isSuccess) {

            if (loginResult.error === '401') {
                showModal({children: <ActConfirm title='Login Failed' message='Login failed, please check your credentials and try again.' onAct={closeModal} />});
                return;
            }

            showModal({ children: <ActConfirm title='Login Failed' message='Something went wrong, please try later!' onAct={closeModal} /> });
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
