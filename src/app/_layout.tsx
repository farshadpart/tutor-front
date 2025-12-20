import { Stack } from 'expo-router';
import { useAuthStore } from '../hooks/useAuthStore';
import { useTheme, ThemeProvider } from '@/src/providers/ThemeProvider';

function ThemedStack() {
    const authStore = useAuthStore();
    const { theme, scheme } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                    color: theme.colors.text,
                },
                contentStyle: {
                    backgroundColor: theme.colors.background,
                },
                statusBarStyle: scheme === 'dark' ? 'light' : 'dark',
                animation: scheme === 'dark' ? 'fade' : 'default',
            }}
        >
            <Stack.Protected guard={authStore.user === undefined}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={authStore.user !== undefined && authStore.user.subscriptionGroup !== undefined}>
                <Stack.Screen name="chatArea" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={authStore.user === undefined}>
                <Stack.Screen name="Login" />
                <Stack.Screen name="Register" />
            </Stack.Protected>
            <Stack.Protected guard={authStore.user !== undefined && authStore.user.subscriptionGroup === undefined}>
                <Stack.Screen name="Subscription" />
            </Stack.Protected>
        </Stack>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <ThemedStack />
        </ThemeProvider>
    );
}
