import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ROUTES } from "@/src/constants/routes";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/src/lib/supabase-config";
import { resolveSafeAuthRedirect } from "@/src/lib/safe-auth-redirect";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? searchParams.get("redirectTo") ?? ROUTES.dashboard;

    const url = getSupabaseUrl();
    const anonKey = getSupabaseAnonKey();

    if (!url || !anonKey) {
        return NextResponse.redirect(`${origin}${ROUTES.auth.signIn}?error=supabase_not_configured`);
    }

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(url, anonKey, {
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

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(resolveSafeAuthRedirect({ next, origin, fallback: ROUTES.dashboard }));
        }
    }

    return NextResponse.redirect(`${origin}${ROUTES.auth.signIn}?error=auth_callback_failed`);
}
