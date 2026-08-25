import KeyboardShiftView from "@/src/components/keyboardShiftView/KeyboardShiftView";
import { ActConfirm } from "@/src/components/modalTemplates/confirm/ActConfirm";
import { useModal } from "@/src/components/themedModal/ThemedModalContext";
import { ThemedText } from "@/src/components/themedText/ThemedText";
import { ThemedTextInput } from "@/src/components/themedTextInput/ThemedTextInput";
import { ThemedTouchableOpacity } from "@/src/components/themedTouchableOpacity/ThemedTouchableOpacity";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import { Messages } from "@/src/constants/messages";
import { forgotPassword, resetPassword } from "@/src/services/authenticationService";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, StyleSheet } from "react-native";

const readParam = (param?: string | string[]) => Array.isArray(param) ? param[0] ?? "" : param ?? "";

const ResetPassword = () => {
    const router = useRouter();
    const { showModal, closeModal } = useModal();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [hasResetToken, setHasResetToken] = useState<boolean>(false);

    const handleForgotPasswordPress = async () => {
        const trimmedEmail = email.trim();
        if (trimmedEmail.length === 0) {
            showModal({ children: <ActConfirm onAct={closeModal} title={Messages.resetPasswordFailed} message={Messages.pleaseEnterYourEmailAddress} /> });
            return;
        }

        const forgotPasswordResult = await forgotPassword({ email: trimmedEmail });
        if (forgotPasswordResult.isSuccess) {
            Keyboard.dismiss();
            showModal({ children: <ActConfirm onAct={closeModal} title={Messages.resetPasswordEmailSent} message={Messages.pleaseCheckYourEmailForPasswordResetInstructions} /> });
            setHasResetToken(true);
            return;
        }

        showModal({ children: <ActConfirm onAct={closeModal} title={Messages.resetPasswordFailed} message={Messages.yourPasswordResetRequestCouldNotBeCompletedPleaseTryLater} /> });
    }

    const handleResetPasswordPress = async () => {
        const trimmedEmail = email.trim();
        const trimmedToken = token.trim();
        if (trimmedEmail.length === 0) {
            showModal({ children: <ActConfirm onAct={closeModal} title={Messages.resetPasswordFailed} message={Messages.pleaseEnterYourEmailAddress} /> });
            return;
        }

        if (trimmedToken.length === 0) {
            showModal({ children: <ActConfirm onAct={closeModal} title={Messages.resetPasswordFailed} message={Messages.pleaseEnterYourResetToken} /> });
            return;
        }

        if (newPassword.length === 0) {
            showModal({ children: <ActConfirm onAct={closeModal} title={Messages.resetPasswordFailed} message={Messages.pleaseEnterYourNewPassword} /> });
            return;
        }

        if (newPassword !== confirmPassword) {
            showModal({ children: <ActConfirm onAct={closeModal} title={Messages.passwordMismatch} message={Messages.passwordsDoNotMatchPleaseReenterYourPassword} /> });
            return;
        }

        const resetPasswordResult = await resetPassword({ email: trimmedEmail, token: trimmedToken, newPassword });
        if (resetPasswordResult.isSuccess) {
            Keyboard.dismiss();
            showModal({ children: <ActConfirm onAct={closeModal} title={Messages.passwordResetComplete} message={Messages.yourPasswordHasBeenResetPleaseLoginWithYourNewPassword} /> });
            router.replace("/Login");
            return;
        }

        showModal({ children: <ActConfirm onAct={closeModal} title={Messages.resetPasswordFailed} message={Messages.yourPasswordResetRequestCouldNotBeCompletedPleaseTryLater} /> });
    }

    return (
        <KeyboardShiftView>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Reset Password</ThemedText>
                <ThemedText style={styles.description}>
                    {hasResetToken
                        ? "Enter your new password to finish resetting your account."
                        : "Enter your email address and we will send password reset instructions."}
                </ThemedText>

                <ThemedText style={styles.label}>Email</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder={Messages.enterYourEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                />

                {hasResetToken && (
                    <>
                        <ThemedText style={styles.label}>Token</ThemedText>
                        <ThemedTextInput
                            style={styles.input}
                            placeholder="Enter your reset token"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={token}
                            onChangeText={setToken}
                        />

                        <ThemedText style={styles.label}>New Password</ThemedText>
                        <ThemedTextInput
                            style={styles.input}
                            placeholder={Messages.enterYourPassword}
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />

                        <ThemedText style={styles.label}>Confirm Password</ThemedText>
                        <ThemedTextInput
                            style={styles.input}
                            placeholder={Messages.confirmYourPassword}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </>
                )}

                <ThemedTouchableOpacity style={styles.button} onPress={hasResetToken ? handleResetPasswordPress : handleForgotPasswordPress}>
                    <ThemedText style={styles.buttonText}>{hasResetToken ? "Reset Password" : "Send Reset Email"}</ThemedText>
                </ThemedTouchableOpacity>

                <ThemedText style={styles.footerText}>
                    Remembered your password?{" "}
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
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
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
        fontSize: 15,
    },
    link: {
        fontWeight: "600",
    },
});

export default ResetPassword;
