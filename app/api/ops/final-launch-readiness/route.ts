import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { validateFinalLaunchReadiness } from "@/src/lib/final-launch-readiness";
import { opsLog } from "@/src/lib/ops-monitoring";

/** Final launch readiness — public summary (no secrets). */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`ops-final-launch:${ip}`, 60, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const report = validateFinalLaunchReadiness();
    opsLog("info", "Final launch readiness probe", "api/ops/final-launch-readiness", {
        score: report.score,
        decision: report.decision,
    });

    return NextResponse.json(
        {
            version: report.version,
            generatedAt: report.checkedAt,
            score: report.score,
            decision: report.decision,
            decisionRationale: report.decisionRationale,
            executiveSummary: report.executiveSummary,
            journeySteps: report.journeySteps,
            critical: report.critical.map((i) => ({ id: i.id, title: i.title, detail: i.detail })),
            high: report.high.map((i) => ({ id: i.id, title: i.title, detail: i.detail })),
            medium: report.medium.map((i) => ({ id: i.id, title: i.title, detail: i.detail })),
            nice: report.nice.map((i) => ({ id: i.id, title: i.title, detail: i.detail })),
            checks: report.checks,
        },
        {
            status: report.decision === "GO" ? 200 : 503,
            headers: {
                "Cache-Control": "no-store",
                "X-Launch-Decision": report.decision,
                "X-Launch-Score": String(report.score),
            },
        },
    );
}
