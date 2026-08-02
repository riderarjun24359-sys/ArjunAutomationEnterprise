import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { AutomationInsights } from "@/src/modules/analytics/types";

interface AutomationInsightsPanelProps {
    automation: AutomationInsights | null;
}

export function AutomationInsightsPanel({ automation }: AutomationInsightsPanelProps) {
    if (!automation) {
        return (
            <Card hover>
                <SectionHeader title="Automation insights" description="Workflow execution performance" />
                <div className="mt-6">
                    <EmptyState title="No automation data" description="Workflow executions will populate automation insights." />
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Automation summary" description="Workflow health and execution outcomes" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                        { label: "Active workflows", value: automation.activeWorkflows },
                        { label: "Success rate", value: `${automation.successRate}%` },
                        { label: "Completed runs", value: automation.completedExecutions },
                        { label: "Failed runs", value: automation.failedExecutions },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                            <p className="text-sm text-slate-500">{item.label}</p>
                            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Executions by status" description="Run distribution" />
                <div className="mt-6 space-y-3">
                    {automation.executionsByStatus.length === 0 ? (
                        <EmptyState title="No executions" description="Run workflows to populate execution analytics." />
                    ) : (
                        automation.executionsByStatus.map((point) => (
                            <div key={point.label} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span className="capitalize">{point.label}</span>
                                <span className="font-medium">{point.value}</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Card hover className="xl:col-span-2">
                <SectionHeader title="Top workflows" description="Most executed automation pipelines" />
                <div className="mt-6 space-y-3">
                    {automation.topWorkflows.length === 0 ? (
                        <EmptyState title="No workflow ranking" description="Workflow execution counts will appear here." />
                    ) : (
                        automation.topWorkflows.map((point) => (
                            <div key={point.label} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <span>{point.label}</span>
                                <span className="font-medium">{point.value} runs</span>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
