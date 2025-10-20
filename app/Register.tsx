import { Link, useRouter } from "expo-router";
import { TouchableOpacity, View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { register } from "../services/accountService"
import { RegisterRequest } from "../interfaces/account/registerRequest"

const Register = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegisterPress = async (registerRequest: RegisterRequest) => {
        if (password !== confirmPassword) {
            Alert.alert("Password Mismatch", "Passwords do not match. Please re-enter your password.");
            return;
        }

        const registerResult = await register(registerRequest);
        if (registerResult) {
            Alert.alert("Email Confirmation", "Please check your confirmation email to verify your address.");
            router.replace("/");

            return;
        }

        Alert.alert("Registration Failed", "Your registration could not be completed. Please check your confirmation email and try again.");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={() => handleRegisterPress({ email, password })}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Already have an account?{" "}
                <Link href="/Login" style={styles.link}>Login</Link>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f9fafb",
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
        backgroundColor: "#16a34a",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    footerText: {
        marginTop: 24,
        textAlign: "center",
        fontSize: 15,
        color: "#6b7280",
    },
    link: {
        color: "#2563eb",
        fontWeight: "600",
    },
});

export default Register;
