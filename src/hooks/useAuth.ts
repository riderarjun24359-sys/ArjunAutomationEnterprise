import { useAuthStore } from "@/src/store/auth.store";

export const useAuth = () => {
    const { user, session, isAuthenticated, setUser, setSession, clearAuth } = useAuthStore();

    return {
        user,
        session,
        isAuthenticated,
        setUser,
        setSession,
        clearAuth,
    };
};
