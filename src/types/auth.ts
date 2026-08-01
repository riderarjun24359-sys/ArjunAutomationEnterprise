import type { UserRole } from "@/src/constants/roles";

export type AuthProvider = "email" | "supabase" | "magic-link";

export interface AuthUser {
    id: string;
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface AuthSession {
    accessToken: string;
    refreshToken?: string | null;
    expiresAt: string;
    provider: AuthProvider;
}
