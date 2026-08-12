import React, {createContext, useContext, useState} from "react";
import {useAudioPlayer} from "expo-audio";
import {getAudioFileUri} from "@/src/services/fileService";

type AudioPlayerContextValue = {
    play: (audioUrl: string | undefined) => void;
    stop: () => Promise<void>;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode; }) {
    const audioPlayer = useAudioPlayer();
    const [isPlaying, setIsPlaying] = useState(false);
    
    const play = (audioUrl: string | undefined) => {
        if(!audioUrl) {
            return;
        }
        
        audioPlayer.replace(getAudioFileUri(audioUrl));
        audioPlayer.play();
    }
    
    const stop = async () => {
        audioPlayer.pause();
        await audioPlayer.seekTo(0);
    }
    

    return (
        <AudioPlayerContext.Provider value={{ play, stop, isPlaying, setIsPlaying }}>
            {children}
        </AudioPlayerContext.Provider>
    );
}

export function useAudioPlayerProvider() {
    const context = useContext(AudioPlayerContext);
    return context as AudioPlayerContextValue;
}
