import React, { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import { FlatList, ViewStyle } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ThemedFlatListProps } from '@/src/components/themedFlatList/types/ThemedFlatListProps';

export const ThemedFlatList: ForwardRefExoticComponent<
    ThemedFlatListProps<any> & RefAttributes<FlatList<any>>
> = forwardRef(<ItemT = any>(
    { style, ...rest }: ThemedFlatListProps<ItemT>,
    ref: React.Ref<FlatList<ItemT>>
) => {
    const { theme } = useTheme();

    const defaultStyle: ViewStyle = {
        backgroundColor: theme.colors.background,
    };

    return <FlatList {...rest} ref={ref} style={[defaultStyle, style]} />;
});

ThemedFlatList.displayName = "ThemedFlatList";