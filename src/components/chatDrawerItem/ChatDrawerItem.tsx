import { ChatDrawerItemProps } from "@/src/components/chatDrawerItem/types/chatDriverItemProps";
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedView } from '@/src/components/themedView/ThemedView'
import { ThemedTextInput } from '@/src/components/themedTextInput/ThemedTextInput';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';

export default function ChatDrawerItem({
    id,
    title,
    isActive,
    onPress,
    onRename,
    onDelete,
}: ChatDrawerItemProps) {
    const { theme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(title);

    const handleSave = () => {
        setIsEditing(false);
        if (draft.trim() && draft !== title) {
            onRename(id, draft.trim());
        } else {
            setDraft(title);
        }
    };

    return (
        <ThemedView style={[styles.row, isActive && { backgroundColor: theme.colors.activeRowBackground }]}>
            {isEditing ? (
                <ThemedTextInput
                    style={styles.input}
                    value={draft}
                    onChangeText={setDraft}
                    autoFocus
                    onBlur={handleSave}
                    onSubmitEditing={handleSave}
                />
            ) : (
                <ThemedTouchableOpacity style={[styles.flexRow, { backgroundColor: isActive ? theme.colors.activeRowBackground : theme.colors.background }]} onPress={onPress}>
                    <ThemedText style={styles.label}>{title}</ThemedText>
                </ThemedTouchableOpacity>
            )}

            <ThemedView style={[styles.actions, { backgroundColor: isActive ? theme.colors.activeRowBackground : theme.colors.background }]}>
                {isEditing ? (
                    <ThemedTouchableOpacity style={[styles.iconButton, { backgroundColor: isActive ? theme.colors.activeRowBackground : theme.colors.background }]} onPress={handleSave}>
                        <Feather name="check" size={20} color={theme.colors.success} />
                    </ThemedTouchableOpacity>
                ) : (
                    <ThemedTouchableOpacity
                        style={[styles.iconButton, { backgroundColor: isActive ? theme.colors.activeRowBackground : theme.colors.background }]}
                        onPress={() => {
                            setDraft(title);
                            setIsEditing(true);
                        }}
                    >
                        <Feather name="edit-2" size={20} color={theme.colors.text} />
                    </ThemedTouchableOpacity>
                )}
                <ThemedTouchableOpacity style={[styles.iconButton, { backgroundColor: isActive ? theme.colors.activeRowBackground : theme.colors.background }]} onPress={onDelete}>
                    <Feather name="trash-2" size={20} color={theme.colors.text} />
                </ThemedTouchableOpacity>
            </ThemedView>
        </ThemedView>
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
        paddingVertical: 2,
    },
    actions: {
        flexDirection: "row",
        gap: 12,
    },
});
