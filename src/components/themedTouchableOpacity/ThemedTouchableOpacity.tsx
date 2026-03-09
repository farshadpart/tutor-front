import { ThemedTouchableOpacityProps } from '@/src/components/themedTouchableOpacity/types/ThemedTouchableOpacityProps';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useState } from 'react';
import { ActivityIndicator, GestureResponderEvent, TouchableOpacity, ViewStyle } from 'react-native';

export function ThemedTouchableOpacity({
    children,
    onPress,
    style,
    activeOpacity = 0.7,
    ...rest
}: ThemedTouchableOpacityProps) {
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

    const defaultStyle: ViewStyle = {
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
    };

    const handlePress = async (e: GestureResponderEvent) => {
        setLoading(true);
        if (!onPress) {
            setLoading(false);
            return;
        }

        await onPress(e);
        setLoading(false);
    }

    return (
        <TouchableOpacity
            {...rest}
            disabled={loading}
            activeOpacity={activeOpacity}
            style={[defaultStyle, style]}
            onPress={handlePress}>
            {loading ? <ActivityIndicator color={theme.colors.text} /> : children }
        </TouchableOpacity>
    );
}
