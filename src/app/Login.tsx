import KeyboardShiftView from "@/src/components/keyboardShiftView/KeyboardShiftView";
import { ActConfirm } from '@/src/components/modalTemplates/confirm/ActConfirm';
import { useModal } from '@/src/components/themedModal/ThemedModalContext';
import { ThemedText } from "@/src/components/themedText/ThemedText";
import { ThemedTextInput } from "@/src/components/themedTextInput/ThemedTextInput";
import { ThemedTouchableOpacity } from "@/src/components/themedTouchableOpacity/ThemedTouchableOpacity";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import { Messages } from '@/src/constants/messages';
import { useAuthStore } from "@/src/hooks/useAuthStore";
import { Link } from "expo-router";
import { useState } from "react";
import { Keyboard, StyleSheet } from "react-native";

const Login = () => {
    const { showModal, closeModal } = useModal();
    const authStore = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginPress = async (email: string, password: string) => {
        const loginResponse = await authStore.logIn({ email, password });

        if (!loginResponse.isSuccess) {

            if (loginResponse.error === '401') {
                showModal({ children: <ActConfirm title={Messages.loginFailed} message={Messages.loginFailedPleaseCheckYourCredentialsAndTryAgain} onAct={closeModal} /> });
                return;
            }

            showModal({ children: <ActConfirm title={Messages.loginFailed} message={Messages.somethingWentWrongPleaseTryLater} onAct={closeModal} /> });
            return;
        }

        Keyboard.dismiss();
    }

    return (
        <KeyboardShiftView>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Login</ThemedText>

                <ThemedText style={styles.label}>Email</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder={Messages.enterYourEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <ThemedText style={styles.label}>Password</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder={Messages.enterYourPassword}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <ThemedTouchableOpacity style={styles.button} onPress={() => handleLoginPress(email, password)}>
                    <ThemedText style={styles.buttonText}>Login</ThemedText>
                </ThemedTouchableOpacity>

                <ThemedText style={styles.footerText}>
                    {'Forgot your password? '}
                    <Link href="/ResetPassword" style={styles.link}>Reset Password</Link>
                </ThemedText>
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
    footerText: {
        marginTop: 24,
        textAlign: "center",
        fontSize: 15,
    },
    link: {
        fontWeight: "600",
    },
});

export default Login;
