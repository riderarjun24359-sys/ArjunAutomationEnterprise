import { create } from "zustand";
import type { AuthSession, AuthUser } from "@/src/types/auth";

interface AuthState {
    user: AuthUser | null;
    session: AuthSession | null;
    isAuthenticated: boolean;
    setUser: (user: AuthUser | null) => void;
    setSession: (session: AuthSession | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    session: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
    setSession: (session) => set({ session }),
    clearAuth: () => set({ user: null, session: null, isAuthenticated: false }),
}));
