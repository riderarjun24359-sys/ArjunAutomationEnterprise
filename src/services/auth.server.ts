import { supabaseServer } from "@/src/lib/supabase-server";
import type { AuthUser, AuthSession } from "@/src/types/auth";
import {
    buildSessionValidation,
    type SessionValidationResult,
} from "@/src/lib/session-security";
import { productionLog } from "@/src/lib/production-logger";

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

        const { data, error } = await client.auth.getSession();
        if (error || !data.session) {
            return { user: null, session: null };
        }

        return {
            user: mapUser(data.session.user),
            session: mapSession(data.session),
        };
    },

    async getUser() {
        const client = await supabaseServer();
        if (!client) {
            return null;
        }

        const { data, error } = await client.auth.getUser();
        if (error) {
            return null;
        }

        return mapUser(data.user);
    },

    /** Hardened session validation using getUser + expiry/token shape checks. */
    async validateSession(): Promise<SessionValidationResult & { user: AuthUser | null; session: AuthSession | null }> {
        const client = await supabaseServer();
        if (!client) {
            return { valid: false, reason: "missing", user: null, session: null };
        }

        const { data: userData, error: userError } = await client.auth.getUser();
        if (userError || !userData.user) {
            return { valid: false, reason: "missing", user: null, session: null };
        }

        const { data: sessionData } = await client.auth.getSession();
        const session = mapSession(sessionData.session);
        const user = mapUser(userData.user);
        if (!session) {
            return { valid: false, reason: "missing", user, session: null };
        }

        const validation = buildSessionValidation({
            accessToken: session.accessToken,
            expiresAt: session.expiresAt,
        });

        if (!validation.valid) {
            productionLog("warn", "Session validation failed", "auth.server", { reason: validation.reason });
        }

        return { ...validation, user, session };
    },

    /** Verifies refresh token presence and attempts a silent refresh when near expiry. */
    async refreshSessionIfNeeded(): Promise<{ refreshed: boolean; validation: SessionValidationResult; session: AuthSession | null }> {
        const client = await supabaseServer();
        if (!client) {
            return { refreshed: false, validation: { valid: false, reason: "missing" }, session: null };
        }

        const current = await this.validateSession();
        if (!current.valid && current.reason !== "refresh_required" && current.reason !== "expired") {
            return { refreshed: false, validation: current, session: current.session };
        }

        if (current.valid && current.reason !== "refresh_required") {
            return { refreshed: false, validation: current, session: current.session };
        }

        if (!current.session?.refreshToken) {
            return {
                refreshed: false,
                validation: { valid: false, reason: "expired", expiresAt: current.expiresAt },
                session: current.session,
            };
        }

        const { data, error } = await client.auth.refreshSession();
        if (error || !data.session) {
            productionLog("warn", "Token refresh failed", "auth.server", { error: error?.message });
            return {
                refreshed: false,
                validation: { valid: false, reason: "expired", expiresAt: current.expiresAt },
                session: current.session,
            };
        }

        const session = mapSession(data.session);
        const validation = buildSessionValidation({
            accessToken: session?.accessToken,
            expiresAt: session?.expiresAt,
        });
        return { refreshed: true, validation, session };
    },
};
