import { useLocalSearchParams, Stack } from "expo-router"
import ChatScreen from "../../components/chatBox/ChatScreen"
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "@/src/providers/ThemeProvider";

export default function MenuItemContainer() {
    const { theme } = useTheme();
    const { id } = useLocalSearchParams();

    if (typeof (id) !== 'string')
        return Error('The type of id is not valid!');

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Stack.Screen options={{ title: 'Conversation' }} />
            <ChatScreen chatId={id} />
        </SafeAreaView>
    )
}