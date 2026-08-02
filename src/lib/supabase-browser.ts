import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseConfigured } from "@/src/lib/supabase-config";

export const supabaseBrowser = () => {
    try {
        const { url, anonKey } = assertSupabaseConfigured();
        return createBrowserClient(url, anonKey);
    } catch {
        return null;
    }
};
