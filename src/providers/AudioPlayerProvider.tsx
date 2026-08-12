import React, { createContext, useContext } from "react";
import {useAudioPlayer} from "expo-audio";
import {getAudioFileUri} from "@/src/services/fileService";

type AudioPlayerContextValue = {
    play: (audioUrl: string) => void;
    stop: () => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode; }) {
    const audioPlayer = useAudioPlayer();
    
    const play = (audioUrl: string) => {
        audioPlayer.replace(getAudioFileUri(audioUrl));
        audioPlayer.play();
    }
    
    const stop = async () => {
        audioPlayer.pause();
        await audioPlayer.seekTo(0);
    }
    

    return (
        <AudioPlayerContext.Provider value={{ play, stop }}>
            {children}
        </AudioPlayerContext.Provider>
    );
}

export function useChatListProvider() {
    const context = useContext(AudioPlayerContext);
    return context as AudioPlayerContextValue;
}
