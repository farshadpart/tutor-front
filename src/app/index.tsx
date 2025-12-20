import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { ThemedSafeAreaView } from '@/src/components/themedSafeAreaView/ThemedSafeAreaView';
import { ThemedText } from '@/src/components/themedText/ThemedText'
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';

export default function Index() {
    const router = useRouter();

    return (
        <ThemedSafeAreaView style={styles.container}>
            <ThemedText style={styles.title}>Welcome</ThemedText>

            <ThemedTouchableOpacity onPress={() => router.push('/Login')} style={styles.button}>
                <ThemedText style={styles.buttonText}>Login</ThemedText>
            </ThemedTouchableOpacity>

            <ThemedTouchableOpacity onPress={() => router.push('/Register')} style={[styles.button]}>
                <ThemedText style={[styles.buttonText]}>Register</ThemedText>
            </ThemedTouchableOpacity>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 40
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
    }
});