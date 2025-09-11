import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import Entypo from '@expo/vector-icons/Entypo';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import {useRouter} from "expo-router";

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
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            {menuItems.map(item => (
                <DrawerItem key={item.id} label={item.title} onPress={() => router.push(`/${item.id}`)} />
            ))}
        </DrawerContentScrollView>
    )
}

const router = useRouter();

const menuItems = [
    { id: 1, title: '1-title' }, { id: 2, title: '2-title' }, { id: 3, title: '3-title' }
]