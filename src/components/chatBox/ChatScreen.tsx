import { ChatBox } from '@/src/components/chatBox/ChatBox';
import { ChatScreenProps } from "@/src/components/chatBox/types/chatScreenProps";
import { ActConfirm } from '@/src/components/modalTemplates/confirm/ActConfirm';
import { useModal } from '@/src/components/themedModal/ThemedModalContext';
import { Messages } from '@/src/constants/messages';
import { useAuthStore } from '@/src/hooks/useAuthStore';
import { getChatHistory, saveChatHistory, upsertChatInfo } from '@/src/services/messageService';
import { chat, transcription } from '@/src/services/tutorApiService';
import { Chat } from "@/src/types/chat/chat";
import { Message } from "@/src/types/chat/message";
import { useEffect, useState } from 'react';
import { saveAudio } from "@/src/services/fileService";

export default function ChatScreen({ chatId }: ChatScreenProps) {
    const { showModal, closeModal } = useModal();
    const [messages, setMessages] = useState<Message[]>([] as Message[]);
    const [input, setInput] = useState('');
    const [chatbotIsTyping, setChatbotIsTyping] = useState(false);
    const [analysing, setAnalysing] = useState(false);
    const userId = useAuthStore().user?.id;

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
                upsertChatInfo({ id: chatId, title: message?.text.slice(0, 50) }, userId ?? '').then();
            }
        };
    }, [messages, chatId, userId])

    const handleSendVoiceMessage = async (audio: { uri: string; name: string; type: string }) => {
        setAnalysing(true);
        const userTranscriptionResult = await transcription({ url: audio.uri });
        setAnalysing(false);

        if (!userTranscriptionResult.isSuccess || userTranscriptionResult.data === undefined) {
            showModal({ children: <ActConfirm title={Messages.error} message={Messages.tutorFailedToHearYouPleaseTryLater} onAct={closeModal} />})
            return;
        }

        await handleSendTextMessage(userTranscriptionResult.data);
    };

    const handleSendTextMessage = async (userTranscription?: string) => {
        const userInput = userTranscription ?? input.trim();
        const chats: Chat[] = [];
        if (!userInput) {
            setMessages(prev => {
                let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: Messages.looksLikeWeDidntCatchYourVoiceOrAnyTextWantToTryAgain, reply: true, error: true }]
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
                chats.push({ role: 'user', content: userInput });
                const tutorReplyResult = await chat({ input: chats });
                if (!tutorReplyResult.isSuccess || tutorReplyResult.data === undefined) {
                    setChatbotIsTyping(false);
                    showModal({ children: <ActConfirm title={Messages.error} message={Messages.tutorfailedToReplyYouPleaseTryLater} onAct={closeModal} /> })
                    return;
                }
                
                const saveResult = saveAudio(tutorReplyResult.data.voiceResponse);
                
                setMessages(prev => {
                    let latestMessages = 
                        [...prev, 
                            { 
                                id: Date.now().toString() + '-reply', 
                                text: tutorReplyResult.data?.textResponse ?? '', 
                                reply: true, 
                                audioUrl: saveResult.isSuccess ? tutorReplyResult.data?.voiceResponse.fileName : undefined,  
                            }
                        ];
                    const save = async () => await saveChatHistory(chatId, latestMessages);
                    save();
                    return latestMessages;
                });
            } catch {
                setMessages(prev => {
                    let latestMessages = [...prev, { id: Date.now().toString() + '-reply', text: Messages.tutorfailedToReplyYouPleaseTryLater, reply: true, error: true }]
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
