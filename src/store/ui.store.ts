import { create } from "zustand";

interface UiState {
    modalOpen: boolean;
    activeModal: string | null;
    openModal: (modal: string) => void;
    closeModal: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
    modalOpen: false,
    activeModal: null,
    openModal: (modal) => set({ modalOpen: true, activeModal: modal }),
    closeModal: () => set({ modalOpen: false, activeModal: null }),
}));
