import { File, Paths } from 'expo-file-system';

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
    const file = new File(Paths.document, `${chatId}.json`);
    const fileInfo = file.info();
    if (!fileInfo.exists) {
        return [];
    }

    return JSON.parse(await file.text()) as Message[];
}

export const saveChatHistory = async (chatId: string, conversation: Message[]) => {
    const chatAsString = JSON.stringify(conversation);
    const file = new File(Paths.document, `${chatId}.json`);
    const fileInfo = file.info();

    if (!fileInfo.exists) {
        file.create();
    }

    file.write(chatAsString);
}

export const getChatList = async () => {
    const file = new File(Paths.document, 'chatList.json');
    const fileInfo = file.info();
    if (!fileInfo.exists) {
        return [];
    }

    return JSON.parse(await file.text()) as ChatInfo[];
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
    
    const file = new File(Paths.document, 'chatList.json');
    const fileInfo = file.info();

    if (!fileInfo.exists) {
        file.create()
    }

    file.write(JSON.stringify(chatList));
}

