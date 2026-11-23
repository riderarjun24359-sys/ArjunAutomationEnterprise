import { StatCard } from "@/src/components/ui/StatCard";
import type { BrvDashboardStats } from "@/src/modules/billing-revenue/types";

interface BillingRevenueStatsProps { stats: BrvDashboardStats | null; }

export function BillingRevenueStats({ stats }: BillingRevenueStatsProps) {
    const cards = [
        { title: "MRR", value: "Unverified", detail: "Legacy amount fields have no verified INR conversion", trend: "flat" as const, tone: "accent" as const },
        { title: "ARR", value: "Unverified", detail: "Currency conversion is not configured; no INR total shown", trend: "flat" as const },
        { title: "Payments", value: String(stats?.failedPaymentCount ?? 0), detail: `${stats?.collectionCaseCount ?? 0} collection cases • failed payment count`, trend: "flat" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Billing, payments, revenue, invoice, and collection audit entries", trend: "flat" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-amber-600 dark:[&_p:last-child]:text-amber-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
