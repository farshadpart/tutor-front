import { ChatListProvider } from '../../components/chatDrawerItem/ChatListContext';
import { DrawerTutor } from '../../components/chatDrawerItem/DrawerTutor';


export default function Layout() {
    return (
        <ChatListProvider>
            <DrawerTutor/>
        </ChatListProvider>
    );
}