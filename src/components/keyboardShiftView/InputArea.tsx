import { ReactNode } from "react";
import { ViewStyle } from "react-native";

type Props = {
    children: ReactNode;
    style?: ViewStyle;
};

export default function InputArea({ children }: Props) {
    return children;
}