import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/src/components/themedView/ThemedView';
import { ThemedText } from '@/src/components/themedText/ThemedText';
import { useTheme } from '@/src/providers/ThemeProvider';

export const MessageItem = React.memo(({ item }: { item: any }) => {
    const { theme } = useTheme();

    let backgroundColor: string;
    if (item.reply) {
        backgroundColor = !item.error ? theme.colors.replyMessageBackground : theme.colors.errorMessageBackground;
    } else {
        backgroundColor = theme.colors.messageBackground;
    }

    return (
        <ThemedView
            style={[
                styles.message,
                { backgroundColor },
                item.reply
                    ? !item.error
                        ? styles.replyMessage
                        : styles.errorMessage
                    : styles.receivedMessage
            ]}
        >
            <ThemedText style={{ color: theme.colors.text }}>
                {item.text}
            </ThemedText>
        </ThemedView>
    );
});

MessageItem.displayName = "Message";

const styles = StyleSheet.create({
    message: {
        padding: 10,
        margin: 5,
        borderRadius: 10,
        maxWidth: '75%',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
    },
    replyMessage: {
        alignSelf: 'flex-end',
    },
    errorMessage: {
        alignSelf: 'flex-end',
    }
});
