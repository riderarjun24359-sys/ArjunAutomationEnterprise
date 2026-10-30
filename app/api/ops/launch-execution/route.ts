import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { validateLaunchExecution } from "@/src/lib/launch-execution";
import { opsLog } from "@/src/lib/ops-monitoring";

/** Early Access launch execution status — public summary (no secrets). */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`ops-launch-execution:${ip}`, 60, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const report = validateLaunchExecution();
    opsLog("info", "Launch execution probe", "api/ops/launch-execution", {
        decision: report.decision,
        score: report.score,
    });

    return NextResponse.json(
        {
            version: report.version,
            generatedAt: report.checkedAt,
            decision: report.decision,
            decisionRationale: report.decisionRationale,
            score: report.score,
            blockers: report.blockers,
            warnings: report.warnings,
            knownIssues: report.knownIssues,
            riskSummary: report.riskSummary,
            executiveSummary: report.executiveSummary,
            checks: report.checks,
            smokeFlow: report.smokeFlow,
            endpoints: {
                live: "/api/ops/live",
                ready: "/api/ops/ready",
                health: "/api/ops/health",
                cutover: "/api/ops/cutover",
                launchExecution: "/api/ops/launch-execution",
            },
        },
        {
            status: report.decision === "GO" ? 200 : 503,
            headers: { "Cache-Control": "no-store", "X-Launch-Decision": report.decision },
        },
    );
}
