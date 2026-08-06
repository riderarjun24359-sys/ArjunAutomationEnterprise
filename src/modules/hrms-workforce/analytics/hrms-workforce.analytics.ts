import type { HrmsWorkforceSnapshot } from "../types/os";

export interface HrmsAnalyticsSummary {
    activeShare: number;
    leavePendingShare: number;
    recruitmentConversionPressure: number;
    trainingCompletionRate: number;
    assetUtilization: number;
    auditVelocity: number;
}

export function buildHrmsAnalytics(snapshot: HrmsWorkforceSnapshot): HrmsAnalyticsSummary {
    const totalEmp = snapshot.employees.length || 1;
    const active = snapshot.employees.filter((e) => e.status.toLowerCase() === "active").length;
    const leaveTotal = snapshot.leave.length || 1;
    const pending = snapshot.leave.filter((l) => l.status.toLowerCase() === "pending").length;
    const trainingDone = snapshot.training.filter((t) => t.progressPercent >= 100).length;
    const trainingTotal = snapshot.training.length || 1;
    const assetsAssigned = snapshot.assets.filter((a) => a.employeeId).length;
    const assetsTotal = snapshot.assets.length || 1;

    return {
        activeShare: Math.round((active / totalEmp) * 100),
        leavePendingShare: Math.round((pending / leaveTotal) * 100),
        recruitmentConversionPressure: snapshot.stats.candidates,
        trainingCompletionRate: Math.round((trainingDone / trainingTotal) * 100),
        assetUtilization: Math.round((assetsAssigned / assetsTotal) * 100),
        auditVelocity: snapshot.auditTrail.length,
    };
}
