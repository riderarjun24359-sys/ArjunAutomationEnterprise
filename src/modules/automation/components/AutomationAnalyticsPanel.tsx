import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { AutomationAnalytics } from "@/src/modules/automation/types";

interface AutomationAnalyticsPanelProps {
    analytics: AutomationAnalytics | null;
}

export function AutomationAnalyticsPanel({ analytics }: AutomationAnalyticsPanelProps) {
    if (!analytics) {
        return (
            <Card hover>
                <SectionHeader title="Automation analytics" description="Execution trends and log distribution" />
                <div className="mt-6">
                    <EmptyState title="No analytics data" description="Analytics will populate once workflows execute." />
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Executions by status" description="Run distribution" />
                <div className="mt-6 space-y-3">
                    {analytics.executionsByStatus.map((entry) => (
                        <div key={entry.status} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <span className="capitalize">{entry.status}</span>
                            <span className="font-medium">{entry.count}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Top workflows" description="Most executed pipelines" />
                <div className="mt-6 space-y-3">
                    {analytics.topWorkflows.length === 0 ? (
                        <EmptyState title="No workflow runs" description="Execute workflows to populate analytics." />
                    ) : (
                        analytics.topWorkflows.map((entry) => (
                            <div key={entry.workflow} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span>{entry.workflow}</span>
                                <span className="font-medium">{entry.runs} runs</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Logs by level" description="Operational signal distribution" />
                <div className="mt-6 space-y-3">
                    {analytics.logsByLevel.map((entry) => (
                        <div key={entry.level} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <span className="capitalize">{entry.level}</span>
                            <span className="font-medium">{entry.count}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Performance" description="Execution timing" />
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
                    <p className="text-sm text-slate-500">Average duration</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-700 dark:text-emerald-300">{analytics.averageDurationMs}ms</p>
                </div>
            </Card>
        </div>
    );
}
