import { Stack } from 'expo-router';
import { useAuthStore } from '../hooks/useAuthStore';
import { useTheme, ThemeProvider } from '@/src/providers/ThemeProvider';
import { ThemedModalProvider } from '../components/themedModal/ThemedModalContext';
import { View } from 'react-native';

function ThemedStack() {
    const authStore = useAuthStore();
    const { theme, scheme } = useTheme();

    return (
        <ThemedModalProvider>
            <View style={{flex: 1, backgroundColor: theme.colors.background}}>
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
                        <Stack.Screen name="User" options={{title: 'You'} } />
                    </Stack.Protected>
                    <Stack.Protected guard={authStore.user === undefined}>
                        <Stack.Screen name="Login" />
                        <Stack.Screen name="Register" />
                        <Stack.Screen name="ResetPassword" options={{ title: 'Reset Password' }} />
                    </Stack.Protected>
                    <Stack.Protected guard={authStore.user !== undefined && authStore.user.subscriptionGroup === undefined}>
                        <Stack.Screen name="Subscription" />
                    </Stack.Protected>
                </Stack>
            </View>
        </ThemedModalProvider>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <ThemedStack />
        </ThemeProvider>
    );
}
