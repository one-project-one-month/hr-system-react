// src/stores/useSuccessDialogStore.ts
import { create } from "zustand";

interface SuccessDialogState {
  open: boolean;
  description: string;
  onConfirm?: () => void;
  openDialog: (desc: string, onConfirm?: () => void) => void;
  closeDialog: () => void;
}

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
