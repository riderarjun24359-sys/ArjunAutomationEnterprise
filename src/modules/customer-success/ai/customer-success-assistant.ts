import type { AiCustomerSuccessAssistant, CustomerSuccessSnapshot } from "../types/os";

export function buildAiCustomerSuccessAssistant(snapshot: Omit<CustomerSuccessSnapshot, "assistant">): AiCustomerSuccessAssistant {
    const attention = [
        ...snapshot.churnPrevention.filter((c) => c.riskScore >= 60).map((c) => `${c.clientName} (churn ${c.riskScore})`),
        ...snapshot.healthCenter.filter((h) => h.overallHealthScore < 55).map((h) => `${h.clientName} (health ${h.overallHealthScore})`),
        ...snapshot.renewals
            .filter((r) => r.daysRemaining !== null && r.daysRemaining <= 30 && r.aiRenewalRisk !== "low")
            .map((r) => `${r.clientName} renewal in ${r.daysRemaining}d`),
    ].slice(0, 8);

    const renewalRecommendations = snapshot.renewals.slice(0, 5).map((r) => {
        if (r.aiRenewalRisk === "critical" || r.aiRenewalRisk === "high") {
            return `Prioritize ${r.clientName}: probability ${r.renewalProbability}%, risk ${r.aiRenewalRisk}.`;
        }
        return `Maintain cadence for ${r.clientName} (${r.renewalProbability}% probability).`;
    });

    const expansionRecommendations = snapshot.expansion.slice(0, 5).map(
        (e) => `${e.kind.replace("_", "-")} — ${e.title}: score ${e.opportunityScore}, value ₹${Math.round(e.expansionValueUsd).toLocaleString()}.`,
    );

    const healthInsights = snapshot.healthCenter.slice(0, 5).map((h) => h.executiveSummary);

    const dailySummary = [
        `Tracking ${snapshot.stats.customersTracked} customers with average health ${snapshot.stats.averageHealth}.`,
        `${snapshot.stats.renewalsNext30Days} renewals due in 30 days.`,
        `${snapshot.stats.highChurnRisk} high churn risks.`,
        `Expansion pipeline ₹${Math.round(snapshot.stats.expansionPipelineUsd).toLocaleString()}.`,
        `NRR signal ${snapshot.stats.netRevenueRetention}.`,
    ].join(" ");

    const executiveSummary = [
        dailySummary,
        attention.length ? `Attention: ${attention.slice(0, 3).join("; ")}.` : "No critical attention items.",
        expansionRecommendations[0] ? `Top expansion: ${expansionRecommendations[0]}` : "No expansion opportunities yet.",
    ].join(" ");

    return {
        dailySummary,
        customersNeedingAttention: attention,
        renewalRecommendations,
        expansionRecommendations,
        healthInsights,
        executiveSummary,
        generatedAt: new Date().toISOString(),
    };
}
