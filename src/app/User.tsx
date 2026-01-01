import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { useAuthStore } from '@/src/hooks/useAuthStore';
import { useTheme } from '@/src/providers/ThemeProvider';
import { StyleSheet } from 'react-native';

const User = () => {
    const { theme } = useTheme();
    const authStore = useAuthStore();

    return (
        <ThemedTouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={() => authStore.logOut(authStore.user!.email)}>
            <ThemedText style={[styles.buttonText, { color: theme.colors.text }]}>Logout</ThemedText>
        </ThemedTouchableOpacity>
    )
}

export default User;

const styles = StyleSheet.create({
    button: {
        margin: 20,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    }
});
