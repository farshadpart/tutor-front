import React, {createContext, useContext, useEffect, useState} from "react";
import {getUserSettings, update as updateUserSettings} from "@/src/services/userSettingsService"
import {useAuthStore} from "@/src/hooks/useAuthStore";

type UserSettingsContextValue = {
    autoPlayVoice: boolean;
    isSaving: boolean;
    updateAutoPlayVoice: (autoPlayVoice: boolean) => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextValue | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: React.ReactNode; }) {
    const user = useAuthStore(state => state.user);
    const [autoPlayVoice, setAutoPlayVoice] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user === undefined) {
            setAutoPlayVoice(true);
            setIsSaving(false);
            return;
        }

        const loadUserSettings = async () => {
            const result = await getUserSettings();

            if (result.isSuccess && result.data !== undefined) {
                setAutoPlayVoice(result.data.autoPlayVoice);
            }
        };

        void loadUserSettings();
    }, [user]);

    const updateAutoPlayVoice = async (value: boolean) => {
        try {
            setIsSaving(true);
            const result = await updateUserSettings({ autoPlayVoice: value });

            if (result.isSuccess) {
                setAutoPlayVoice(value);
            }
        } 
        catch {} 
        finally {
            setIsSaving(false);
        }
    };
    
    return (
        <UserSettingsContext.Provider value={{ autoPlayVoice, isSaving, updateAutoPlayVoice }}>
            {children}
        </UserSettingsContext.Provider>
    );
}

export function useUserSettingsProvider() {
    const context = useContext(UserSettingsContext);
    return context as UserSettingsContextValue;
}
