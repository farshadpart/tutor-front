import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import Entypo from '@expo/vector-icons/Entypo';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from "expo-router";
import { useState, useEffect } from 'react';
import { getChatList } from '../services/messageService';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer drawerContent={CustomDrawerContent} screenOptions={{ drawerActiveTintColor: 'red', drawerHideStatusBarOnOpen: true }}>
                <Drawer.Screen name="index" options={{ title: 'New Chat', drawerIcon: ({ color, size }) => <Entypo name="chat" size={24} color="black" /> }} />
                <Drawer.Screen name="[id]" options={{ drawerItemStyle: {display:'none'}}} />
            </Drawer>
        </GestureHandlerRootView>
    );
}

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const [chatList, setChatList] = useState<string[]>([]);
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
            {chatList.map(item => (
                <DrawerItem key={item} label={item} onPress={() => router.push(`/${item}`)} />
            ))}
        </DrawerContentScrollView>
    )
}