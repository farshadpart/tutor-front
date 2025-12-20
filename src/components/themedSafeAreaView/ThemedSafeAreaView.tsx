import { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ThemedSafeAreaViewProps } from '@/src/components/themedSafeAreaView/types/ThemedSafeAreaViewProps';

export function ThemedSafeAreaView({ style, ...rest }: ThemedSafeAreaViewProps) {
    const { theme } = useTheme();

    const defaultStyle: ViewStyle = {
        backgroundColor: theme.colors.background,
    };

    console.log('Background color applied to ThemedText:', defaultStyle.backgroundColor);

    return (
        <SafeAreaView
            {...rest}
            style={[defaultStyle, style]}
        />
    );
}