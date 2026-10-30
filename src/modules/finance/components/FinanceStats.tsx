import { StatCard } from "@/src/components/ui/StatCard";
import type { FinanceDashboardStats } from "@/src/modules/finance/types";

interface FinanceStatsProps {
    stats: FinanceDashboardStats | null;
}

export function FinanceStats({ stats }: FinanceStatsProps) {
    const cards = [
        { title: "Paid Revenue", value: stats?.paidRevenue ?? "₹0", detail: `${stats?.paymentCount ?? 0} payments`, trend: "up" as const, tone: "accent" as const },
        { title: "Outstanding AR", value: stats?.outstandingReceivables ?? "₹0", detail: `${stats?.overdueInvoices ?? 0} overdue`, trend: stats?.overdueInvoices ? ("down" as const) : ("up" as const) },
        { title: "Approved Expenses", value: stats?.approvedExpenses ?? "₹0", detail: `Total ${stats?.totalExpenses ?? "₹0"}`, trend: "up" as const },
        { title: "Net Position", value: stats?.netPosition ?? "₹0", detail: `${stats?.activeRecurring ?? 0} recurring`, trend: "up" as const },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />
            ))}
        </section>
    );
}
