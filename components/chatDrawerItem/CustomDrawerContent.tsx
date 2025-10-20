import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { ChatInfo, deleteChat, upsertChatInfo } from "../../services/messageService";
import ChatDrawerItem from "./ChatDrawerItem";
import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { useChatListProvider } from "./ChatListContext"
import { useAuthStore } from "../../hooks/useAuthStore";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const authStore = useAuthStore();
    const { chatList, setChatList } = useChatListProvider();
    const router = useRouter();
    const activeRoute = props.state.routes[props.state.index];
    const activeChatId =
        activeRoute.name === "[id]"
            ? (activeRoute.params as { id: string } | undefined)?.id
            : undefined;

    const handleDelete = (item: ChatInfo) => {
        Alert.alert(
            "Delete Chat",
            `Are you sure you want to delete ${item.title} chat?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteThisChat(item.id) }
            ]
        );
    };

    const deleteThisChat = (id: string) => {
        deleteChat(id);
        setChatList(chatList.filter((c) => c.id !== id));
        if (activeChatId === id) {
            requestAnimationFrame(() => {
                router.push("/");
            });
        }
    }

    const handleRename = async (id: string, newTitle: string) => {
        await upsertChatInfo({ id, title: newTitle });
        setChatList(chatList.map(chat => (chat.id === id ? { ...chat, title: newTitle } : chat)));
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <TouchableOpacity style={styles.button} onPress={() => authStore.logOut(authStore.user!.email)}><Text style={styles.buttonText}>Logout</Text></TouchableOpacity>
            <Pressable
                style={[styles.row, activeRoute.name === "index" && styles.activeRow]}
                onPress={() => router.push({ pathname: '/', params: { newChat: "newChat" } })}
            >
                <Entypo name="chat" size={20} color="red" />
                <Text style={styles.label}>New Chat</Text>
            </Pressable>

            {chatList
                .slice()
                .reverse()
                .map((item) => (
                    <ChatDrawerItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        isActive={activeChatId === item.id}
                        onPress={() => router.push(`/${item.id}`)}
                        onRename={handleRename}
                        onDelete={() => handleDelete(item)}
                    />
                ))}
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    activeRow: {
        backgroundColor: "#fee",
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    }
});

export default CustomDrawerContent;
