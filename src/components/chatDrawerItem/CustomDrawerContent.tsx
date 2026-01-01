import { ActConfirm } from '@/src/components/modalTemplates/confirm/ActConfirm';
import { useModal } from '@/src/components/themedModal/ThemedModalContext';
import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { UserSummary } from '@/src/components/userSummary/UserSummary';
import { useTheme } from '@/src/providers/ThemeProvider';
import { deleteChat, upsertChatInfo } from "@/src/services/messageService";
import { ChatInfo } from "@/src/types/chat/chatInfo";
import { Feather } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import ChatDrawerItem from "./ChatDrawerItem";
import { useChatListProvider } from "./ChatListContext";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { showModal, closeModal } = useModal();
    const { theme, scheme } = useTheme();
    const { chatList, setChatList } = useChatListProvider();
    const router = useRouter();
    const activeRoute = props.state.routes[props.state.index];
    const activeChatId =
        activeRoute.name === "[id]"
            ? (activeRoute.params as { id: string } | undefined)?.id
            : undefined;

    const handleDelete = (item: ChatInfo) => {
        const message = `Are you sure you want to delete the chat "${item.title}"?`;
        showModal({ children: <ActConfirm dangerousAct={true} title='Delete' message={message} submitLabel='Delete' onCancel={closeModal} onAct={() => {closeModal(); deleteThisChat(item.id)}} />})
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
        <DrawerContentScrollView
            {...props}
            style={[
                styles.drawer,
                scheme === 'dark'
                    ? styles.drawerShadowDark
                    : styles.drawerShadowLight,
            ]}
        >
            <DrawerItemList {...props} />

            <UserSummary />

            <ThemedTouchableOpacity
                style={[
                    styles.row,
                    {
                        backgroundColor:
                            activeRoute.name === 'index'
                                ? theme.colors.activeRowBackground
                                : theme.colors.background,
                    },
                ]}
                onPress={() =>
                    router.push({
                        pathname: '/',
                        params: { newChat: 'newChat' },
                    })
                }
            >
                <Feather name="message-square" size={20} color={theme.colors.text} />
                <ThemedText style={styles.label}>
                    New Chat
                </ThemedText>
            </ThemedTouchableOpacity>

            {chatList
                .slice()
                .reverse()
                .map(item => (
                    <ChatDrawerItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        isActive={activeChatId === item.id}
                        onPress={() => router.push(`/chatArea/${item.id}`)}
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
    label: {
        marginLeft: 8,
        fontSize: 16,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    },
    drawer: {
        backgroundColor: 'transparent',
    },
    drawerShadowLight: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 6,
    },

    drawerShadowDark: {
        backgroundColor: '#0E0E10',
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 0 },
        shadowOpacity: 0.75,
        shadowRadius: 16,
        elevation: 20,
    },
});

export default CustomDrawerContent;
