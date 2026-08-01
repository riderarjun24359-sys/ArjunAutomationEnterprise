import { supabaseServer } from "@/src/lib/supabase-server";
import type { AuthUser, AuthSession } from "@/src/types/auth";

const mapUser = (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null): AuthUser | null => {
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email ?? "",
        fullName: typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null,
        avatarUrl: typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null,
        role: "member",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};

const mapSession = (session: { access_token: string; refresh_token?: string | null; expires_at?: number | null } | null): AuthSession | null => {
    if (!session) {
        return null;
    }

    return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token ?? null,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : new Date().toISOString(),
        provider: "supabase",
    };
};

export const authServerService = {
    async getSession() {
        const client = await supabaseServer();
        if (!client) {
            return { user: null, session: null };
        }

        const { data, error } = await client.auth.getUser();
        if (error) {
            return { user: null, session: null };
        }

        return {
            user: mapUser(data.user),
            session: null,
        };
    },
};
