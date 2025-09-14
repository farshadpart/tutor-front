import { Message } from '@/services/messageService';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Fragment, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { MessageItem } from '../MessageItem';
import { VoiceRecorder } from '../recorder/VoiceRecorder';
import { ChatBoxFooter } from './ChatBoxFooter';

interface ChatBoxProps {
    messages: Message[];
    analysing: boolean;
    chatbotIsTyping: boolean;
    onRecordingComplete: (audio: { uri: string; name: string; type: string }) => void;
    onSendTextMessage: (userTranscription?: string) => void;
}

export const ChatBox = ({ messages, onRecordingComplete, analysing, chatbotIsTyping, onSendTextMessage }: ChatBoxProps) => {
    const localMessages = [...messages].reverse();
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
        <Fragment>
            <FlatList
                inverted
                ref={flatListRef}
                data={localMessages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <MessageItem item={item} />}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={<ChatBoxFooter chatbotIsTyping={chatbotIsTyping} analysing={analysing} />}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message"
                />
                {
                    input.length === 0 ?
                        <VoiceRecorder onRecordingComplete={handleRecordingComplete} /> :
                        <TouchableOpacity disabled={chatbotIsTyping} onPress={handlePressSend} style={styles.sendButton}>
                            <Ionicons name="send" size={24} color="black" />
                        </TouchableOpacity>
                }
            </View>
        </Fragment>
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