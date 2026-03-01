import { useTheme } from '@/src/providers/ThemeProvider';
import { getChatList } from '@/src/services/messageService';
import { Drawer } from 'expo-router/drawer';
import { useEffect } from 'react';
import { useChatListProvider } from './ChatListContext';
import CustomDrawerContent from './CustomDrawerContent';
import { useAuthStore } from '@/src/hooks/useAuthStore';

export const DrawerTutor = () => {
    const { setChatList } = useChatListProvider();
    const { theme } = useTheme();
    const userId = useAuthStore().user?.id;

    useEffect(() => {
        const fetchChatList = async () => {
            setChatList(await getChatList(userId ?? ''));
        };
        fetchChatList();
    }, [setChatList, userId]);

    return (
        <Drawer
            drawerContent={CustomDrawerContent}
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
                drawerHideStatusBarOnOpen: true,
                keyboardDismissMode: 'none',
            }}
        >
            <Drawer.Screen name="index" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="[id]" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
    );
};
