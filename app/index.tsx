import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import ChatScreen from '../components/chatBox/ChatScreen';

export default function Index() {
    return (
        <SafeAreaView style={{flex: 1}}>
            <ChatScreen chatId='NewChat'/>
        </SafeAreaView>
    );
}