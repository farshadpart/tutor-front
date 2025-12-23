import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Theme } from '@/src/types/theme/theme';
import { dark, light } from '@/src/constants/colors';

type ThemeContextValue = {
    theme: Theme;
    scheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useColorScheme();

    const scheme: 'light' | 'dark' =
        systemScheme === 'dark' ? 'dark' : 'light';

    const theme = useMemo(
        () => (scheme === 'dark' ? dark : light),
        [scheme]
    );

    return (
        <ThemeContext.Provider value={{ theme, scheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }
    return ctx;
}