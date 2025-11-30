import React, { createContext, useState, useContext } from "react";
import { ChatInfo } from "@/src/types/chat/chatInfo"

type ChatListContextType = {
    chatList: ChatInfo[];
    setChatList: (chatList: ChatInfo[]) => void;
};

const ChatListContext = createContext<ChatListContextType | undefined>(undefined);

export function ChatListProvider({ children }: { children: React.ReactNode; }) {
    const [chatList, setChatList] = useState<ChatInfo[]>([]);

    return (
        <ChatListContext.Provider value={{ chatList, setChatList }}>
            {children}
        </ChatListContext.Provider>
    );
};

export function useChatListProvider() {
    const context = useContext(ChatListContext);
    return context as ChatListContextType;
}