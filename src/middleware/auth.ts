import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/src/constants/routes";
import { createSupabaseMiddlewareClient } from "@/src/lib/supabase-middleware";

const protectedRoutes = [
    ROUTES.dashboard,
    ROUTES.organization,
    ROUTES.projects,
    ROUTES.clients,
    ROUTES.tasks,
    ROUTES.finance,
    ROUTES.crm,
    ROUTES.analytics,
    ROUTES.automation,
    ROUTES.settings,
    ROUTES.hr,
    ROUTES.inventory,
    ROUTES.support,
    ROUTES.sales,
    ROUTES.documents,
    ROUTES.ai,
];

const authRoutes = [
    ROUTES.auth.signIn,
    ROUTES.auth.signUp,
    ROUTES.auth.forgotPassword,
    ROUTES.auth.resetPassword,
    ROUTES.auth.callback,
];

export async function authMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    const supabaseContext = createSupabaseMiddlewareClient(request);

    if (!supabaseContext) {
        if (isProtectedRoute) {
            const signInUrl = new URL(ROUTES.auth.signIn, request.url);
            signInUrl.searchParams.set("redirectTo", pathname);
            signInUrl.searchParams.set("error", "supabase_not_configured");
            return NextResponse.redirect(signInUrl);
        }

        return NextResponse.next();
    }

    const { supabase, response } = supabaseContext;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (isProtectedRoute && !user) {
        const signInUrl = new URL(ROUTES.auth.signIn, request.url);
        signInUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(signInUrl);
    }

    if (isAuthRoute && user && pathname !== ROUTES.auth.callback) {
        return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
    }

    return response;
}
