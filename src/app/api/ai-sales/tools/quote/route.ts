import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
    const secret = process.env.PRIYA_SALES_TOOL_SECRET;
    const header = request.headers.get("authorization") ?? "";
    if (!secret || !header.startsWith("Bearer ")) return false;
    const supplied = Buffer.from(header.slice(7));
    const expected = Buffer.from(secret);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function POST(request: Request) {
    if (!authorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim();
    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Sales organization is not configured" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const leadId = typeof body.leadId === "string" ? body.leadId.trim() : "";
    const serviceCode = typeof body.serviceCode === "string" ? body.serviceCode.trim().toLowerCase() : "";
    const requestedDiscount = body.requestedDiscountPercent === undefined
        ? 0
        : Number(body.requestedDiscountPercent);

    if (!leadId || !/^[a-z0-9][a-z0-9_-]{1,63}$/.test(serviceCode)) {
        return NextResponse.json({ error: "A CRM lead ID and valid service code are required" }, { status: 400 });
    }
    if (!Number.isFinite(requestedDiscount) || requestedDiscount < 0 || requestedDiscount > 100) {
        return NextResponse.json({ error: "Discount must be a number between 0 and 100" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Sales policy storage is not configured" }, { status: 503 });

    const { data: policy, error: policyError } = await client
        .from("ai_sales_pricing_policies")
        .select("service_code, service_name, list_price_inr, minimum_price_inr, max_discount_percent, active")
        .eq("organization_id", organizationId)
        .eq("service_code", serviceCode)
        .eq("active", true)
        .maybeSingle();

    if (policyError) return NextResponse.json({ error: "Could not load the approved pricing policy" }, { status: 500 });
    if (!policy) return NextResponse.json({ error: "No active founder-approved price policy exists for this service" }, { status: 409 });

    const listPrice = Number(policy.list_price_inr);
    const floorPrice = Number(policy.minimum_price_inr);
    const maxDiscount = Number(policy.max_discount_percent);
    const allowedDiscount = Math.min(requestedDiscount, maxDiscount);
    const calculatedPrice = Math.max(floorPrice, listPrice * (1 - allowedDiscount / 100));
    const finalPrice = Math.round(calculatedPrice * 100) / 100;
    const approvalRequired = requestedDiscount > maxDiscount;
    const appliedDiscount = listPrice > 0
        ? Math.round(((listPrice - finalPrice) / listPrice) * 10000) / 100
        : 0;

    const { data: lead, error: leadError } = await client
        .from("sales_leads")
        .select("id")
        .eq("id", leadId)
        .eq("organization_id", organizationId)
        .maybeSingle();

    if (leadError) return NextResponse.json({ error: "Could not verify CRM lead" }, { status: 500 });
    if (!lead) return NextResponse.json({ error: "CRM lead not found" }, { status: 404 });

    const { data: existingDeal, error: dealLookupError } = await client
        .from("ai_sales_deals")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("lead_id", leadId)
        .not("stage", "in", "(won,lost)")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (dealLookupError) return NextResponse.json({ error: "Could not load the active sales deal" }, { status: 500 });

    const dealPayload = {
        organization_id: organizationId,
        lead_id: leadId,
        service_code: serviceCode,
        stage: "negotiation",
        currency: "INR",
        list_price_inr: listPrice,
        discount_percent: appliedDiscount,
        final_price_inr: finalPrice,
        discount_approved: !approvalRequired,
        approval_required: approvalRequired,
        updated_at: new Date().toISOString(),
    };

    const dealWrite = existingDeal
        ? await client.from("ai_sales_deals").update(dealPayload).eq("id", existingDeal.id).eq("organization_id", organizationId).select("id").single()
        : await client.from("ai_sales_deals").insert(dealPayload).select("id").single();

    if (dealWrite.error || !dealWrite.data) {
        return NextResponse.json({ error: "Could not save the negotiated quote" }, { status: 500 });
    }

    await client.from("ai_sales_activity").insert({
        organization_id: organizationId,
        lead_id: leadId,
        deal_id: dealWrite.data.id,
        actor: "priya",
        event_type: "quote_calculated",
        summary: "Priya calculated a quote within the founder-approved INR discount policy",
        metadata: {
            service_code: serviceCode,
            list_price_inr: listPrice,
            requested_discount_percent: requestedDiscount,
            applied_discount_percent: appliedDiscount,
            final_price_inr: finalPrice,
            approval_required: approvalRequired,
        },
    });

    return NextResponse.json({
        success: true,
        dealId: dealWrite.data.id,
        service: policy.service_name,
        currency: "INR",
        listPriceInr: listPrice,
        appliedDiscountPercent: appliedDiscount,
        finalPriceInr: finalPrice,
        minimumPriceInr: floorPrice,
        approvalRequired,
        message: approvalRequired
            ? "This is the maximum automatically permitted offer. Any further discount requires founder approval."
            : "Quote is within the founder-approved discount policy.",
    });
}
