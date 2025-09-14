import { ChatBox } from '@/components/chatBox/ChatBox';
import { Chat, chat, transcription } from '@/services/chatGptService';
import { makeChatReady } from '@/services/chatService';
import { getChatHistory, Message, saveChatHistory, upsertChatInfo } from '@/services/messageService';
import { useEffect, useState, useRef } from 'react';
import { randomUUID } from 'expo-crypto';

export interface ChatScreenProps {
    chatId: string | 'NewChat';
}

export default function ChatScreen({ chatId }: ChatScreenProps) {
    const chatIdRef = useRef(chatId);
    const [messages, setMessages] = useState<Message[]>([] as Message[]);
    const [input, setInput] = useState('');
    const [chatbotIsTyping, setChatbotIsTyping] = useState(false);
    const [analysing, setAnalysing] = useState(false);

    useEffect(() => {
        const fetchChatHistory = async () => {
            let history: Message[];
            if (chatIdRef.current === 'NewChat') {
                history = [] as Message[];
            }
            else {
                history = await getChatHistory(chatIdRef.current);
            }
            setMessages(history);
        };

        fetchChatHistory().then();
    },[]);

    useEffect(() => {
        return () => {
            const message = messages.at(-1);
            if (chatIdRef.current === 'NewChat') {
                chatIdRef.current = randomUUID();
            }

            if (message !== undefined && !message.error && !message.reply) {
                upsertChatInfo({ id: chatIdRef.current, title: message?.text }).then();
            }
        };
    }, [messages])

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
                const save = async () => await saveChatHistory(chatIdRef.current, latestMessages);
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
                    const save = async () => await saveChatHistory(chatIdRef.current, latestMessages);
                    save();
                    return latestMessages;
                });
            } catch {
                setMessages(prev => {
                    let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: 'It seems the tutor is busy! Please try again.', reply: true, error: true }]
                    const save = async () => await saveChatHistory(chatIdRef.current, latestMessages);
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