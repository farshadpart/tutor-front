import { ChatBoxProps } from "@/src/components/chatBox/types/chatBoxProps";
import { MessageItem } from '@/src/components/messageItem/MessageItem';
import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedTextInput } from '@/src/components/themedTextInput/ThemedTextInput';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { ThemedView } from '@/src/components/themedView/ThemedView';
import { useTheme } from '@/src/providers/ThemeProvider';
import { TextResponse } from '@/src/types/chat/tutorReply';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import KeyboardShiftView from '../keyboardShiftView/KeyboardShiftView';
import { VoiceRecorder } from '../recorder/VoiceRecorder';
import { TabbedMessage } from '../tabbedMessage/TabbedMessage';
import { ThemedFlatList } from "../themedFlatList/themedFlatList";
import { ChatBoxFooter } from './ChatBoxFooter';

const MESSAGE_LIMIT = 500;

export const ChatBox = ({ messages, onRecordingComplete, analysing, chatbotIsTyping, onSendTextMessage }: ChatBoxProps) => {
    const { theme } = useTheme();
    const localMessages = [...messages].reverse();
    const messageLimitReached = messages.length > MESSAGE_LIMIT;
    const [input, setInput] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const handlePressSend = () => {
        onSendTextMessage(input);
        setInput('');
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }

    const handleRecordingComplete = (audio: { uri: string; name: string; type: string }) => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        onRecordingComplete(audio);
    }

    return (
        <KeyboardShiftView scrollable={true}>
            <ThemedFlatList
                keyboardShouldPersistTaps="handled"
                inverted
                ref={flatListRef}
                data={localMessages}
                keyExtractor={item => item.id}
                renderItem=
                {
                    ({ item }) => {
                        if (item.reply && !item.error) {
                            const tutorReply = JSON.parse(item.text) as TextResponse;
                            return <TabbedMessage 
                                correction={tutorReply.correction} 
                                response={tutorReply.response} 
                                revisedSentence={tutorReply.revisedSentence} 
                                audioUrl={item.audioUrl}
                            />
                        }

                        return <MessageItem item={item} />
                    }
                }
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                ListHeaderComponent={<ChatBoxFooter chatbotIsTyping={chatbotIsTyping} analysing={analysing} />}
            />
            <ThemedView style={styles.inputContainer}>
                {
                    messageLimitReached ?
                        <ThemedView style={[styles.limitMessageContainer, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.border }]}>
                            <ThemedText style={styles.limitMessage}>You've reached the message limit for this chat. Please start a new chat to continue.</ThemedText>
                        </ThemedView> :
                        <>
                            <ThemedTextInput
                                maxLength={1000}
                                multiline
                                style={styles.input}
                                value={input}
                                onChangeText={setInput}
                                placeholder="Type a message"
                            />
                            {
                                input.length === 0 ?
                                    <VoiceRecorder onRecordingComplete={handleRecordingComplete} /> :
                                    <ThemedTouchableOpacity disabled={chatbotIsTyping} onPress={handlePressSend} style={[styles.sendButton, { backgroundColor: theme.colors.background }]}>
                                        <Ionicons name="send" size={24} color={theme.colors.text} />
                                    </ThemedTouchableOpacity>
                            }
                        </>
                }
            </ThemedView>
        </KeyboardShiftView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    input: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    sendButton: {
        paddingHorizontal: 10
    },
    limitMessageContainer: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 24,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    limitMessage: {
        textAlign: 'center',
    },
});
