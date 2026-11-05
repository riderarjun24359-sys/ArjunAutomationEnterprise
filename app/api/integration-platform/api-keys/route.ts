import { createHash, randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/src/lib/supabase-server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { checkRateLimitDb } from "@/src/lib/rate-limiter-db";

export const runtime = "nodejs";

const issueKeySchema = z.object({
    integrationHubId: z.string().uuid(),
    keyName: z.string().trim().min(1).max(80),
    apiVersion: z.enum(["v1", "v2", "v3"]).default("v1"),
}).strict();

const KEY_MANAGEMENT_ROLES = new Set(["super_admin", "admin", "founder", "owner"]);

export async function POST(request: NextRequest) {
    const origin = request.headers.get("origin");
    if (!origin || origin !== request.nextUrl.origin) {
        return NextResponse.json({ error: "Forbidden request origin" }, { status: 403 });
    }

    const authClient = await supabaseServer();
    if (!authClient) {
        return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 });
    }

    const { data: authData, error: authError } = await authClient.auth.getUser();
    if (authError || !authData.user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const parsed = issueKeySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid API key request" }, { status: 400 });
    }

    const rateLimit = await checkRateLimitDb("api-key-issue:" + authData.user.id, 5, 60_000);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: "Too many API key issuance attempts. Try again shortly." },
            { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000))) } },
        );
    }

    const admin = getServiceRoleClient();
    if (!admin) {
        return NextResponse.json({ error: "API key service unavailable" }, { status: 503 });
    }

    try {
        const { data: profile, error: profileError } = await admin
            .from("user_profiles")
            .select("id")
            .eq("auth_user_id", authData.user.id)
            .maybeSingle();

        if (profileError || !profile) {
            return NextResponse.json({ error: "Organization access denied" }, { status: 403 });
        }

        // Resolve the organization from the selected hub, never from client input.
        const { data: hub, error: hubError } = await admin
            .from("intg_integration_hubs")
            .select("id, organization_id")
            .eq("id", parsed.data.integrationHubId)
            .maybeSingle();

        if (hubError || !hub) {
            return NextResponse.json({ error: "Integration hub not found" }, { status: 404 });
        }

        const { data: membership, error: membershipError } = await admin
            .from("organization_members")
            .select("role_name")
            .eq("organization_id", hub.organization_id)
            .eq("user_id", profile.id)
            .eq("is_active", true)
            .maybeSingle();

        if (membershipError || !membership || !KEY_MANAGEMENT_ROLES.has(membership.role_name)) {
            return NextResponse.json({ error: "You are not authorized to issue API keys for this organization" }, { status: 403 });
        }

        const prefix = `aa_${randomBytes(6).toString("hex")}`;
        const token = `${prefix}.${randomBytes(32).toString("base64url")}`;
        const keyHash = createHash("sha256").update(token, "utf8").digest("hex");

        const { data: created, error: insertError } = await admin
            .from("intg_api_keys")
            .insert({
                organization_id: hub.organization_id,
                hub_id: hub.id,
                key_name: parsed.data.keyName,
                key_prefix: prefix,
                key_hash: keyHash,
                api_version: parsed.data.apiVersion,
                status: "active",
            })
            .select("id, key_name, key_prefix, api_version, status, created_at")
            .single();

        if (insertError || !created) {
            if (insertError?.code === "23505") {
                return NextResponse.json({ error: "An API key with this name already exists in the selected hub." }, { status: 409 });
            }
            return NextResponse.json({ error: "Unable to issue API key" }, { status: 500 });
        }

        return NextResponse.json(
            { key: created, token },
            { status: 201, headers: { "Cache-Control": "no-store, max-age=0" } },
        );
    } catch {
        return NextResponse.json({ error: "Unable to issue API key" }, { status: 500 });
    }
}
