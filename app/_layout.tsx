import { Stack } from "expo-router";
import { useAuthStore } from "../hooks/useAuthStore";

export default function Layout() {
    const authStore = useAuthStore();

    return (
        <Stack>
            <Stack.Protected guard={authStore.user === undefined}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={authStore.user !== undefined}>
                <Stack.Screen name="chatArea" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={authStore.user === undefined}>
                <Stack.Screen name="Login" />
                <Stack.Screen name="Register" />
            </Stack.Protected>
        </Stack>
    );
}