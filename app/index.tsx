import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import ChatScreen from '../components/chatBox/ChatScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { randomUUID } from 'expo-crypto';
import { Stack } from "expo-router"
import { useChatListProvider } from "../components/chatDrawerItem/ChatListContext"
import { getChatList } from "../services/messageService"

export default function Index() {
    const navigation = useNavigation();
    const { setChatList } = useChatListProvider();

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            const newId = randomUUID();
            setUuid(newId);
        });

        const unsubscribeBlur = navigation.addListener('blur', () => {
            const fetchChatList = async () => {
                setChatList(await getChatList());
            };
            fetchChatList().then();
        });

        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation, setChatList]);
    const [uuid, setUuid] = useState("");

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <Stack.Screen options={{ title: 'New Chat' }} />
            <ChatScreen chatId={uuid} />
        </SafeAreaView>
    )
}