import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/src/lib/supabase-browser";

export const getRepositoryClient = (): SupabaseClient | null => supabaseBrowser();

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
    if (!error) {
        return;
    }

    if (isRecoverableRepositoryError(error)) {
        console.warn(`[repository] ${context}: ${error.message}`);
        return;
    }

    throw new Error(`${context}: ${error.message}`);
};
