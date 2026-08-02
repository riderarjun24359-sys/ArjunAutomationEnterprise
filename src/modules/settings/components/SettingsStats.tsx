import { StatCard } from "@/src/components/ui/StatCard";
import type { SettingsDashboardStats } from "@/src/modules/settings/types";

interface SettingsStatsProps {
    stats: SettingsDashboardStats | null;
}

export function SettingsStats({ stats }: SettingsStatsProps) {
    const cards = [
        { title: "Teams", value: stats?.teamCount ?? "0", detail: `${stats?.memberCount ?? 0} members`, trend: "up" as const },
        { title: "Pending Invites", value: stats?.pendingInvitations ?? "0", detail: "Awaiting acceptance", trend: "up" as const },
        { title: "Active API Keys", value: stats?.activeApiKeys ?? "0", detail: "Integrations enabled", trend: "up" as const, tone: "accent" as const },
        { title: "Roles", value: stats?.roleCount ?? "0", detail: `${stats?.backupConfigs ?? 0} backup configs`, trend: "up" as const },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />
            ))}
        </section>
    );
}
