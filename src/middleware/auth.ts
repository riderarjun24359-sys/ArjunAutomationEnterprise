import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/src/constants/routes";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { createSupabaseMiddlewareClient } from "@/src/lib/supabase-middleware";

const publicMarketingRoutes = [
    MARKETING_ROUTES.home,
    MARKETING_ROUTES.about,
    MARKETING_ROUTES.services,
    MARKETING_ROUTES.industries,
    MARKETING_ROUTES.solutions,
    MARKETING_ROUTES.portfolio,
    MARKETING_ROUTES.caseStudies,
    MARKETING_ROUTES.blog,
    MARKETING_ROUTES.careers,
    MARKETING_ROUTES.contact,
    MARKETING_ROUTES.privacy,
    MARKETING_ROUTES.terms,
    MARKETING_ROUTES.cookies,
    MARKETING_ROUTES.thankYou,
    MARKETING_ROUTES.launchAutomation,
    MARKETING_ROUTES.launchCrm,
];

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
    ROUTES.businessPlatform,
    ROUTES.documents,
    ROUTES.ai,
    ROUTES.knowledge,
    ROUTES.businessAnalyst,
    ROUTES.solutionArchitect,
    ROUTES.developmentFactory,
    ROUTES.qaEngineer,
    ROUTES.devopsDeployment,
    ROUTES.customerSuccess,
    ROUTES.clientSuccess,
    ROUTES.missionCore,
    ROUTES.securityCenter,
    ROUTES.platformOperations,
    ROUTES.aiFoundation,
    ROUTES.founderOs,
    ROUTES.autonomousCompany,
    ROUTES.commercialPlatform,
    ROUTES.enterpriseIdentity,
    ROUTES.tenantLifecycle,
    ROUTES.billingRevenue,
    ROUTES.communicationHub,
    ROUTES.integrationPlatform,
    ROUTES.operationsCenter,
    ROUTES.executiveIntelligence,
    ROUTES.launchReadiness,
    ROUTES.industryFramework,
    ROUTES.businessProcess,
    ROUTES.formEngine,
    ROUTES.workflowEngine,
    ROUTES.documentEngine,
    ROUTES.restaurant,
    ROUTES.school,
    ROUTES.hospital,
    ROUTES.retail,
    ROUTES.launchFoundation,
    ROUTES.companyFoundation,
    ROUTES.customerSuccessDelivery,
    ROUTES.customerOperatedPlatform,
    ROUTES.enterpriseIntelligencePlatform,
    ROUTES.aiOrganizationFoundation,
    ROUTES.enterpriseGovernancePlatform,
    ROUTES.growthEngine,
    ROUTES.brandOs,
    ROUTES.designOs,
    ROUTES.businessAssets,
    ROUTES.companyLaunchKit,
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
    const isPublicMarketingRoute =
        publicMarketingRoutes.some((route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`))) ||
        pathname.startsWith("/portfolio/") ||
        pathname.startsWith("/blog/");

    if (isPublicMarketingRoute && !isProtectedRoute && !isAuthRoute) {
        return NextResponse.next();
    }

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
