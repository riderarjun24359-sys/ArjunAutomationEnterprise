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
                    for (const cookie of cookiesToSet) {
                        cookieStore.set(cookie.name, cookie.value, cookie.options);
                    }
                },
            },
        });
    } catch {
        return null;
    }
};
