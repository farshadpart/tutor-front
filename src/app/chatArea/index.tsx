import { useTheme } from "@/src/providers/ThemeProvider";
import { getChatList } from "@/src/services/messageService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { randomUUID } from 'expo-crypto';
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatScreen from '../../components/chatBox/ChatScreen';
import { useChatListProvider } from "@/src/components/chatDrawerItem/ChatListContext";

export default function Index() {
    const { theme } = useTheme();
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
        <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Stack.Screen options={{ title: 'New Chat' }} />
            <ChatScreen chatId={uuid} />
        </SafeAreaView>
    )
}