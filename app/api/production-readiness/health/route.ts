import { buildProductionHealthReport } from "@/src/lib/production-health";
import { productionLog } from "@/src/lib/production-logger";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`health:${ip}`, 120, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Cache-Control": "no-store" } });
    }

    productionLog("info", "Health check requested", "api/production-readiness/health");
    const report = buildProductionHealthReport();
    return NextResponse.json(report, {
        status: report.status === "critical" ? 503 : 200,
        headers: {
            "Cache-Control": "no-store",
            "X-Health-Score": String(report.score),
        },
    });
}
