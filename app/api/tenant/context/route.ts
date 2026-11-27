import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { resolveVerifiedTenantContext } from "@/src/lib/saas/tenant-resolution";

/** Resolve the tenant assigned to this verified hostname for the signed-in user. */
export async function GET(request: Request) {
    const { context, error } = await secureApiRoute(request, {
        rateLimitKey: `tenant-context:${getClientIp(request)}`,
        rateLimit: 60,
    });
    if (error || !context) {
        return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const tenant = await resolveVerifiedTenantContext(request, context.user.id);
    if (!tenant) {
        return NextResponse.json(
            { error: "No active tenant is available for this account and hostname" },
            { status: 404, headers: { "Cache-Control": "no-store" } },
        );
    }

    return NextResponse.json(
        {
            organization: {
                id: tenant.organizationId,
                name: tenant.organizationName,
                slug: tenant.organizationSlug,
            },
            membership: { roleName: tenant.roleName },
            hostname: tenant.hostname,
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}
