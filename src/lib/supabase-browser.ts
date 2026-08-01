import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/src/lib/env";

export const supabaseBrowser = () => {
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return null;
    }

    return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};
