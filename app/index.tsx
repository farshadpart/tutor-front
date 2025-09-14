import React from 'react';
import ChatScreen from '../components/chatBox/ChatScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <ChatScreen chatId='NewChat' />
        </SafeAreaView>
    )
}