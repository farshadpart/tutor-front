import { useLocalSearchParams, Stack } from "expo-router"
import ChatScreen from "../../components/chatBox/ChatScreen"
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MenuItemContainer() {
    const { id } = useLocalSearchParams();

    if (typeof (id) !== 'string')
        return Error('The type of id is not valid!');

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <Stack.Screen options={{ title: 'Conversation' }} />
            <ChatScreen chatId={id} />
        </SafeAreaView>
    )
}