import type { AiHrAssistant, HrmsWorkforceSnapshot } from "../types/os";

export function buildAiHrAssistant(snapshot: Omit<HrmsWorkforceSnapshot, "assistant">): AiHrAssistant {
    const attention = [
        ...snapshot.leave
            .filter((l) => l.status.toLowerCase() === "pending")
            .slice(0, 4)
            .map((l) => `${l.employeeName} leave pending (${l.days}d)`),
        ...snapshot.recruitment
            .filter((r) => ["interview", "offer", "applied"].includes(r.stage.toLowerCase()))
            .slice(0, 3)
            .map((r) => `${r.candidateName} at ${r.stage} for ${r.openingTitle}`),
        ...snapshot.performance
            .filter((p) => p.kpiScore < 60)
            .slice(0, 3)
            .map((p) => `${p.employeeName} KPI ${p.kpiScore}`),
    ].slice(0, 8);

    const leaveRecommendations = [
        snapshot.stats.pendingLeave > 0
            ? `Approve or escalate ${snapshot.stats.pendingLeave} pending leave request(s).`
            : "Leave queue is clear.",
        snapshot.executiveWidgets.attendancePresentRate < 85
            ? `Attendance present rate ${snapshot.executiveWidgets.attendancePresentRate}% — review absences.`
            : `Attendance present rate healthy at ${snapshot.executiveWidgets.attendancePresentRate}%.`,
    ];

    const hiringInsights = [
        `${snapshot.stats.openRoles} open roles · ${snapshot.stats.candidates} candidates in pipeline.`,
        ...snapshot.executiveWidgets.recruitmentPipeline
            .slice(0, 3)
            .map((s) => `${s.stage}: ${s.count}`),
    ];

    const performanceInsights = snapshot.performance.slice(0, 5).map(
        (p) => `${p.employeeName}: rating ${p.rating}, KPI ${p.kpiScore} (${p.reviewPeriod}).`,
    );

    const dailySummary = [
        `Headcount ${snapshot.stats.headcount} across ${snapshot.stats.departments} departments.`,
        `${snapshot.stats.pendingLeave} pending leave · ${snapshot.stats.openRoles} open roles.`,
        `Payroll net ₹${Math.round(snapshot.stats.payrollNetUsd).toLocaleString()}.`,
        `${snapshot.stats.assetsAssigned} assets assigned · avg performance ${snapshot.executiveWidgets.avgPerformanceRating}.`,
    ].join(" ");

    const executiveSummary = [
        dailySummary,
        attention.length ? `Attention: ${attention.slice(0, 3).join("; ")}.` : "No critical workforce attention items.",
        leaveRecommendations[0],
    ].join(" ");

    return {
        dailySummary,
        workforceAttention: attention,
        leaveRecommendations,
        hiringInsights,
        performanceInsights,
        executiveSummary,
        generatedAt: new Date().toISOString(),
    };
}
