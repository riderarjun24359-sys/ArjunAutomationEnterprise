import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { AutomationLog } from "@/src/modules/automation/types";

interface AutomationLogTableProps {
    logs: AutomationLog[];
}

export function AutomationLogTable({ logs }: AutomationLogTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Automation logs" description="Operational events across workflows and executions" />
            {logs.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No logs recorded" description="Automation activity will appear here as workflows run." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <span className={`mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium uppercase ${log.level === "error" ? "bg-rose-100 text-rose-700" : log.level === "warn" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
                                {log.level}
                            </span>
                            <div className="flex-1">
                                <p className="font-medium">{log.message}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {log.workflowName ?? "System"} • {log.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
