import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertSupabaseConfigured } from "@/src/lib/supabase-config";

export const supabaseServer = async () => {
    const cookieStore = await cookies();

    try {
        const { url, anonKey } = assertSupabaseConfigured();

        return createServerClient(url, anonKey, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },

                // Next.js 16 Server Components lo cookies set cheyyakudadhu.
                setAll() {
                    // Intentionally empty
                },
            },
        });
    } catch {
        return null;
    }
};