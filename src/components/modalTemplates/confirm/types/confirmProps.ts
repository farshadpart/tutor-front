export type ConfirmProps = {
    dangerousAct?: boolean;
    title: string;
    message: string;
    submitLabel?: string;
    onCancel?: () => void;
    onAct: () => void;
};