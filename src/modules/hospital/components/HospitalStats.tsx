import { StatCard } from "@/src/components/ui/StatCard";
import type { HspDashboardStats } from "@/src/modules/hospital/types";

interface HospitalStatsProps { stats: HspDashboardStats | null; }

export function HospitalStats({ stats }: HospitalStatsProps) {
    const cards = [
        { title: "Hospital Hubs", value: String(stats?.totalHospitalHubs ?? 0), detail: `${stats?.activeHospitalHubs ?? 0} active • ${stats?.campusCount ?? 0} dining areas`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.patientRegistrationCount ?? 0), detail: `${stats?.appointmentCount ?? 0} appointments • ${stats?.openHospitalInvoiceCount ?? 0} open hospitalInvoices`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: `${(stats?.overallHospitalScore ?? 0).toFixed(1)}`, detail: `${stats?.openFailureCount ?? 0} open failures`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, hospitalInvoices, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-cyan-600 dark:[&_p:last-child]:text-cyan-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
