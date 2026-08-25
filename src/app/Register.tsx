import KeyboardShiftView from "@/src/components/keyboardShiftView/KeyboardShiftView";
import { ActConfirm } from '@/src/components/modalTemplates/confirm/ActConfirm';
import { useModal } from "@/src/components/themedModal/ThemedModalContext";
import { ThemedText } from "@/src/components/themedText/ThemedText";
import { ThemedTextInput } from "@/src/components/themedTextInput/ThemedTextInput";
import { ThemedTouchableOpacity } from "@/src/components/themedTouchableOpacity/ThemedTouchableOpacity";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import { register } from "@/src/services/authenticationService";
import { RegisterRequest } from "@/src/types/authentication/registerRequest";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { Messages } from '@/src/constants/messages'

const Register = () => {
    const router = useRouter();
    const { showModal, closeModal } = useModal();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegisterPress = async (registerRequest: RegisterRequest) => {
        if (password !== confirmPassword) {
            showModal({ children: <ActConfirm onAct={closeModal} title={Messages.passwordMismatch} message={Messages.passwordsDoNotMatchPleaseReenterYourPassword} /> });
            return;
        }

        const registerResult = await register(registerRequest);
        if (registerResult.isSuccess) {
            Keyboard.dismiss();
            showModal({ children: <ActConfirm onAct={closeModal} title={Messages.emailConfirmation} message={Messages.pleaseCheckYourConfirmationEmailToVerifyYourAddress} /> });
            router.replace("/");

            return;
        }

        showModal({ children: <ActConfirm onAct={closeModal} title={Messages.registrationFailed} message={Messages.yourRegistrationCouldNotBeCompletedPleaseTryLater} /> });
    }

    return (
        <KeyboardShiftView>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Create Account</ThemedText>

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

                <ThemedText style={styles.label}>Confirm Password</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder={Messages.confirmYourPassword}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <ThemedTouchableOpacity style={styles.button} onPress={() => handleRegisterPress({ email, password })}>
                    <ThemedText style={styles.buttonText}>Register</ThemedText>
                </ThemedTouchableOpacity>

                <ThemedText style={styles.footerText}>
                    Already have an account?{" "}
                    <Link href="/Login" style={styles.link}>Login</Link>
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
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    },
    footerText: {
        marginTop: 24,
        textAlign: "center",
        fontSize: 15
    },
    link: {
        fontWeight: "600",
    },
});

export default Register;
