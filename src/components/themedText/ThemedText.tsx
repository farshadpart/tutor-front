import { Text, TextStyle } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ThemedTextProps } from '@/src/components/themedText/types/ThemedTextProps';

export function ThemedText({ style, ...rest }: ThemedTextProps) {
    const { theme } = useTheme();

    const defaultStyle: TextStyle = {
        color: theme.colors.text,
    };

    console.log('Background color applied to ThemedText:', defaultStyle.backgroundColor);

    return (
        <Text
            {...rest}
            style={[defaultStyle, style]}
        />
    );
}