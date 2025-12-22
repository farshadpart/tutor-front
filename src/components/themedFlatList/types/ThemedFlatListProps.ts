import { FlatListProps, StyleProp, ViewStyle } from 'react-native';

export type ThemedFlatListProps<ItemT = any> = FlatListProps<ItemT> & {
    style?: StyleProp<ViewStyle>;
};