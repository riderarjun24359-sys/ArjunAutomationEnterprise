import { create } from "zustand";

interface AppState {
    sidebarOpen: boolean;
    isMobileMenuOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
    reset: () => void;
}

const initialState = {
    sidebarOpen: true,
    isMobileMenuOpen: false,
};

export const useAppStore = create<AppState>()((set) => ({
    ...initialState,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    reset: () => set(initialState),
}));
