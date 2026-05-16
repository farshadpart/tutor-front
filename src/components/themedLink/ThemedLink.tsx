import { TextStyle } from 'react-native';
import { Link } from "expo-router";
import { useTheme } from '@/src/providers/ThemeProvider';
import { ThemedLinkProps } from '@/src/components/themedLink/types/ThemedLinkProps';

export function ThemedLink({ style, ...rest }: ThemedLinkProps) {
    const { theme } = useTheme();

    const defaultStyle: TextStyle = {
        color: theme.colors.text,
    };

    return (
        <Link
            {...rest}
            style={[defaultStyle, style]}
        />
    );
}