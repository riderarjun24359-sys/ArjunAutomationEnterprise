import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { DeliveryAnalytics } from "@/src/modules/analytics/types";

interface DeliveryAnalyticsPanelProps {
    delivery: DeliveryAnalytics | null;
}

export function DeliveryAnalyticsPanel({ delivery }: DeliveryAnalyticsPanelProps) {
    if (!delivery) {
        return (
            <Card hover>
                <SectionHeader title="Delivery analytics" description="Project and task throughput" />
                <div className="mt-6">
                    <EmptyState title="No delivery data" description="Projects and tasks will populate delivery analytics." />
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Delivery summary" description="Execution health across projects and tasks" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                        { label: "Active projects", value: delivery.activeProjects },
                        { label: "Average progress", value: `${delivery.averageProgress}%` },
                        { label: "Open tasks", value: delivery.openTasks },
                        { label: "Blocked tasks", value: delivery.blockedTasks },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                            <p className="text-sm text-slate-500">{item.label}</p>
                            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Tasks by status" description="Operational workload distribution" />
                <div className="mt-6 space-y-3">
                    {delivery.tasksByStatus.length === 0 ? (
                        <EmptyState title="No tasks" description="Task records will appear here." />
                    ) : (
                        delivery.tasksByStatus.map((point) => (
                            <div key={point.label} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span className="capitalize">{point.label.replaceAll("_", " ")}</span>
                                <span className="font-medium">{point.value}</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Card hover className="xl:col-span-2">
                <SectionHeader title="Project progress" description="Delivery progress by project" />
                <div className="mt-6 space-y-3">
                    {delivery.projectProgress.length === 0 ? (
                        <EmptyState title="No projects" description="Project records will appear here." />
                    ) : (
                        delivery.projectProgress.map((point) => (
                            <div key={point.label} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <div className="flex justify-between text-sm">
                                    <span>{point.label}</span>
                                    <span className="font-medium">{point.value}%</span>
                                </div>
                                <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${point.value}%` }} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
