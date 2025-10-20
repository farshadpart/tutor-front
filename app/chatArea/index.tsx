import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ChatScreen from '../../components/chatBox/ChatScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { randomUUID } from 'expo-crypto';
import { Stack, useLocalSearchParams } from "expo-router"
import { useChatListProvider } from "../../components/chatDrawerItem/ChatListContext"
import { getChatList } from "../../services/messageService"

export default function Index() {
    const { setChatList } = useChatListProvider();
    const navigation = useNavigation();
    const params = useLocalSearchParams();

    useEffect(() => {
        if (params["newChat"] !== undefined) {
            navigation.replaceParams(undefined);
            
            const fetchChatList = async () => {
                setChatList(await getChatList());
            };
            fetchChatList().then();

            const newId = randomUUID();
            setUuid(newId);
        }
    }, [params, navigation, setChatList])

    useFocusEffect(
        useCallback(() => {
            const newId = randomUUID();
            setUuid(newId);

            return () => {
                const fetchChatList = async () => {
                    setChatList(await getChatList());
                };
                fetchChatList();
            };
        }, [setChatList])
    );

    const [uuid, setUuid] = useState("");

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <Stack.Screen options={{ title: 'New Chat' }} />
            <ChatScreen chatId={uuid} />
        </SafeAreaView>
    )
}