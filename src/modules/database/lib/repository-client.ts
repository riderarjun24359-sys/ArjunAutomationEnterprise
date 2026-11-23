import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/src/lib/supabase-browser";

/**
 * Client-side tenant selector. This value is only a query-scope hint; Supabase
 * RLS and server-side membership validation remain the authorization boundary.
 */
export const getSelectedOrganizationId = (): string | null => {
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem("aae:selected-organization")?.trim();
    return value || null;
};

export const getRepositoryClient = (): SupabaseClient | null => {
    if (typeof window !== "undefined") {
        return supabaseBrowser();
    }
    return null;
};

const isRecoverableRepositoryError = (error: { message: string; code?: string }): boolean => {
    const message = error.message.toLowerCase();
    return (
        message.includes("schema cache") ||
        message.includes("could not find the table") ||
        message.includes("does not exist") ||
        error.code === "PGRST205" ||
        error.code === "42P01"
    );
};

export const mapRepositoryError = (error: { message: string; code?: string } | null, context: string): void => {
    if (!error) return;
    if (isRecoverableRepositoryError(error)) {
        console.warn(`[repository] ${context}: ${error.message}`);
        return;
    }
    throw new Error(`${context}: ${error.message}`);
};
