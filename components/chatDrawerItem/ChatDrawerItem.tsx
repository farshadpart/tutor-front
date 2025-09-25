
import { View, Text, Pressable, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

interface Props {
    id: string;
    title: string;
    isActive: boolean;
    onPress: () => void;
    onRename: () => void;
    onDelete: () => void;
}

export default function ChatDrawerItem({
    id,
    title,
    isActive,
    onPress,
    onRename,
    onDelete,
}: Props) {
    return (
        <View style={[styles.row, isActive && styles.activeRow]}>
            <Pressable style={styles.flexRow} onPress={onPress}>
                <Text style={styles.label}>{title}</Text>
            </Pressable>
            <View style={styles.actions}>
                <Pressable onPress={onRename}>
                    <Entypo name="edit" size={18} color="gray" />
                </Pressable>
                <Pressable onPress={onDelete}>
                    <Entypo name="trash" size={18} color="gray" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    activeRow: {
        backgroundColor: "#fee", // highlight active
    },
    flexRow: {
        flex: 1,
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
    },
    actions: {
        flexDirection: "row",
        gap: 12,
    },
});
