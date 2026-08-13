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

                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        });
    } catch {
        return null;
    }
};