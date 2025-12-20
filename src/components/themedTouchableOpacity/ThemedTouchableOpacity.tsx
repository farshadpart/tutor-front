import { TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ThemedTouchableOpacityProps } from '@/src/components/themedTouchableOpacity/types/ThemedTouchableOpacityProps';

export function ThemedTouchableOpacity({
    style,
    activeOpacity = 0.7,
    ...rest
}: ThemedTouchableOpacityProps) {
    const { theme } = useTheme();

    console.log('Background', theme.colors.background);
    console.log('Surface', theme.colors.surface);

    const defaultStyle: ViewStyle = {
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
    };

    return (
        <TouchableOpacity
            {...rest}
            activeOpacity={activeOpacity}
            style={[defaultStyle, style]}
        />
    );
}
