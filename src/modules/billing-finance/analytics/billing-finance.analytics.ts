import type { BillingFinanceSnapshot } from "../types/os";

export interface BillingFinanceAnalyticsSummary {
    collectionRate: number;
    overdueShare: number;
    mrrCoverage: number;
    paymentFailureRate: number;
    subscriptionRenewalPressure: number;
    invoiceVelocity: number;
}

export function buildBillingFinanceAnalytics(snapshot: BillingFinanceSnapshot): BillingFinanceAnalyticsSummary {
    const invoiceTotal = snapshot.invoices.reduce((s, i) => s + i.totalUsd, 0) || 1;
    const paid = snapshot.invoices.reduce((s, i) => s + i.amountPaidUsd, 0);
    const overdue = snapshot.invoices.filter((i) => (i.daysOverdue ?? 0) > 0 && i.amountDueUsd > 0).length;
    const paymentTotal = snapshot.payments.length || 1;
    const failed = snapshot.payments.filter((p) => ["failed", "declined", "error"].includes(p.status.toLowerCase())).length;
    const renewingSoon = snapshot.subscriptions.filter(
        (s) => s.daysToRenewal !== null && s.daysToRenewal >= 0 && s.daysToRenewal <= 30,
    ).length;
    const subTotal = snapshot.subscriptions.length || 1;

    return {
        collectionRate: Math.round((paid / invoiceTotal) * 100),
        overdueShare: Math.round((overdue / (snapshot.invoices.length || 1)) * 100),
        mrrCoverage: Math.round(snapshot.stats.mrrUsd),
        paymentFailureRate: Math.round((failed / paymentTotal) * 100),
        subscriptionRenewalPressure: Math.round((renewingSoon / subTotal) * 100),
        invoiceVelocity: snapshot.invoices.length,
    };
}
