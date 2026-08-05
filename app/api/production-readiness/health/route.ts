import { buildProductionHealthReport } from "@/src/lib/production-health";
import { productionLog } from "@/src/lib/production-logger";
import { NextResponse } from "next/server";

export async function GET() {
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
