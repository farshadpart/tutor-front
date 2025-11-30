export interface ChatDrawerItemProps {
    id: string;
    title: string;
    isActive: boolean;
    onPress: () => void;
    onRename: (id: string, newTitle: string) => void;
    onDelete: () => void;
}