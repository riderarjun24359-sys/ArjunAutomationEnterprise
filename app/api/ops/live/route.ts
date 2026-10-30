import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { getUptimeSeconds } from "@/src/lib/ops-monitoring";

/** Liveness — process is up. */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`ops-live:${ip}`, 240, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    return NextResponse.json(
        { status: "alive", uptimeSeconds: getUptimeSeconds(), timestamp: new Date().toISOString() },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}
