import { ChatInfo } from "@/src/types/chat/chatInfo";
import { Message } from "@/src/types/chat/message";
import { File, Paths } from 'expo-file-system';

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

export const getChatList = async (userId: string) => {
    const file = new File(Paths.document, `${userId}-chatList.json`);
    const fileInfo = file.info();
    if (!fileInfo.exists) {
        return [];
    }

    return JSON.parse(await file.text()) as ChatInfo[];
}

export const upsertChatInfo = async (chatInfo: ChatInfo, userId: string) => {
    const chatList = await getChatList(userId);
    const indexSavedChatInfo = chatList.findIndex(x => x.id === chatInfo.id);
    if (indexSavedChatInfo !== -1) {
        chatList[indexSavedChatInfo] = chatInfo;
    }
    else {
        chatList.push(chatInfo);
    }

    updateChatInfoList(chatList, userId);
}

export const deleteChat = async (id: string, userId: string) => {
    let chatList = await getChatList(userId);
    chatList = chatList.filter(chatInfo => chatInfo.id !== id)
    updateChatInfoList(chatList, userId);
    deleteChatHistory(id);
}

const updateChatInfoList = (chatInfoList: ChatInfo[], userId: string) => {
    const file = new File(Paths.document, `${userId}-chatList.json`);
    const fileInfo = file.info();

    if (!fileInfo.exists) {
        file.create()
    }

    file.write(JSON.stringify(chatInfoList));
}

const deleteChatHistory = (chatId: string) => {
    const file = new File(Paths.document, `${chatId}.json`);
    const fileInfo = file.info();

    if (fileInfo.exists) {
        file.delete();
    }
}

