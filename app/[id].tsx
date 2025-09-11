import { View, SafeAreaView } from "react-native"
import { useLocalSearchParams, Stack } from "expo-router"
import ChatScreen from "../components/chatBox/ChatScreen"

export default function MenuItemContainer() {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Stack.Screen options={{ title: `Page:${id}` }} />
            <SafeAreaView style={{ flex: 1 }}>
                <ChatScreen />
            </SafeAreaView>
        </View>
    )
}