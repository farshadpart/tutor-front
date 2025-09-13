import { SafeAreaView } from "react-native"
import { useLocalSearchParams, Stack } from "expo-router"
import ChatScreen from "../components/chatBox/ChatScreen"
import { Fragment } from "react";

export default function MenuItemContainer() {
    const { id } = useLocalSearchParams();

    if (typeof (id) !== 'string')
        return Error('The type of id is not valid!');

    return (
        <Fragment>
            <Stack.Screen options={{ title: 'Conversation' }} />
            <SafeAreaView style={{ flex: 1 }}>
                <ChatScreen chatId={id} />
            </SafeAreaView>
        </Fragment>
    )
}