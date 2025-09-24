import Entypo from '@expo/vector-icons/Entypo';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from "expo-router";
import { useState, useEffect } from 'react';
import { ChatInfo, getChatList } from '../services/messageService';

export default function Layout() {
    return (
        <Drawer drawerContent={CustomDrawerContent} screenOptions={{ drawerActiveTintColor: 'red', drawerHideStatusBarOnOpen: true }}>
            <Drawer.Screen name="index" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="[id]" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
    );
}

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const [chatList, setChatList] = useState<ChatInfo[]>([]);
    const router = useRouter();
    const activeRoute = props.state.routes[props.state.index];
    const activeChatId =
        activeRoute.name === '[id]'
            ? (activeRoute.params as { id: string } | undefined)?.id
            : undefined;

    useEffect(() => {
        const fetchChatList = async () => {
            setChatList(await getChatList());
        };
        fetchChatList().then();
    }, [activeChatId]);

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
                label="New Chat"
                activeTintColor="red"
                focused={activeRoute.name === 'index'}
                onPress={() =>
                    router.push({
                        pathname: '/',
                        params: { new: Date.now().toString() }
                    })
                }
                icon={({ color, size }) => (
                    <Entypo name="chat" size={24} color={color} />
                )}
            />

            {chatList.slice().reverse().map(item => {
                return <DrawerItem key={item.id} focused={activeChatId === item.id} activeTintColor="red" label={item.title} onPress={() => router.push(`/${item.id}`)} />
            })}
        </DrawerContentScrollView>
    )
}