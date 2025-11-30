import { ChatBox } from '@/src/components/chatBox/ChatBox';
import { ChatScreenProps } from "@/src/components/chatBox/types/chatScreenProps";
import { makeChatReady } from '@/src/services/chatService';
import { getChatHistory, saveChatHistory, upsertChatInfo } from '@/src/services/messageService';
import { chat, transcription } from '@/src/services/tutorApiService';
import { Chat } from "@/src/types/chat/chat";
import { Message } from "@/src/types/chat/message";
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function ChatScreen({ chatId }: ChatScreenProps) {
    const [messages, setMessages] = useState<Message[]>([] as Message[]);
    const [input, setInput] = useState('');
    const [chatbotIsTyping, setChatbotIsTyping] = useState(false);
    const [analysing, setAnalysing] = useState(false);
    const authState = useAuthStore();

    useEffect(() => {
        const fetchChatHistory = async () => {
            setMessages(await getChatHistory(chatId));
        };

        fetchChatHistory().then();
    },[chatId]);

    useEffect(() => {
        return () => {
            const message = messages.at(-1);
            if (message !== undefined && !message.error && !message.reply) {
                upsertChatInfo({ id: chatId, title: message?.text }).then();
            }
        };
    }, [messages, chatId])

    const handleSendVoiceMessage = async (audio: { uri: string; name: string; type: string }) => {
        setAnalysing(true);
        let userTranscription = await transcription({ url: audio.uri, accessToken: authState.accessToken });
        setAnalysing(false);
        await handleSendTextMessage(userTranscription);
    };

    const handleSendTextMessage = async (userTranscription?: string) => {
        const userInput = userTranscription ?? input.trim();
        const chats: Chat[] = [];
        if (!userInput) {
            setMessages(prev => {
                let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: 'Looks like we didn’t catch your voice or any text. Want to try again?', reply: true, error: true }]
                const save = async () => await saveChatHistory(chatId, latestMessages);
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
                const chatBotReply = await chat({ input: makeChatReady(chats, userInput), accessToken: authState.accessToken });
                setMessages(prev => {
                    let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: chatBotReply ?? '', reply: true }]
                    const save = async () => await saveChatHistory(chatId, latestMessages);
                    save();
                    return latestMessages;
                });
            } catch {
                setMessages(prev => {
                    let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: 'It seems the tutor is busy! Please try again.', reply: true, error: true }]
                    const save = async () => await saveChatHistory(chatId, latestMessages);
                    save();
                    return latestMessages;
                });
            }

            setInput('');
            setChatbotIsTyping(false);
        }
    };

    return (
        <ChatBox
            messages={messages}
            analysing={analysing}
            chatbotIsTyping={chatbotIsTyping}
            onRecordingComplete={(audio) => handleSendVoiceMessage(audio)}
            onSendTextMessage={handleSendTextMessage}
        />
    );
}