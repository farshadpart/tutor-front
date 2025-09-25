import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from "../components/chatDrawerItem/CustomDrawerContent"

export default function Layout() {
    return (
        <Drawer drawerContent={CustomDrawerContent} screenOptions={{ drawerActiveTintColor: 'red', drawerHideStatusBarOnOpen: true }}>
            <Drawer.Screen name="index" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="[id]" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
    );
}