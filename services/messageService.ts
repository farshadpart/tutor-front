import * as FileSystem from 'expo-file-system';

export interface Message {
    id: string;
    text: string;
    reply: boolean,
    error?: boolean
}

export interface ChatInfo {
    id: string,
    title: string
}

export const getChatHistory = async (chatId: string): Promise<Message[]> => {
    const fileInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}${chatId}.json`);
    if (!fileInfo.exists) {
        return [];
    }

    let chatHistory = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${chatId}.json`);
    return JSON.parse(chatHistory) as Message[];
}

export const saveChatHistory = async (chatId: string, conversation: Message[]) => {
    const chatAsString = JSON.stringify(conversation);
    await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}${chatId}.json`, chatAsString);
}

export const getChatList = async () => {
    const fileInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}chatList.json`);
    if (!fileInfo.exists) {
        return [];
    }

    let chatHistory = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}chatList.json`);
    return JSON.parse(chatHistory) as ChatInfo[];
}

export const upsertChatInfo = async (chatInfo: ChatInfo) => {
    const chatList = await getChatList();
    const indexSavedChatInfo = chatList.findIndex(x => x.id === chatInfo.id);
    if (indexSavedChatInfo !== -1) {
        chatList[indexSavedChatInfo] = chatInfo;
    }
    else {
        chatList.push(chatInfo);
    }
    
    await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}chatList.json`, JSON.stringify(chatList));
}

