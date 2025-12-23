import { ConfirmProps } from '@/src/components/modalTemplates/confirm/types/confirmProps';
import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { useTheme } from '@/src/providers/ThemeProvider';
import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

export const ActConfirm = ({ title, message, submitLabel, onCancel, onAct }: ConfirmProps) => {
    const { theme } = useTheme();

    return (
        <Fragment>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={styles.message}>
                {message}
            </ThemedText>

            <View style={styles.actions}>
                <ThemedTouchableOpacity style={{ padding: 6, backgroundColor: theme.colors.secondary}} onPress={onCancel}>
                    <ThemedText>Cancel</ThemedText>
                </ThemedTouchableOpacity>

                <ThemedTouchableOpacity
                    onPress={onAct}
                    style={{ padding: 6, backgroundColor: theme.colors.destructiveBackground }}
                >
                    <ThemedText style={{ color: theme.colors.destructive }}>
                        { submitLabel !== undefined ? submitLabel : 'Ok' }
                    </ThemedText>
                </ThemedTouchableOpacity>
            </View>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        opacity: 0.85,
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
