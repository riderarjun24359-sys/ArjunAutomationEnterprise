import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { assertSupabaseConfigured } from "@/src/lib/supabase-config";
import { opsLog } from "@/src/lib/ops-monitoring";

/** Readiness — dependencies required to serve traffic. */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`ops-ready:${ip}`, 120, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const checks: Array<{ name: string; ok: boolean; detail: string }> = [];

    try {
        assertSupabaseConfigured();
        checks.push({ name: "supabase_env", ok: true, detail: "NEXT_PUBLIC_SUPABASE_URL/ANON_KEY present" });
    } catch (error) {
        checks.push({
            name: "supabase_env",
            ok: false,
            detail: error instanceof Error ? error.message : "Supabase not configured",
        });
    }

    checks.push({
        name: "node_runtime",
        ok: true,
        detail: `node ${process.version}`,
    });

    const ready = checks.every((c) => c.ok);
    opsLog(ready ? "info" : "warn", "Readiness probe", "api/ops/ready", { ready });

    return NextResponse.json(
        { status: ready ? "ready" : "not_ready", checks, timestamp: new Date().toISOString() },
        { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } },
    );
}
