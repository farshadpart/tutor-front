import { ChatListProvider } from '../../components/chatDrawerItem/ChatListContext';
import { DrawerTutor } from '../../components/chatDrawerItem/DrawerTutor';
import {AudioPlayerProvider} from "@/src/providers/AudioPlayerProvider";


export default function Layout() {
    return (
        <AudioPlayerProvider>
            <ChatListProvider>
                <DrawerTutor/>
            </ChatListProvider>
        </AudioPlayerProvider>
    );
}