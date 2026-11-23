import { NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function authorize(request: Request) {
    const secured = await secureApiRoute(request, {
        permission: "automationManage",
        rateLimit: 60,
    });
    if (secured.error) return { error: secured.error, organizationId: null, client: null };
    const organizationId = secured.context?.organizationId ?? null;
    if (!organizationId) {
        return { error: NextResponse.json({ error: "Organization context is required" }, { status: 403 }), organizationId: null, client: null };
    }
    const client = getServiceRoleClient();
    if (!client) {
        return { error: NextResponse.json({ error: "Command Centre storage is unavailable" }, { status: 503 }), organizationId: null, client: null };
    }
    return { error: null, organizationId, client };
}

export async function GET(request: Request) {
    const auth = await authorize(request);
    if (auth.error) return auth.error;
    if (!auth.client || !auth.organizationId) {
        return NextResponse.json({ error: "Command Centre storage is unavailable" }, { status: 503 });
    }
    const { data, error } = await auth.client
        .from("acc_recommendations")
        .select("id, status")
        .eq("organization_id", auth.organizationId)
        .limit(100);
    if (error) return NextResponse.json({ error: "Could not load saved recommendation states" }, { status: 500 });
    return NextResponse.json({ recommendations: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
    const auth = await authorize(request);
    if (auth.error) return auth.error;
    if (!auth.client || !auth.organizationId) {
        return NextResponse.json({ error: "Command Centre storage is unavailable" }, { status: 503 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const recommendations = body && typeof body === "object"
        ? (body as Record<string, unknown>).recommendations
        : null;
    if (!Array.isArray(recommendations) || recommendations.length > 20) {
        return NextResponse.json({ error: "A maximum of 20 recommendations is required" }, { status: 400 });
    }

    const rows = [];
    for (const value of recommendations) {
        if (!value || typeof value !== "object") {
            return NextResponse.json({ error: "Invalid recommendation record" }, { status: 400 });
        }
        const item = value as Record<string, unknown>;
        if (
            typeof item.id !== "string" || !UUID.test(item.id) ||
            typeof item.engineKey !== "string" || item.engineKey.length > 80 ||
            typeof item.title !== "string" || !item.title.trim() || item.title.length > 180 ||
            typeof item.detail !== "string" || item.detail.length > 1200 ||
            typeof item.confidence !== "number" || !Number.isFinite(item.confidence) || item.confidence < 0 || item.confidence > 1 ||
            !["low", "medium", "high", "critical"].includes(String(item.priority))
        ) {
            return NextResponse.json({ error: "Recommendation fields failed validation" }, { status: 400 });
        }
        rows.push({
            id: item.id,
            organization_id: auth.organizationId,
            engine_key: item.engineKey,
            title: item.title.trim(),
            detail: item.detail,
            confidence: Math.round(item.confidence * 100),
            priority: item.priority,
            status: "pending",
            updated_at: new Date().toISOString(),
        });
    }

    if (rows.length) {
        const { error } = await auth.client
            .from("acc_recommendations")
            .upsert(rows, { onConflict: "id", ignoreDuplicates: true });
        if (error) return NextResponse.json({ error: "Could not save recommendation records" }, { status: 500 });
    }
    return NextResponse.json({ success: true, saved: rows.length }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
    const auth = await authorize(request);
    if (auth.error) return auth.error;
    if (!auth.client || !auth.organizationId) {
        return NextResponse.json({ error: "Command Centre storage is unavailable" }, { status: 503 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "Invalid recommendation update" }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const id = typeof input.id === "string" ? input.id.trim() : "";
    const status = input.status;
    if (!UUID.test(id)) return NextResponse.json({ error: "A valid recommendation ID is required" }, { status: 400 });
    if (status !== "accepted" && status !== "dismissed") {
        return NextResponse.json({ error: "Status must be accepted or dismissed" }, { status: 400 });
    }

    const { data, error } = await auth.client
        .from("acc_recommendations")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("organization_id", auth.organizationId)
        .eq("status", "pending")
        .select("id, status")
        .maybeSingle();

    if (error) return NextResponse.json({ error: "Could not persist recommendation status" }, { status: 500 });
    if (!data) {
        return NextResponse.json({ error: "Recommendation was not found, already actioned, or is outside this organization" }, { status: 409 });
    }
    return NextResponse.json({ success: true, recommendation: data }, { headers: { "Cache-Control": "no-store" } });
}
