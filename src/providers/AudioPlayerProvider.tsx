import React, {createContext, useContext, useRef, useState} from "react";
import {useAudioPlayer} from "expo-audio";
import {getAudioFileUri} from "@/src/services/fileService";

type AudioPlayerContextValue = {
    handlePlayTap: (audioUrl: string | undefined) => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode; }) {
    const audioPlayer = useAudioPlayer();
    const [isPlaying, setIsPlaying] = useState(false);
    const currentAudioUrl = useRef<string | undefined>(undefined);

    const handlePlayTap = async (audioUrl: string | undefined) : Promise<void> => {
        if(!audioUrl)
            return;

        if(isPlaying && currentAudioUrl.current === audioUrl) {
            await stop();
            return;
        }

        if(isPlaying)
            await stop();

        play(audioUrl);
        currentAudioUrl.current = audioUrl;
    }

    const play = (audioUrl: string | undefined) => {
        if(!audioUrl) {
            return;
        }

        setIsPlaying(true);
        audioPlayer.replace(getAudioFileUri(audioUrl));
        audioPlayer.play();
    }

    const stop = async () => {
        audioPlayer.pause();
        await audioPlayer.seekTo(0);
        setIsPlaying(false);
    }
    

    return (
        <AudioPlayerContext.Provider value={{ handlePlayTap }}>
            {children}
        </AudioPlayerContext.Provider>
    );
}

export function useAudioPlayerProvider() {
    const context = useContext(AudioPlayerContext);
    return context as AudioPlayerContextValue;
}
