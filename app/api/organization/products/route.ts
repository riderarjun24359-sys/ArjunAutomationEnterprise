import { NextResponse } from "next/server";
import { getClientIp, logApiAudit, secureApiRoute } from "@/src/lib/api-security";
import { selectedProductsSchema } from "@/src/lib/organization-provisioning";
import { hasPermission } from "@/src/config/permissions";
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
        { products: [...new Set(enabledProducts)], canManage: hasPermission(context.user.role, "settingsManage") },
        { status: 200, headers: { "Cache-Control": "no-store, private" } },
    );
}

/** Update the organization's enabled product set. Admin/founder only. */
export async function POST(request: Request) {
    const { context, error } = await secureApiRoute(request, {
        permission: "settingsManage",
        rateLimitKey: `organization-products-update:${getClientIp(request)}`,
        rateLimit: 10,
    });
    if (error || !context) {
        return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!context.organizationId) {
        return NextResponse.json({ error: "Organization context required" }, { status: 403 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    if (typeof body !== "object" || body === null || !("products" in body) || !Array.isArray((body as { products?: unknown }).products)) {
        return NextResponse.json({ error: "Select at least one product" }, { status: 400 });
    }

    const input = selectedProductsSchema.safeParse((body as { products: unknown }).products);
    if (!input.success) {
        return NextResponse.json(
            { error: input.error.issues[0]?.message ?? "Invalid product selection" },
            { status: 400 },
        );
    }

    const client = getServiceRoleClient();
    if (!client) {
        return NextResponse.json({ error: "Product service unavailable" }, { status: 503 });
    }

    const { error: updateError } = await client.rpc("set_organization_products", {
        p_organization_id: context.organizationId,
        p_product_keys: input.data,
    });
    if (updateError) {
        return NextResponse.json({ error: "Unable to update organization products" }, { status: 503 });
    }

    await logApiAudit({
        action: "update",
        userId: context.user.id,
        organizationId: context.organizationId,
        metadata: { action: "organization_products_updated", products: input.data },
    });

    return NextResponse.json(
        { products: input.data },
        { status: 200, headers: { "Cache-Control": "no-store, private" } },
    );
}
