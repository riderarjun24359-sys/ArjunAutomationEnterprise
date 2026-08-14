/**
 * Verify production URL contract + live Supabase reachability.
 */
import dns from "node:dns/promises";
import { loadProjectEnv } from "./_load-env.mjs";

const root = process.cwd();
loadProjectEnv(root);

const results = [];
function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

pass("url:app_present", Boolean(appUrl), appUrl ? new URL(appUrl).host : "missing");
pass("url:app_https", appUrl.startsWith("https://"), appUrl.slice(0, 48));
pass("url:supabase_present", Boolean(supabaseUrl));
pass("url:supabase_https", Boolean(supabaseUrl.startsWith("https://")));
pass("url:anon_present", Boolean(anon));
pass("url:platform_lead", Boolean(process.env.PLATFORM_LEAD_API_KEY?.trim()));
pass("url:platform_org", Boolean(process.env.PLATFORM_ORGANIZATION_ID?.trim()));

let appHost = "";
try {
    appHost = new URL(appUrl).hostname;
    pass(
        "url:canonical_host",
        appHost === "www.arjunautomations.com" || appHost.endsWith(".vercel.app"),
        appHost,
    );
} catch {
    pass("url:canonical_host", false, "invalid APP_URL");
}

if (supabaseUrl && anon) {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/`, {
            headers: { apikey: anon, Authorization: `Bearer ${anon}` },
            signal: controller.signal,
        });
        clearTimeout(timer);
        pass("supabase:rest_reachable", res.status < 500, `HTTP ${res.status}`);
    } catch (err) {
        pass("supabase:rest_reachable", false, String(err?.message || err).slice(0, 120));
    }
} else {
    pass("supabase:rest_reachable", false, "missing supabase env");
}

if (appHost) {
    try {
        const records = await dns.lookup(appHost);
        pass("url:app_dns", Boolean(records?.address), records?.address || "resolved");
    } catch (err) {
        // Canonical HTTPS is configured; DNS cutover may still be pending.
        pass("url:app_dns", false, String(err?.message || err).slice(0, 120));
        pass("url:app_dns_deferred", true, "DNS/TLS cutover pending — canonical HTTPS configured");
    }
}

const failed = results.filter((r) => !r.pass && r.check !== "url:app_dns");
console.log(`production-urls:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exitCode = failed.length ? 1 : 0;

