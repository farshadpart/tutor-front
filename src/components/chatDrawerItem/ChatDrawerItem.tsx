import { ChatDrawerItemProps } from "@/src/components/chatDrawerItem/types/chatDriverItemProps";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ChatDrawerItem({
    id,
    title,
    isActive,
    onPress,
    onRename,
    onDelete,
}: ChatDrawerItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(title);

    const handleSave = () => {
        setIsEditing(false);
        if (draft.trim() && draft !== title) {
            onRename(id, draft.trim());
        } else {
            setDraft(title); // reset if empty or unchanged
        }
    };

    return (
        <View style={[styles.row, isActive && styles.activeRow]}>
            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={draft}
                    onChangeText={setDraft}
                    autoFocus
                    onBlur={handleSave}
                    onSubmitEditing={handleSave}
                />
            ) : (
                <Pressable style={styles.flexRow} onPress={onPress}>
                    <Text style={styles.label}>{title}</Text>
                </Pressable>
            )}

            <View style={styles.actions}>
                {isEditing ? (
                    <Pressable style={styles.iconButton} onPress={handleSave}>
                        <Entypo name="check" size={20} color="green" />
                    </Pressable>
                ) : (
                    <Pressable
                        style={styles.iconButton}
                        onPress={() => {
                            setDraft(title); // reset draft before editing
                            setIsEditing(true);
                        }}
                    >
                        <Entypo name="edit" size={20} color="gray" />
                    </Pressable>
                )}
                <Pressable style={styles.iconButton} onPress={onDelete}>
                    <Entypo name="trash" size={20} color="gray" />
                </Pressable>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    iconButton: {
        padding: 2,
        marginHorizontal: 2,
        borderRadius: 2
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    activeRow: {
        backgroundColor: "#fee",
    },
    flexRow: {
        flex: 1,
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#aaa",
        paddingVertical: 2,
    },
    actions: {
        flexDirection: "row",
        gap: 12,
    },
});
