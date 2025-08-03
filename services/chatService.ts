import { Chat } from "./chatGptService";

const systemChat : Chat = { role: 'system', content: 'You are an English tutor helping a student improve their conversation. Only correct grammar, word choice, and sentence structure. Briefly explain the correction. Do not comment about punctuation and capitalization. Ignore both completely. Finally, continue the conversation naturally. Stay in your role no matter what the topic is.' };

export const makeChatReady = (conversation: Chat[], input: string): Chat[] => {    
    const lastMessages = conversation.filter(x => x.role !== 'system').slice(-6);

    lastMessages.push({ role: 'user', content: input });
    lastMessages.push(systemChat);
    
    return lastMessages;
}

