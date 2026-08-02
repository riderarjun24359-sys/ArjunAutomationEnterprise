export const getSupabaseUrl = (): string | undefined => process.env.NEXT_PUBLIC_SUPABASE_URL;
export const getSupabaseAnonKey = (): string | undefined => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => Boolean(getSupabaseUrl() && getSupabaseAnonKey());

export const assertSupabaseConfigured = (): { url: string; anonKey: string } => {
    const url = getSupabaseUrl();
    const anonKey = getSupabaseAnonKey();

    if (!url || !anonKey) {
        throw new Error(
            "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.",
        );
    }

    return { url, anonKey };
};
