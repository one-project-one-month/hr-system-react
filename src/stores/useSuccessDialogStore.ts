// src/stores/useSuccessDialogStore.ts
import type { SuccessDialogState } from "@/types/successDialogue";
import { create } from "zustand";

export const useSuccessDialogStore = create<SuccessDialogState>((set) => ({
    open: false,
    description: "",
    onConfirm: undefined,

    openDialog: (description, onConfirm) =>
        set({
            open: true,
            description,
            onConfirm,
        }),

    closeDialog: () =>
        set({
            open: false,
            description: "",
            onConfirm: undefined,
        }),
}));
