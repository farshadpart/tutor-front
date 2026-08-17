import React, {createContext, useCallback, useContext, useRef, useState} from "react";
import {useAudioPlayer} from "expo-audio";
import {getAudioFileUri} from "@/src/services/fileService";

type AudioPlayerContextValue = {
    handlePlayTap: (audioUrl: string | undefined) => Promise<void>;
    stopPlayback: () => Promise<void>;
    hotMessage: string|undefined;
    setHotMessage: (message: string|undefined) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode; }) {
    const audioPlayer = useAudioPlayer();
    const [isPlaying, setIsPlaying] = useState(false);
    const [hotMessage, setHotMessage] = useState<string|undefined>();
    const currentAudioUrl = useRef<string | undefined>(undefined);

    const stopPlayback = useCallback(async () => {
        audioPlayer.pause();
        await audioPlayer.seekTo(0);
        setIsPlaying(false);
        currentAudioUrl.current = undefined;
    }, [audioPlayer]);

    const handlePlayTap = async (audioUrl: string | undefined) : Promise<void> => {
        if(!audioUrl)
            return;

        if(isPlaying && currentAudioUrl.current === audioUrl) {
            await stopPlayback();
            return;
        }

        if(isPlaying)
            await stopPlayback();

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

    return (
        <AudioPlayerContext.Provider value={{ handlePlayTap, stopPlayback, hotMessage, setHotMessage }}>
            {children}
        </AudioPlayerContext.Provider>
    );
}

export function useAudioPlayerProvider() {
    const context = useContext(AudioPlayerContext);
    return context as AudioPlayerContextValue;
}
