import { useChatListProvider } from "@/src/components/chatDrawerItem/ChatListContext";
import { useAuthStore } from '@/src/hooks/useAuthStore';
import { useTheme } from "@/src/providers/ThemeProvider";
import { getChatList } from "@/src/services/messageService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { randomUUID } from 'expo-crypto';
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatScreen from '../../components/chatBox/ChatScreen';

export default function Index() {
    const { theme } = useTheme();
    const { setChatList } = useChatListProvider();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const userId = useAuthStore().user?.id;

    useEffect(() => {
        if (params["newChat"] !== undefined) {
            navigation.replaceParams(undefined);
            
            const fetchChatList = async () => {
                setChatList(await getChatList(userId ?? ''));
            };
            fetchChatList().then();

            const newId = randomUUID();
            setUuid(newId);
        }
    }, [params, navigation, setChatList, userId])

    useFocusEffect(
        useCallback(() => {
            const newId = randomUUID();
            setUuid(newId);

            return () => {
                const fetchChatList = async () => {
                    setChatList(await getChatList(userId ?? ''));
                };
                fetchChatList();
            };
        }, [setChatList, userId])
    );

    const [uuid, setUuid] = useState("");

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Stack.Screen options={{ title: 'New Chat' }} />
            <ChatScreen chatId={uuid} />
        </SafeAreaView>
    )
}