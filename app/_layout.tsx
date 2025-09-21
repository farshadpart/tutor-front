import Entypo from '@expo/vector-icons/Entypo';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from "expo-router";
import { useState, useEffect } from 'react';
import { ChatInfo, getChatList } from '../services/messageService';

export default function Layout() {
    return (
        <Drawer drawerContent={CustomDrawerContent} screenOptions={{ drawerActiveTintColor: 'red', drawerHideStatusBarOnOpen: true }}>
            <Drawer.Screen name="index" options={{ title: 'New Chat', drawerIcon: ({ color, size }) => <Entypo name="chat" size={24} color="black" /> }} />
            <Drawer.Screen name="[id]" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
    );
}

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const [chatList, setChatList] = useState<ChatInfo[]>([]);
    useEffect(() => {
        const fetchChatList = async () => {
            setChatList(await getChatList());
        };
        fetchChatList().then();
    }, []);
    const router = useRouter();
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            {chatList.map(item => {
                const activeRoute = props.state.routes[props.state.index];
                const activeChatId = activeRoute.name === "[id]" ? (activeRoute.params as { id: string } | undefined)?.id : undefined;
                const isFocused = activeChatId !== undefined && activeChatId === item.id;
                return <DrawerItem key={item.id} focused={isFocused} activeTintColor="red" label={item.title} onPress={() => router.push(`/${item.id}`)} />
            })}
        </DrawerContentScrollView>
    )
}