import { StatCard } from "@/src/components/ui/StatCard";
import type { BrvDashboardStats } from "@/src/modules/billing-revenue/types";

interface BillingRevenueStatsProps { stats: BrvDashboardStats | null; }

export function BillingRevenueStats({ stats }: BillingRevenueStatsProps) {
    const cards = [
        { title: "MRR", value: `$${(stats?.mrrUsd ?? 0).toFixed(0)}`, detail: `${stats?.activeBillingAccounts ?? 0} active accounts • ${stats?.totalBillingAccounts ?? 0} total`, trend: "up" as const, tone: "accent" as const },
        { title: "ARR", value: `$${(stats?.arrUsd ?? 0).toFixed(0)}`, detail: `Outstanding $${(stats?.outstandingBalanceUsd ?? 0).toFixed(0)} • ${stats?.openInvoiceCount ?? 0} open invoices`, trend: "up" as const },
        { title: "Payments", value: String(stats?.failedPaymentCount ?? 0), detail: `${stats?.collectionCaseCount ?? 0} collection cases • failed payment count`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Billing, payments, revenue, invoice, and collection audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-amber-600 dark:[&_p:last-child]:text-amber-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
