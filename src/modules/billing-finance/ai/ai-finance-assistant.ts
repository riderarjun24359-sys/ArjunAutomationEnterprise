import type { AiFinanceAssistant, BillingFinanceSnapshot } from "../types/os";

export function buildAiFinanceAssistant(snapshot: Omit<BillingFinanceSnapshot, "assistant">): AiFinanceAssistant {
    const overdue = snapshot.invoices
        .filter((i) => (i.daysOverdue ?? 0) > 0)
        .slice(0, 6)
        .map((i) => `${i.accountOrClient} invoice ${i.number} overdue ${i.daysOverdue}d (amount not verified)`);

    const failed = snapshot.payments
        .filter((p) => ["failed", "declined", "error"].includes(p.status.toLowerCase()))
        .slice(0, 4)
        .map((p) => `${p.accountOrClient} payment failed (amount not verified)`);

    const attention = [...overdue, ...failed].slice(0, 8);
    const collectionRecommendations = [
        "Do not report or pursue an aggregate balance until invoice currency and settlement reconciliation are verified.",
        snapshot.executiveWidgets.openCollectionCases > 0
            ? `Review ${snapshot.executiveWidgets.openCollectionCases} open collection case(s).`
            : "No open collection cases.",
        "Reconcile Razorpay settlements against exact INR invoices/deals before reporting collection performance.",
    ];
    const subscriptionInsights = snapshot.subscriptions.slice(0, 5).map((s) =>
        `${s.accountName} · ${s.planName} · ${s.status} · renewal timing only; MRR not verified.`,
    );
    const revenueInsights = [
        "MRR not verified — Razorpay settlement-to-invoice/deal reconciliation pending.",
        "ARR not verified — recurring INR settlement basis not established.",
        "Collected revenue not verified — settlement events are not yet reconciled to exact INR invoices/deals.",
        "CRM estimates and legacy USD snapshots are excluded from revenue reporting.",
    ];
    const dailySummary = [
        `${snapshot.stats.activeSubscriptions} active subscriptions (operational count only).`,
        "MRR, ARR, collections and outstanding balances not verified.",
        `${snapshot.stats.failedPayments} failed payments · ${snapshot.stats.openInvoices} open invoices (counts only).`,
    ].join(" ");
    const executiveSummary = [
        dailySummary,
        attention.length ? `Attention: ${attention.slice(0, 3).join("; ")}.` : "No verified billing attention items.",
        collectionRecommendations[0],
    ].join(" ");
    return { dailySummary, accountsNeedingAttention: attention, collectionRecommendations, subscriptionInsights, revenueInsights, executiveSummary, generatedAt: new Date().toISOString() };
}
