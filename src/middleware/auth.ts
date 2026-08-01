import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/src/constants/routes";

const protectedRoutes = [ROUTES.dashboard, ROUTES.projects, ROUTES.clients, ROUTES.tasks, ROUTES.finance, ROUTES.crm, ROUTES.analytics, ROUTES.automation, ROUTES.settings];
const authRoutes = [ROUTES.auth.signIn, ROUTES.auth.signUp, ROUTES.auth.forgotPassword, "/auth/reset-password"];

export function authMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    const sessionCookie = request.cookies.get("sb-access-token")?.value;

    if (isProtectedRoute && !sessionCookie) {
        const signInUrl = new URL(ROUTES.auth.signIn, request.url);
        signInUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(signInUrl);
    }

    if (isAuthRoute && sessionCookie) {
        return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
    }

    return NextResponse.next();
}
