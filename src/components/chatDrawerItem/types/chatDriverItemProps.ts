export interface ChatDrawerItemProps {
    id: string;
    title: string;
    isActive: boolean;
    onPress: () => void;
    onRename: (id: string, newTitle: string, userId: string) => void;
    onDelete: () => void;
}