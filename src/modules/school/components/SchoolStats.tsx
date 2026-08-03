import { StatCard } from "@/src/components/ui/StatCard";
import type { SchDashboardStats } from "@/src/modules/school/types";

interface SchoolStatsProps { stats: SchDashboardStats | null; }

export function SchoolStats({ stats }: SchoolStatsProps) {
    const cards = [
        { title: "School Hubs", value: String(stats?.totalSchoolHubs ?? 0), detail: `${stats?.activeSchoolHubs ?? 0} active • ${stats?.campusCount ?? 0} dining areas`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.admissionCount ?? 0), detail: `${stats?.examinationCount ?? 0} examinations • ${stats?.openFeeInvoiceCount ?? 0} open feeInvoices`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallSchoolScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, feeInvoices, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-blue-600 dark:[&_p:last-child]:text-blue-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
