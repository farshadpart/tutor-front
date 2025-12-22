import { Theme } from '@/src/types/theme/theme';

export const light: Theme = {
    colors: {
        background: '#ffffff',
        surface: '#f9fafb',
        card: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        placeholder: '#6b7280',
        primary: '#3b82f6',
        border: '#e5e7eb',
        inputBackground: '#ffffff',
        primaryText: '#ffffff',
        messageBackground: '#EEEEEE',
        replyMessageBackground: '#DCF8C6',
        errorMessageBackground: '#FFCCCC',
    },
};

export const dark: Theme = {
    colors: {
        background: '#000000',
        surface: '#09090b',
        card: '#18181b',
        text: '#f9fafb',
        textSecondary: '#9ca3af',
        placeholder: '#9ca3af',
        primary: '#60a5fa',
        border: '#27272a',
        inputBackground: '#09090b',
        primaryText: '#000000',
        messageBackground: '#1E1E1E',
        replyMessageBackground: '#3F3F46',
        errorMessageBackground: '#8B0000', 
    },
};