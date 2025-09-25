import React, { useState, useCallback } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import ChatScreen from '../components/chatBox/ChatScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import {randomUUID} from 'expo-crypto';
import { Stack } from "expo-router"

export default function Index() {
    const [uuid, setUuid] = useState("");

    useFocusEffect(
        useCallback(() => {
            const newId = randomUUID();
            setUuid(newId);
        }, [])
    );

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <Stack.Screen options={{ title: 'New Chat' }} />
            <ChatScreen chatId={uuid} />
        </SafeAreaView>
    )
}