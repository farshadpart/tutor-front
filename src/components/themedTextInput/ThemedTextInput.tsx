import { TextInput, TextStyle } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ThemedTextInputProps } from '@/src/components/themedTextInput/types/ThemedTextInputProps';

export function ThemedTextInput({ style, ...rest }: ThemedTextInputProps) {
    const { theme, scheme } = useTheme();
   
    const defaultStyle: TextStyle = {
        backgroundColor: theme.colors.inputBackground,
        color: theme.colors.text,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    };

    return (
        <TextInput
            {...rest}
            style={[defaultStyle, style]}
            placeholderTextColor={theme.colors.placeholder}
            selectionColor={theme.colors.primary}
            keyboardAppearance={scheme ? 'dark' : 'light'}
        />
    );
}
