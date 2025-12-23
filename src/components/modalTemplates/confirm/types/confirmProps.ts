export type ConfirmProps = {
    title: string;
    message: string;
    submitLabel?: string;
    onCancel: () => void;
    onAct: () => void;
};