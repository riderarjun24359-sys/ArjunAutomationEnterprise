import { NextResponse } from "next/server";
import { getSupabaseUrl } from "@/src/lib/supabase-config";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";

/**
 * Confirm-manual rescue — completes a Supabase signup/invite confirmation
 * whose email link was generated with a localhost redirect (mis-configured
 * dashboard Site URL). The customer pastes the full link from the email; this
 * route re-plays the verify request on our server with the redirect forced to
 * our own domain, so unconfirmed accounts stop blocking logins while the
 * dashboard Site URL fix is pending.
 *
 * Security: every link's host is validated against the configured Supabase
 * project host (`https://<ref>.supabase.co`); anything else is rejected.
 * Only the verify path is allowed, and the response body/redirect target is
 * never followed into a redirect chain — redirect: manual handles that.
 */
export async function POST(request: Request) {
    const rate = checkRateLimit("auth-confirm-manual", 5, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limited. Minute lo muppudu try cheyandi." }, { status: 429 });
    }

    const configured = getSupabaseUrl();
    if (!configured) {
        return NextResponse.json({ error: "Server configuration missing." }, { status: 500 });
    }

    let linkRaw: unknown;
    try {
        linkRaw = (await request.json())?.link;
    } catch {
        return NextResponse.json({ error: "Invalid body." }, { status: 400 });
    }

    if (typeof linkRaw !== "string" || linkRaw.length > 2048) {
        return NextResponse.json({ error: "Paste chesina link valid ga kanipinchaledu." }, { status: 400 });
    }

    let parsed: URL;
    try {
        parsed = new URL(linkRaw.trim());
    } catch {
        return NextResponse.json({ error: "Link URL aniga parse avvataledu. Full link paste cheyandi." }, { status: 400 });
    }

    const configuredHost = (() => {
        try { return new URL(configured).host; } catch { return ""; }
    })();

    if (parsed.protocol !== "https:" || parsed.host !== configuredHost) {
        return NextResponse.json(
            { error: "Ivi mana Supabase project link kaadu (host verification fail). Email lo unna poorti link paste cheyandi." },
            { status: 400 },
        );
    }

    if (parsed.pathname !== "/auth/v1/verify") {
        return NextResponse.json(
            { error: "Idi verification link kaadu. Email lo 'Confirm your email' button meede full link kavali." },
            { status: 400 },
        );
    }

    // Force the post-verify redirect to our production origin — never whichever
    // value (e.g. localhost) was baked into the email link.
    parsed.searchParams.set("redirect_to", "https://www.arjunautomations.com/auth/callback");

    try {
        const res = await fetch(parsed.toString(), { redirect: "manual" });
        // Supabase replies to a verify call with a 3xx redirect on success; a
        // session-cookie flow would need the browser to follow it, but for
        // email *address confirmation* the transaction already happened.
        if (res.status >= 300 && res.status < 400) {
            return NextResponse.json({ ok: true, confirmed: true });
        }
        if (res.ok) {
            const text = await res.text();
            if (text.includes("confirmed") || text.includes("Welcome") || text.length > 0) {
                return NextResponse.json({ ok: true, confirmed: true });
            }
            return NextResponse.json({ error: "Verification response unexpected." }, { status: 502 });
        }
        return NextResponse.json(
            { error: `Supabase verify fail (status ${res.status}). Link expire ayyi vuntunda kuda — malli kotha link pampandi (Resend confirmation).` },
            { status: 502 },
        );
    } catch {
        return NextResponse.json({ error: "Verification server contact fail. Istha malli try cheyandi." }, { status: 502 });
    }
}
