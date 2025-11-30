import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from "./CustomDrawerContent"
import { useChatListProvider } from './ChatListContext';
import { getChatList } from "@/src/services/messageService";
import { useEffect } from "react"

export const DrawerTutor = () => {
    const { setChatList } = useChatListProvider();

    useEffect(() => {
        const fetchChatList = async () => {
            setChatList(await getChatList());
        };
        fetchChatList().then();
    }, [setChatList]);

    return (
        <Drawer drawerContent={CustomDrawerContent} screenOptions={{ drawerActiveTintColor: 'red', drawerHideStatusBarOnOpen: true, keyboardDismissMode: "none" }} >
            <Drawer.Screen name="index" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="[id]" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
    )
}