import { ChatInfo } from "@/src/types/chat/chatInfo";
import { Message } from "@/src/types/chat/message";
import * as SecureStore from "expo-secure-store";

export const getChatHistory = async (chatId: string): Promise<Message[]> => {
    const chatHistoryStr = await SecureStore.getItemAsync(`${chatId}.json`);
    if (chatHistoryStr === null) {
        return [];
    }

    return JSON.parse(chatHistoryStr) as Message[];
}

export const saveChatHistory = async (chatId: string, conversation: Message[]) => {
    await SecureStore.setItemAsync(`${chatId}.json`, JSON.stringify(conversation));
}

export const getChatList = async (userId: string) => {
    const chatListStr = await SecureStore.getItemAsync(`${userId}-chatList.json`);
    if (chatListStr === null) {
        return [];
    }

    return JSON.parse(chatListStr) as ChatInfo[];
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
    await deleteChatHistory(id);
}

const updateChatInfoList = (chatInfoList: ChatInfo[], userId: string) => {
    SecureStore.setItem(`${userId}-chatList.json`, JSON.stringify(chatInfoList));
}

const deleteChatHistory = async (chatId: string) => {
    await SecureStore.deleteItemAsync(`${chatId}.json`);
}

