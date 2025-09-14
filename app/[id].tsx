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
            <ChatScreen chatId={id} />
        </Fragment>
    )
}