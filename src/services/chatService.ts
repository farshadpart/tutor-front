import { Chat } from "@/src/types/chat/chat";

export const makeChatReady = (conversation: Chat[], input: string): Chat[] => {
    const lastMessages = conversation.slice(-6);
    lastMessages.push({ role: 'user', content: input });

    return lastMessages;
}

