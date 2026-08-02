import { StatCard } from "@/src/components/ui/StatCard";
import type { DocumentsDashboardStats } from "@/src/modules/documents/types";

interface DocumentsStatsProps { stats: DocumentsDashboardStats | null; }

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function DocumentsStats({ stats }: DocumentsStatsProps) {
    const cards = [
        { title: "Total Documents", value: String(stats?.totalDocuments ?? 0), detail: `${stats?.totalFolders ?? 0} folders`, trend: "up" as const },
        { title: "Pending Approvals", value: String(stats?.pendingApprovals ?? 0), detail: `${stats?.activeShares ?? 0} active shares`, trend: "up" as const },
        { title: "Active Templates", value: String(stats?.activeTemplates ?? 0), detail: `${stats?.totalTags ?? 0} tags`, trend: "up" as const, tone: "accent" as const },
        { title: "Storage Used", value: formatBytes(stats?.totalStorageBytes ?? 0), detail: `${stats?.archivedDocuments ?? 0} archived`, trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
