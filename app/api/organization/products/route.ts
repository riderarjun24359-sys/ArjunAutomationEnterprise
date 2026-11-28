import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

const PRODUCT_KEYS = ["school", "retail", "clinic", "business", "automation"] as const;

export async function GET(request: Request) {
    const { context, error } = await secureApiRoute(request, {
        rateLimitKey: `organization-products:${getClientIp(request)}`,
        rateLimit: 60,
    });
    if (error || !context) {
        return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!context.organizationId) {
        return NextResponse.json({ error: "Organization context required" }, { status: 403 });
    }

    const client = getServiceRoleClient();
    if (!client) {
        return NextResponse.json({ error: "Product service unavailable" }, { status: 503 });
    }

    const result = await client
        .from("organization_products")
        .select("product_key,status")
        .eq("organization_id", context.organizationId)
        .in("status", ["trial", "active"]);

    if (result.error) {
        return NextResponse.json({ error: "Unable to load product access" }, { status: 503 });
    }

    const enabledProducts = (result.data ?? [])
        .map((row) => row.product_key)
        .filter((key): key is (typeof PRODUCT_KEYS)[number] => PRODUCT_KEYS.includes(key));

    return NextResponse.json(
        { products: [...new Set(enabledProducts)] },
        { status: 200, headers: { "Cache-Control": "no-store, private" } },
    );
}
