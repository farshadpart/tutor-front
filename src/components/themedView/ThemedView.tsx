import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ThemedViewProps } from '@/src/components/themedView/types/ThemedViewProps';

export function ThemedView({ style, ...rest }: ThemedViewProps) {
    const { theme } = useTheme();

    const defaultStyle: ViewStyle = {
        backgroundColor: theme.colors.background,
    };

    return (
        <View
            {...rest}
            style={[defaultStyle, style]}
        />
    );
}