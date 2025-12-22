import { useTheme } from '@/src/providers/ThemeProvider'
import { Modal, StyleSheet } from 'react-native';
import { ThemedAlertProps } from './types/ThemedAlertProps';
import { ThemedView } from '@/src/components/themedView/ThemedView';
import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';

export function ThemedModal({
    visible,
    title,
    message,
    onClose,
}: ThemedAlertProps) {
    const { theme } = useTheme();


    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <ThemedView style={styles.overlay}>
                <ThemedView
                    style={[
                        styles.container,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <ThemedText
                        style={[
                            styles.title,
                            { color: theme.colors.text },
                        ]}
                    >
                        {title}
                    </ThemedText>

                    <ThemedText
                        style={[
                            styles.message,
                            { color: theme.colors.textSecondary },
                        ]}
                    >
                        {message}
                    </ThemedText>

                    <ThemedTouchableOpacity
                        onPress={onClose}
                        style={[
                            styles.button,
                            { backgroundColor: theme.colors.primary },
                        ]}
                    >
                        <ThemedText style={[styles.buttonText, { color: theme.colors.primaryText }]}>
                            OK
                        </ThemedText>
                    </ThemedTouchableOpacity>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        marginBottom: 20,
    },
    button: {
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: '600',
    },
});