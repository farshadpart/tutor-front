import { TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ThemedTouchableOpacityProps } from '@/src/components/themedTouchableOpacity/types/ThemedTouchableOpacityProps';

export function ThemedTouchableOpacity({ style, ...rest }: ThemedTouchableOpacityProps) {
    const { theme } = useTheme();

    const defaultStyle: ViewStyle = {
        backgroundColor: theme.colors.background,
    };

    return (
        <TouchableOpacity
            {...rest}
            style={[defaultStyle, style]}
        />
    );
}