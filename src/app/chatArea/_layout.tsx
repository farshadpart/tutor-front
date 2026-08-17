import { ChatListProvider } from '../../components/chatDrawerItem/ChatListContext';
import { DrawerTutor } from '../../components/chatDrawerItem/DrawerTutor';
import {AudioPlayerProvider} from "@/src/providers/AudioPlayerProvider";
import {UserSettingsProvider} from "@/src/providers/UserSettingsProvider"


export default function Layout() {
    return (
        <UserSettingsProvider>
            <AudioPlayerProvider>
                <ChatListProvider>
                    <DrawerTutor/>
                </ChatListProvider>
            </AudioPlayerProvider>
        </UserSettingsProvider>
    );
}
