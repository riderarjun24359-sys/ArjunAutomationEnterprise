"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/src/lib/supabase-browser";
import { useAuth } from "@/src/hooks/useAuth";

const mapUser = (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null) => {
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email ?? "",
        fullName: typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null,
        avatarUrl: typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null,
        role: "member" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};

const mapSession = (session: { access_token: string; refresh_token?: string | null; expires_at?: number | null } | null) => {
    if (!session) {
        return null;
    }

    return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token ?? null,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : new Date().toISOString(),
        provider: "supabase" as const,
    };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { initialize, hydrate, clearAuth, isHydrated } = useAuth();

    useEffect(() => {
        void initialize();
    }, [initialize]);

    useEffect(() => {
        const client = supabaseBrowser();
        if (!client) {
            return;
        }

        const {
            data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                hydrate(mapUser(session.user), mapSession(session));
                return;
            }

            clearAuth();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [hydrate, clearAuth]);

    if (!isHydrated) {
        return null;
    }

    return <>{children}</>;
}
