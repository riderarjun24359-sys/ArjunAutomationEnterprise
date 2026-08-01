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

export interface SignInInput {
    email: string;
    password: string;
}

export interface SignUpInput {
    email: string;
    password: string;
    fullName?: string | null;
}

export interface ResetPasswordInput {
    email: string;
}

export interface NewPasswordInput {
    password: string;
}
