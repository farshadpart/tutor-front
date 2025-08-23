import { ChatBox } from '@/components/chatBox/ChatBox';
import { Chat, chat, transcription } from '@/services/chatGptService';
import { makeChatReady } from '@/services/chatService';
import { getChatHistory, Message, saveChatHistory } from '@/services/messageService';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([] as Message[]);
    const [input, setInput] = useState('');
    const [chatbotIsTyping, setChatbotIsTyping] = useState(false);
    const [anlysing, setAnalysing] = useState(false);

    useEffect(() => {
        const fetchChatHistory = async () => {
            const history = await getChatHistory();
            setMessages(history);
        };

        fetchChatHistory();
    }, []);

    const handleSendVoiceMessage = async (audio: { uri: string; name: string; type: string }) => {
        setAnalysing(true);
        let userTranscription = await transcription({ url: audio.uri });
        setAnalysing(false);
        await handleSendTextMessage(userTranscription);
    };

    const handleSendTextMessage = async (userTranscription?: string) => {
        const userInput = userTranscription ?? input.trim();
        const chats: Chat[] = [];
        if (!userInput) {
            setMessages(prev => {
                let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: 'Looks like we didn’t catch your voice or any text. Want to try again?', reply: true, error: true }]
                const save = async () => await saveChatHistory(latestMessages);
                save();
                return latestMessages;
            });
            return;
        }

        setMessages([...messages, { id: Date.now().toString(), text: userInput ?? '', reply: false }]);
        setInput('');
        setChatbotIsTyping(true);
        if (userInput.trim()) {
            messages.forEach(msg => {
                chats.push({ role: msg.reply ? 'assistant' : 'user', content: msg.text });
            });

            try {
                const response = await chat(makeChatReady(chats, userInput));
                const chatBotReply = response.choices[0].message.content;
                setMessages(prev => {
                    let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: chatBotReply ?? '', reply: true }]
                    const save = async () => await saveChatHistory(latestMessages);
                    save();
                    return latestMessages;
                });
            } catch {
                setMessages(prev => {
                    let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: 'It seems the tutor is busy! Please try again.', reply: true, error: true }]
                    const save = async () => await saveChatHistory(latestMessages);
                    save();
                    return latestMessages;
                });
            }

            setInput('');
            setChatbotIsTyping(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ChatBox 
                messages={messages} 
                analysing={anlysing} 
                chatbotIsTyping={chatbotIsTyping} 
                onRecordingComplete={(audio) => handleSendVoiceMessage(audio)}
                onSendTextMessage={handleSendTextMessage}
            />
        </SafeAreaView>
    );
}