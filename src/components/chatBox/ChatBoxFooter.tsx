import { ChatBoxFooterProps } from "@/src/components/chatBox/types/chatBoxFooterProps";
import { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/src/components/themedView/ThemedView';
import { ThemedText } from '@/src/components/themedText/ThemedText';

export const ChatBoxFooter = ({chatbotIsTyping, analysing}:ChatBoxFooterProps) => {
    const renderFooter = () => {
        if (chatbotIsTyping) {
            return (
                <ThemedView style={styles.typingIndicator}>
                    <ThemedText>Assistant is typing...</ThemedText>
                </ThemedView>
            );
        }

        if (analysing) {
            return (
                <ThemedView style={styles.typingIndicator}>
                    <ThemedText>Analysing your voice...</ThemedText>
                </ThemedView>
            );
        }

        return <Fragment/>;
    }

    return (
        renderFooter()
    );
}

const styles = StyleSheet.create({
    typingIndicator: {
        padding: 10,
        alignItems: 'center',
    }
});
