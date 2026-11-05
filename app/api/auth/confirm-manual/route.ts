import { NextResponse } from "next/server";
import { getSupabaseUrl } from "@/src/lib/supabase-config";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { isSuccessfulManualVerifyRedirect } from "@/src/lib/manual-verification-response";

const APP_CALLBACK = "https://www.arjunautomations.com/auth/callback";
const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Completes a Supabase signup/invite verification link whose original
 * redirect was misconfigured. Only the configured HTTPS Supabase host and
 * signup/invite verification tokens are accepted; the outbound redirect is
 * fixed to our own callback and is never followed by this server.
 */
export async function POST(request: Request) {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`auth-confirm-manual:${ip}`, 5, 60_000);
    if (!rate.allowed) {
        return NextResponse.json(
            { error: "Rate limited. Minute lo muppudu try cheyandi." },
            { status: 429, headers: NO_STORE },
        );
    }

    const configured = getSupabaseUrl();
    if (!configured) {
        return NextResponse.json({ error: "Server configuration missing." }, { status: 500, headers: NO_STORE });
    }

    let linkRaw: unknown;
    try {
        linkRaw = (await request.json())?.link;
    } catch {
        return NextResponse.json({ error: "Invalid body." }, { status: 400, headers: NO_STORE });
    }

    if (typeof linkRaw !== "string" || linkRaw.length > 2048) {
        return NextResponse.json(
            { error: "Paste chesina link valid ga kanipinchaledu." },
            { status: 400, headers: NO_STORE },
        );
    }

    let parsed: URL;
    let configuredUrl: URL;
    try {
        parsed = new URL(linkRaw.trim());
        configuredUrl = new URL(configured);
    } catch {
        return NextResponse.json(
            { error: "Link URL aniga parse avvataledu. Full link paste cheyandi." },
            { status: 400, headers: NO_STORE },
        );
    }

    if (
        configuredUrl.protocol !== "https:" ||
        parsed.protocol !== "https:" ||
        parsed.origin !== configuredUrl.origin ||
        parsed.username !== "" ||
        parsed.password !== ""
    ) {
        return NextResponse.json(
            { error: "Ivi mana Supabase project link kaadu (host verification fail). Email lo unna poorti link paste cheyandi." },
            { status: 400, headers: NO_STORE },
        );
    }

    if (parsed.pathname !== "/auth/v1/verify") {
        return NextResponse.json(
            { error: "Idi verification link kaadu. Email lo 'Confirm your email' button meede full link kavali." },
            { status: 400, headers: NO_STORE },
        );
    }

    const type = parsed.searchParams.get("type");
    const token = parsed.searchParams.get("token");
    const tokenHash = parsed.searchParams.get("token_hash");
    if (!["signup", "invite"].includes(type ?? "") || Boolean(token) === Boolean(tokenHash)) {
        return NextResponse.json(
            { error: "Signup/invite verification token valid ga ledu. Kotha confirmation link request cheyandi." },
            { status: 400, headers: NO_STORE },
        );
    }

    // Discard every caller-controlled query parameter except the one-time
    // verification material and its constrained flow type.
    parsed.search = "";
    parsed.searchParams.set("type", type!);
    parsed.searchParams.set(token ? "token" : "token_hash", (token ?? tokenHash)!);
    parsed.searchParams.set("redirect_to", APP_CALLBACK);
    parsed.hash = "";

    try {
        const res = await fetch(parsed.toString(), { redirect: "manual" });
        const confirmed = isSuccessfulManualVerifyRedirect({
            status: res.status,
            location: res.headers.get("location"),
        });

        if (confirmed) {
            return NextResponse.json({ ok: true, confirmed: true }, { headers: NO_STORE });
        }

        return NextResponse.json(
            { error: "Supabase verification could not be confirmed. Link expire ayyi vundachu — kotha confirmation link request cheyandi." },
            { status: 502, headers: NO_STORE },
        );
    } catch {
        return NextResponse.json(
            { error: "Verification server contact fail. Konchem sepu tarvata malli try cheyandi." },
            { status: 502, headers: NO_STORE },
        );
    }
}
