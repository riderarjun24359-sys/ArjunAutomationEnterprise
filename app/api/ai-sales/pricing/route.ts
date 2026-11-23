import { NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

function cleanString(value: unknown, max: number): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: Request) {
    const secured = await secureApiRoute(request, {
        permission: "automationManage",
        rateLimit: 30,
    });
    if (secured.error) return secured.error;
    if (!secured.context?.organizationId) {
        return NextResponse.json({ error: "Organization context is required" }, { status: 403 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Sales policy storage is not configured" }, { status: 503 });

    const { data, error } = await client
        .from("ai_sales_pricing_policies")
        .select("id, service_code, service_name, currency, list_price_inr, minimum_price_inr, max_discount_percent, active, updated_at")
        .eq("organization_id", secured.context.organizationId)
        .order("service_name", { ascending: true });

    if (error) return NextResponse.json({ error: "Could not load pricing policies" }, { status: 500 });
    return NextResponse.json({ policies: data ?? [] });
}

export async function PUT(request: Request) {
    const secured = await secureApiRoute(request, {
        permission: "automationManage",
        rateLimit: 10,
    });
    if (secured.error) return secured.error;
    if (!secured.context?.organizationId) {
        return NextResponse.json({ error: "Organization context is required" }, { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const serviceCode = cleanString(body.serviceCode, 64).toLowerCase();
    const serviceName = cleanString(body.serviceName, 120);
    const listPrice = Number(body.listPriceInr);
    const minimumPrice = Number(body.minimumPriceInr);
    const maxDiscount = Number(body.maxDiscountPercent);
    const active = body.active === true;

    if (!/^[a-z0-9][a-z0-9_-]{1,63}$/.test(serviceCode) || !serviceName) {
        return NextResponse.json({ error: "A valid service code and name are required" }, { status: 400 });
    }
    if (
        !Number.isFinite(listPrice) ||
        !Number.isFinite(minimumPrice) ||
        !Number.isFinite(maxDiscount) ||
        listPrice < 0 ||
        minimumPrice < 0 ||
        minimumPrice > listPrice ||
        maxDiscount < 0 ||
        maxDiscount > 100
    ) {
        return NextResponse.json({ error: "Invalid INR price floor or discount limit" }, { status: 400 });
    }

    const mathematicallyAvailableDiscount = listPrice === 0
        ? 0
        : ((listPrice - minimumPrice) / listPrice) * 100;
    if (maxDiscount > mathematicallyAvailableDiscount + 0.0001) {
        return NextResponse.json({
            error: "Maximum discount cannot reduce the list price below the configured minimum price",
        }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Sales policy storage is not configured" }, { status: 503 });

    const { data, error } = await client
        .from("ai_sales_pricing_policies")
        .upsert({
            organization_id: secured.context.organizationId,
            service_code: serviceCode,
            service_name: serviceName,
            currency: "INR",
            list_price_inr: listPrice,
            minimum_price_inr: minimumPrice,
            max_discount_percent: maxDiscount,
            active,
            updated_by: secured.context.user.id,
            updated_at: new Date().toISOString(),
        }, { onConflict: "organization_id,service_code" })
        .select("id, service_code, service_name, currency, list_price_inr, minimum_price_inr, max_discount_percent, active, updated_at")
        .single();

    if (error || !data) return NextResponse.json({ error: "Could not save pricing policy" }, { status: 500 });
    return NextResponse.json({ success: true, policy: data });
}
