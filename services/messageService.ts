import * as FileSystem from 'expo-file-system';

export interface Message {
    id: string;
    text: string;
    reply: boolean,
    error?: boolean
}

export const getChatHistory = async (): Promise<Message[]> => {
    const fileInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}conversationHistory.json`);
    if (!fileInfo.exists) {
        return [];
    }

    let chatHistory = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}conversationHistory.json`);
    return JSON.parse(chatHistory) as Message[];
}

export const saveChatHistory = async (conversation: Message[]) => {
    const chatAsString = JSON.stringify(conversation);
    await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}conversationHistory.json`, chatAsString);
}