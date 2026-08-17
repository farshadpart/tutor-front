import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { UserSettingsControl } from '@/src/components/userSummary/UserSettingsControl';
import { useAuthStore } from '@/src/hooks/useAuthStore';
import { useTheme } from '@/src/providers/ThemeProvider';
import { UserSettingsProvider } from '@/src/providers/UserSettingsProvider';
import { StyleSheet, View } from 'react-native';

const UserContent = () => {
    const { theme } = useTheme();
    const authStore = useAuthStore();

    return (
        <View style={styles.container}>
            <UserSettingsControl />
            <ThemedTouchableOpacity testID="logOutButton" style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={async () => await authStore.logOut(authStore.tokenHolder?.refreshToken.token)}>
                <ThemedText style={[styles.buttonText, { color: theme.colors.text }]}>Logout</ThemedText>
            </ThemedTouchableOpacity>
        </View>
    )
}

const User = () => (
    <UserSettingsProvider>
        <UserContent />
    </UserSettingsProvider>
);

export default User;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    button: {
        marginTop: 20,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    }
});
