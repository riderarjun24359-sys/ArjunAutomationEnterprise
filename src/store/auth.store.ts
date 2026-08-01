import { create } from "zustand";
import type { AuthSession, AuthUser } from "@/src/types/auth";

interface AuthState {
    user: AuthUser | null;
    session: AuthSession | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
    setUser: (user: AuthUser | null) => void;
    setSession: (session: AuthSession | null) => void;
    setAuth: (user: AuthUser | null, session: AuthSession | null) => void;
    clearAuth: () => void;
    hydrate: (user: AuthUser | null, session: AuthSession | null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isHydrated: false,
    setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
    setSession: (session) => set({ session }),
    setAuth: (user, session) => set({ user, session, isAuthenticated: Boolean(user) }),
    clearAuth: () => set({ user: null, session: null, isAuthenticated: false }),
    hydrate: (user, session) => set({ user, session, isAuthenticated: Boolean(user), isHydrated: true }),
}));
