import { supabaseBrowser } from "@/src/lib/supabase-browser";
import type { AuthUser, AuthSession, AuthProvider, SignInInput, SignUpInput, ResetPasswordInput, NewPasswordInput } from "@/src/types/auth";

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

export const authService = {
    async signIn(input: SignInInput) {
        const client = supabaseBrowser();
        if (!client) {
            throw new Error("Authentication is not configured.");
        }

        const { data, error } = await client.auth.signInWithOtp({
            email: input.email,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });

        if (error) {
            throw error;
        }

        return { user: mapUser(data.user), session: mapSession(data.session) };
    },

    async signUp(input: SignUpInput) {
        const client = supabaseBrowser();
        if (!client) {
            throw new Error("Authentication is not configured.");
        }

        const { data, error } = await client.auth.signUp({
            email: input.email,
            password: input.password,
            options: {
                data: { full_name: input.fullName ?? null },
            },
        });

        if (error) {
            throw error;
        }

        return { user: mapUser(data.user), session: mapSession(data.session) };
    },

    async forgotPassword(input: ResetPasswordInput) {
        const client = supabaseBrowser();
        if (!client) {
            throw new Error("Authentication is not configured.");
        }

        const { error } = await client.auth.resetPasswordForEmail(input.email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
            throw error;
        }

        return true;
    },

    async resetPassword(input: NewPasswordInput) {
        const client = supabaseBrowser();
        if (!client) {
            throw new Error("Authentication is not configured.");
        }

        const { error } = await client.auth.updateUser({ password: input.password });
        if (error) {
            throw error;
        }

        return true;
    },

    async signOut() {
        const client = supabaseBrowser();
        if (!client) {
            return;
        }

        await client.auth.signOut();
    },

    async getSession() {
        const client = supabaseBrowser();
        if (!client) {
            return { user: null, session: null };
        }

        const { data, error } = await client.auth.getSession();
        if (error) {
            throw error;
        }

        return {
            user: mapUser(data.session?.user ?? null),
            session: mapSession(data.session),
        };
    },

};
