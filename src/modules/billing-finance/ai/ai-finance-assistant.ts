import type { AiFinanceAssistant, BillingFinanceSnapshot } from "../types/os";

export function buildAiFinanceAssistant(snapshot: Omit<BillingFinanceSnapshot, "assistant">): AiFinanceAssistant {
    const overdue = snapshot.invoices
        .filter((i) => (i.daysOverdue ?? 0) > 0 && i.amountDueUsd > 0)
        .slice(0, 6)
        .map((i) => `${i.accountOrClient} invoice ${i.number} overdue ${i.daysOverdue}d ($${Math.round(i.amountDueUsd)})`);

    const failed = snapshot.payments
        .filter((p) => ["failed", "declined", "error"].includes(p.status.toLowerCase()))
        .slice(0, 4)
        .map((p) => `${p.accountOrClient} payment failed $${Math.round(p.amountUsd)}`);

    const attention = [...overdue, ...failed].slice(0, 8);

    const collectionRecommendations = [
        snapshot.stats.outstandingUsd > 0
            ? `Pursue $${Math.round(snapshot.stats.outstandingUsd).toLocaleString()} outstanding across ${snapshot.stats.openInvoices} open invoices.`
            : "Outstanding balance is clear — maintain collection cadence.",
        snapshot.executiveWidgets.openCollectionCases > 0
            ? `Escalate ${snapshot.executiveWidgets.openCollectionCases} open collection case(s).`
            : "No open collection cases.",
        snapshot.executiveWidgets.collectionRate < 85
            ? `Collection rate ${snapshot.executiveWidgets.collectionRate}% — tighten payment reminders.`
            : `Collection rate healthy at ${snapshot.executiveWidgets.collectionRate}%.`,
    ];

    const subscriptionInsights = snapshot.subscriptions.slice(0, 5).map((s) => {
        if (s.daysToRenewal !== null && s.daysToRenewal <= 30) {
            return `${s.accountName} · ${s.planName} renews in ${s.daysToRenewal}d (MRR $${Math.round(s.mrrUsd)}).`;
        }
        return `${s.accountName} · ${s.planName} · ${s.status} · MRR $${Math.round(s.mrrUsd)}.`;
    });

    const csExpansionHint =
        snapshot.invoices.length > 0 && snapshot.revenue.mrrTrend === "up"
            ? "Revenue trending up — coordinate expansion with Customer Success."
            : "Align billing health signals with Customer Success and CRM accounts.";

    const revenueInsights = [
        `MRR $${Math.round(snapshot.revenue.mrrUsd).toLocaleString()} (${snapshot.revenue.mrrTrend}).`,
        `ARR $${Math.round(snapshot.revenue.arrUsd).toLocaleString()}.`,
        `Collected $${Math.round(snapshot.revenue.collectedUsd).toLocaleString()} · ${snapshot.revenue.activeSubscriptions} active subscriptions.`,
        csExpansionHint,
    ];

    const dailySummary = [
        `${snapshot.stats.activeSubscriptions} active subscriptions.`,
        `MRR $${Math.round(snapshot.stats.mrrUsd).toLocaleString()} / ARR $${Math.round(snapshot.stats.arrUsd).toLocaleString()}.`,
        `Outstanding $${Math.round(snapshot.stats.outstandingUsd).toLocaleString()}.`,
        `${snapshot.stats.failedPayments} failed payments · ${snapshot.stats.openInvoices} open invoices.`,
    ].join(" ");

    const executiveSummary = [
        dailySummary,
        attention.length ? `Attention: ${attention.slice(0, 3).join("; ")}.` : "No critical billing attention items.",
        collectionRecommendations[0],
    ].join(" ");

    return {
        dailySummary,
        accountsNeedingAttention: attention,
        collectionRecommendations,
        subscriptionInsights,
        revenueInsights,
        executiveSummary,
        generatedAt: new Date().toISOString(),
    };
}
