import { Text, TextStyle } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ThemedTextProps } from '@/src/components/themedText/types/ThemedTextProps';

export function ThemedText({ style, ...rest }: ThemedTextProps) {
    const { theme } = useTheme();

    const defaultStyle: TextStyle = {
        color: theme.colors.text,
    };

    return (
        <Text
            {...rest}
            style={[defaultStyle, style]}
        />
    );
}