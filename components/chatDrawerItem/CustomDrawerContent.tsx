import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ChatInfo, getChatList, deleteChat, upsertChatInfo } from "../../services/messageService";
import ChatDrawerItem from "./ChatDrawerItem";
import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, StyleSheet, Text } from "react-native";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const [chatList, setChatList] = useState<ChatInfo[]>([]);
    const router = useRouter();
    const activeRoute = props.state.routes[props.state.index];
    const activeChatId =
        activeRoute.name === "[id]"
            ? (activeRoute.params as { id: string } | undefined)?.id
            : undefined;

    useEffect(() => {
        const fetchChatList = async () => {
            setChatList(await getChatList());
        };
        fetchChatList().then();
    }, [activeChatId]);

    const handleDelete = (id: string) => {
        deleteChat(id);
        setChatList((prev) => prev.filter((c) => c.id !== id));
    };

    const handleRename = async (id: string, newTitle: string) => {
        await upsertChatInfo({ id, title: newTitle });
        setChatList(prev =>
            prev.map(chat => (chat.id === id ? { ...chat, title: newTitle } : chat))
        );
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />

            <Pressable
                style={[styles.row, activeRoute.name === "index" && styles.activeRow]}
                onPress={() =>
                    router.push({
                        pathname: "/",
                        params: { new: Date.now().toString() },
                    })
                }
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
                        onDelete={() => handleDelete(item.id)}
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
});

export default CustomDrawerContent;
