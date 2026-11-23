import { NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
    const secured = await secureApiRoute(request, {
        permission: "automationManage",
        rateLimit: 30,
    });
    if (secured.error) return secured.error;

    const organizationId = secured.context?.organizationId;
    if (!organizationId) {
        return NextResponse.json({ error: "Organization context is required" }, { status: 403 });
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
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        return NextResponse.json({ error: "A valid recommendation ID is required" }, { status: 400 });
    }
    if (status !== "accepted" && status !== "dismissed") {
        return NextResponse.json({ error: "Status must be accepted or dismissed" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Command Centre storage is unavailable" }, { status: 503 });

    const { data, error } = await client
        .from("acc_recommendations")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("organization_id", organizationId)
        .eq("status", "pending")
        .select("id, status")
        .maybeSingle();

    if (error) {
        return NextResponse.json({ error: "Could not persist recommendation status" }, { status: 500 });
    }
    if (!data) {
        return NextResponse.json({ error: "Recommendation was not found, already actioned, or is outside this organization" }, { status: 409 });
    }

    return NextResponse.json({ success: true, recommendation: data }, {
        headers: { "Cache-Control": "no-store" },
    });
}
