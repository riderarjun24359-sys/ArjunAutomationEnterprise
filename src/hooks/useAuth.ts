import { useCallback } from "react";
import { authService } from "@/src/services/auth.service";
import { useAuthStore } from "@/src/store/auth.store";

export const useAuth = () => {
    const { user, session, isAuthenticated, isHydrated, setAuth, setUser, setSession, clearAuth, hydrate } = useAuthStore();

    const initialize = useCallback(async () => {
        const result = await authService.getSession();
        hydrate(result.user, result.session);
    }, [hydrate]);

    const signOut = useCallback(async () => {
        await authService.signOut();
        clearAuth();
    }, [clearAuth]);

    return {
        user,
        session,
        isAuthenticated,
        isHydrated,
        setUser,
        setSession,
        setAuth,
        clearAuth,
        hydrate,
        initialize,
        signOut,
    };
};
