import { create } from "zustand";

interface UIState {
  activeModal: string | null;
  modalData: any;
  isBottomSheetOpen: boolean;
  bottomSheetContent: string | null;
  openModal: (name: string, data?: any) => void;
  closeModal: () => void;
  openBottomSheet: (content: string) => void;
  closeBottomSheet: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  activeModal: null,
  modalData: null,
  isBottomSheetOpen: false,
  bottomSheetContent: null,

  openModal: (name: string, data?: any) => {
    set({ activeModal: name, modalData: data ?? null });
  },

  closeModal: () => {
    set({ activeModal: null, modalData: null });
  },

  openBottomSheet: (content: string) => {
    set({ isBottomSheetOpen: true, bottomSheetContent: content });
  },

  closeBottomSheet: () => {
    set({ isBottomSheetOpen: false, bottomSheetContent: null });
  },
}));
