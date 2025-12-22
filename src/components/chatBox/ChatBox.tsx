import { ChatBoxProps } from "@/src/components/chatBox/types/chatBoxProps";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { MessageItem } from '@/src/components/messageItem/MessageItem';
import InputArea from '../keyboardShiftView/InputArea';
import KeyboardShiftView from '../keyboardShiftView/KeyboardShiftView';
import { VoiceRecorder } from '../recorder/VoiceRecorder';
import { ChatBoxFooter } from './ChatBoxFooter';
import { ThemedView } from '@/src/components/themedView/ThemedView';
import { ThemedTextInput } from '@/src/components/themedTextInput/ThemedTextInput';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { useTheme } from '@/src/providers/ThemeProvider';

export const ChatBox = ({ messages, onRecordingComplete, analysing, chatbotIsTyping, onSendTextMessage }: ChatBoxProps) => {
    const { theme } = useTheme();
    const localMessages = [...messages].reverse();
    const [input, setInput] = useState('');
    const flatListRef = useRef<FlatList>(null);

    console.log('Color, ', theme.colors.text)

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
            <FlatList
                inverted
                ref={flatListRef}
                data={localMessages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <MessageItem item={item} />}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                ListHeaderComponent={<ChatBoxFooter chatbotIsTyping={chatbotIsTyping} analysing={analysing} />}
            />
            <InputArea>
                <ThemedView style={styles.inputContainer}>
                    <ThemedTextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type a message"
                    />
                    {
                        input.length === 0 ?
                            <VoiceRecorder onRecordingComplete={handleRecordingComplete} /> :
                            <ThemedTouchableOpacity disabled={chatbotIsTyping} onPress={handlePressSend} style={styles.sendButton}>
                                <Ionicons name="send" size={24} color={theme.colors.text} />
                            </ThemedTouchableOpacity>
                    }
                </ThemedView>
            </InputArea>
        </KeyboardShiftView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    sendButton: {
        paddingHorizontal: 10
    },
});