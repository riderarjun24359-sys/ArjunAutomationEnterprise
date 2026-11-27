import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/src/constants/routes";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { createSupabaseMiddlewareClient } from "@/src/lib/supabase-middleware";
import { resolveTenantHost, SAAS_ROOT_DOMAIN } from "@/src/lib/saas/tenant-host";
import { resolveVerifiedTenantContext, resolveVerifiedTenantDomainContext } from "@/src/lib/saas/tenant-resolution";

const publicMarketingRoutes = [
    MARKETING_ROUTES.home,
    MARKETING_ROUTES.about,
    MARKETING_ROUTES.features,
    MARKETING_ROUTES.services,
    MARKETING_ROUTES.industries,
    MARKETING_ROUTES.solutions,
    MARKETING_ROUTES.portfolio,
    MARKETING_ROUTES.caseStudies,
    MARKETING_ROUTES.blog,
    MARKETING_ROUTES.careers,
    MARKETING_ROUTES.pricing,
    MARKETING_ROUTES.upgrade,
    MARKETING_ROUTES.faq,
    MARKETING_ROUTES.help,
    MARKETING_ROUTES.feedback,
    MARKETING_ROUTES.resources,
    MARKETING_ROUTES.search,
    MARKETING_ROUTES.sitemap,
    MARKETING_ROUTES.contact,
    MARKETING_ROUTES.privacy,
    MARKETING_ROUTES.terms,
    MARKETING_ROUTES.cookies,
    MARKETING_ROUTES.refund,
    MARKETING_ROUTES.thankYou,
    MARKETING_ROUTES.launchAutomation,
    MARKETING_ROUTES.launchCrm,
];

const protectedRoutes = [
    ROUTES.dashboard,
    ROUTES.onboarding,
    ROUTES.organization,
    ROUTES.projects,
    ROUTES.clients,
    ROUTES.tasks,
    ROUTES.finance,
    ROUTES.crm,
    ROUTES.customerOs,
    ROUTES.analytics,
    ROUTES.automation,
    ROUTES.settings,
    ROUTES.hr,
    ROUTES.hrms,
    ROUTES.inventory,
    ROUTES.support,
    ROUTES.sales,
    ROUTES.businessPlatform,
    ROUTES.deliveryEngine,
    ROUTES.productionReadiness,
    ROUTES.productionDeployment,
    ROUTES.goLive,
    ROUTES.executiveAi,
    ROUTES.executiveAiEcosystem,
    ROUTES.globalOperations,
    ROUTES.aiCommandCenter,
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
    ROUTES.founderAnalytics,
    ROUTES.earlyAccess,
    ROUTES.customerSuccessGrowth,
    ROUTES.autonomousCompany,
    ROUTES.commercialPlatform,
    ROUTES.enterpriseIdentity,
    ROUTES.tenantLifecycle,
    ROUTES.billingRevenue,
    ROUTES.billingFinance,
    ROUTES.communicationHub,
    ROUTES.integrationPlatform,
    ROUTES.integrationHub,
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
    ROUTES.growthEngineV1,
    ROUTES.growthOsFoundation,
    ROUTES.growthOsContent,
    ROUTES.growthOsCreative,
    ROUTES.growthOsVideo,
    ROUTES.growthOsPublishing,
    ROUTES.growthOsIntelligence,
    ROUTES.aiMarketingGrowthEngine,
    ROUTES.aiSalesLeadEngine,
    ROUTES.aiCustomerSuccessEngine,
    ROUTES.aiFinanceBillingEngine,
    ROUTES.aiAutomationEngine,
    ROUTES.aiOperationsCenter,
    ROUTES.enterpriseIntegrations,
    ROUTES.aiEnterpriseBrain,
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

    const hostname = request.nextUrl.hostname.toLowerCase().replace(/\\.$/, "");
    const hostResolution = resolveTenantHost(hostname);
    const isTenantSubdomain = hostResolution.kind === "tenant-subdomain";
    const isReservedPlatformHost =
        hostResolution.kind === "reserved" && hostResolution.subdomain !== "www";
    const isInvalidPlatformSubdomain =
        hostResolution.kind === "unknown-host" && hostname.endsWith(`.${SAAS_ROOT_DOMAIN}`);

    // Reserved platform hosts (api, admin, auth, mail, etc.) must never be
    // mistaken for customer tenants when wildcard DNS is enabled.
    if (isReservedPlatformHost || isInvalidPlatformSubdomain) {
        return new NextResponse("Not Found", { status: 404 });
    }

    // A tenant hostname is usable only after its domain record is verified
    // and its organization is active. Pending or unknown tenant hosts fail closed.
    if (isTenantSubdomain) {
        const verifiedDomain = await resolveVerifiedTenantDomainContext(request);
        if (!verifiedDomain) {
            return new NextResponse("Tenant domain not found", { status: 404 });
        }
    }

    if (isPublicMarketingRoute && !isProtectedRoute && !isAuthRoute && !isTenantSubdomain) {
        // Forward proxy-injected nonce/CSP request headers to the Next.js renderer.
        return NextResponse.next({ request: { headers: request.headers } });
    }

    const supabaseContext = createSupabaseMiddlewareClient(request);

    if (!supabaseContext) {
        if (isProtectedRoute) {
            const signInUrl = new URL(ROUTES.auth.signIn, request.nextUrl.origin);
            signInUrl.searchParams.set("redirectTo", pathname);
            signInUrl.searchParams.set("error", "supabase_not_configured");
            return NextResponse.redirect(signInUrl);
        }

        return NextResponse.next({ request: { headers: request.headers } });
    }

    const { supabase, response } = supabaseContext;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (isTenantSubdomain) {
        if (!user) {
            if (isAuthRoute) return response;
            const signInUrl = new URL(ROUTES.auth.signIn, request.nextUrl.origin);
            signInUrl.searchParams.set("redirectTo", pathname);
            const redirect = NextResponse.redirect(signInUrl);
            response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
            return redirect;
        }

        const tenant = await resolveVerifiedTenantContext(request, user.id);
        if (!tenant) {
            const denied = new NextResponse("Tenant access denied", { status: 404 });
            response.cookies.getAll().forEach((cookie) => denied.cookies.set(cookie));
            return denied;
        }

        // Overwrite any client-supplied organization header with the tenant
        // resolved from the verified hostname and authenticated membership.
        const tenantHeaders = new Headers(request.headers);
        tenantHeaders.set("x-organization-id", tenant.organizationId);
        tenantHeaders.set("x-tenant-id", tenant.organizationId);
        tenantHeaders.set("x-tenant-slug", tenant.organizationSlug);
        tenantHeaders.set("x-tenant-role", tenant.roleName);
        tenantHeaders.set("x-tenant-hostname", tenant.hostname);

        if (isAuthRoute && pathname !== ROUTES.auth.callback) {
            const redirect = NextResponse.redirect(new URL(ROUTES.dashboard, request.nextUrl.origin));
            response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
            return redirect;
        }

        const tenantResponse = NextResponse.next({ request: { headers: tenantHeaders } });
        response.cookies.getAll().forEach((cookie) => tenantResponse.cookies.set(cookie));
        return tenantResponse;
    }

    if (isProtectedRoute && !user) {
        const signInUrl = new URL(ROUTES.auth.signIn, request.nextUrl.origin);
        signInUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(signInUrl);
    }

    if (isAuthRoute && user && pathname !== ROUTES.auth.callback) {
        return NextResponse.redirect(new URL(ROUTES.dashboard, request.nextUrl.origin));
    }

    return response;
}
