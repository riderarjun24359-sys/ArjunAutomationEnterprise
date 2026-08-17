import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { ClientAnalytics } from "@/src/modules/analytics/types";

interface ClientAnalyticsPanelProps {
    clients: ClientAnalytics | null;
}

export function ClientAnalyticsPanel({ clients }: ClientAnalyticsPanelProps) {
    if (!clients) {
        return (
            <Card hover>
                <SectionHeader title="Client analytics" description="Portfolio health and revenue concentration" />
                <div className="mt-6">
                    <EmptyState title="No client data" description="Client records will populate portfolio analytics." />
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Portfolio summary" description="Client lifecycle and risk signals" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                        { label: "Active clients", value: clients.activeClients },
                        { label: "At-risk clients", value: clients.atRiskClients },
                        { label: "Qualified leads", value: clients.leads },
                        { label: "Portfolio revenue", value: `$${clients.totalRevenue.toLocaleString()}` },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                            <p className="text-sm text-slate-500">{item.label}</p>
                            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Clients by stage" description="Lifecycle distribution" />
                <div className="mt-6 space-y-3">
                    {clients.clientsByStage.length === 0 ? (
                        <EmptyState title="No lifecycle data" description="Client stages will appear here." />
                    ) : (
                        clients.clientsByStage.map((point) => (
                            <div key={point.label} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span className="capitalize">{point.label}</span>
                                <span className="font-medium">{point.value}</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Card hover className="xl:col-span-2">
                <SectionHeader title="Top clients by revenue" description="Revenue concentration" />
                <div className="mt-6 space-y-3">
                    {clients.topClients.length === 0 ? (
                        <EmptyState title="No revenue ranking" description="Client revenue data will appear here." />
                    ) : (
                        clients.topClients.map((point) => (
                            <div key={point.label} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span>{point.label}</span>
                                <span className="font-medium">${point.value.toLocaleString()}</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
