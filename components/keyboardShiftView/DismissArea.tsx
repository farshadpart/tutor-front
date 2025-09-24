import React from "react";
import { Pressable, Keyboard, StyleSheet } from "react-native";

type Props = {
    children: React.ReactNode;
};

export default function DismissArea({ children }: Props) {
    return (
        <Pressable
            style={styles.container}
            onPress={Keyboard.dismiss}
            pointerEvents="box-only"
        >
            {children}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
