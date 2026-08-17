import React, {createContext, useContext, useEffect, useState} from "react";
import {getUserSettings, update as updateUserSettings} from "@/src/services/userSettingsService"

type UserSettingsContextValue = {
    autoPlayVoice: boolean;
    isSaving: boolean;
    updateAutoPlayVoice: (autoPlayVoice: boolean) => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextValue | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: React.ReactNode; }) {
    const [autoPlayVoice, setAutoPlayVoice] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadUserSettings = async () => {
            const result = await getUserSettings();

            if (isMounted && result.isSuccess && result.data !== undefined) {
                setAutoPlayVoice(result.data.autoPlayVoice);
            }
        };

        void loadUserSettings();

        return () => {
            isMounted = false;
        };
    }, []);

    const updateAutoPlayVoice = async (value: boolean) => {
        const previousValue = autoPlayVoice;

        setAutoPlayVoice(value);
        setIsSaving(true);

        try {
            const result = await updateUserSettings({ autoPlayVoice: value });

            if (!result.isSuccess) {
                setAutoPlayVoice(previousValue);
            }
        } catch {
            setAutoPlayVoice(previousValue);
        } finally {
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
