import { StyleSheet, Text, View } from 'react-native';
import { VoiceRecorder } from '../recorder/VoiceRecorder';

interface ChatBoxFooterProps {
    chatbotIsTyping: boolean;
    analysing: boolean;
    onRecordingComplete: (audio: { uri: string; name: string; type: string }) => void;
}

export const ChatBoxFooter = ({chatbotIsTyping, analysing, onRecordingComplete}:ChatBoxFooterProps) => {
    const renderFooter = () => {
        if (chatbotIsTyping) {
            return (
                <View style={styles.typingIndicator}>
                    <Text>Assistant is typing...</Text>
                </View>
            );
        }

        if (analysing) {
            return (
                <View style={styles.typingIndicator}>
                    <Text>Analysing your voice...</Text>
                </View>
            );
        }

        return (
            <View style={styles.mic}>
                <VoiceRecorder onRecordingComplete={onRecordingComplete} />
            </View>
        );
    }

    return (
        renderFooter()
    );
}

const styles = StyleSheet.create({
    typingIndicator: {
        padding: 10,
        alignItems: 'center',
    },
    mic: {
        alignItems: 'center',
    },
});
