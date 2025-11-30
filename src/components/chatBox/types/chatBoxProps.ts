import { Message } from "@/src/types/chat/message"

export interface ChatBoxProps {
    messages: Message[];
    analysing: boolean;
    chatbotIsTyping: boolean;
    onRecordingComplete: (audio: { uri: string; name: string; type: string }) => void;
    onSendTextMessage: (userTranscription?: string) => void;
}