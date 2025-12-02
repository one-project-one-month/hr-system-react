export interface SuccessDialogState {
    open: boolean;
    description: string;
    onConfirm?: () => void;
    openDialog: (desc: string, onConfirm?: () => void) => void;
    closeDialog: () => void;
}
