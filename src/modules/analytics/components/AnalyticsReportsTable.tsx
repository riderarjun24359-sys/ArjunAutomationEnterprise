import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { AnalyticsReport } from "@/src/modules/analytics/types";

interface AnalyticsReportsTableProps {
    reports: AnalyticsReport[];
    onPublish: (reportId: string) => Promise<void>;
}

export function AnalyticsReportsTable({ reports, onPublish }: AnalyticsReportsTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Analytics reports" description="Saved and published performance reports" />
            <div className="mt-6 space-y-3">
                {reports.length === 0 ? (
                    <EmptyState title="No reports" description="Create a report to save analytics snapshots." />
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-medium">{report.name}</p>
                                    <p className="text-sm capitalize text-slate-500 dark:text-slate-400">
                                        {report.reportType} • {report.status}
                                        {report.generatedAt ? ` • ${new Date(report.generatedAt).toLocaleString()}` : ""}
                                    </p>
                                </div>
                                {report.status === "draft" ? (
                                    <button
                                        type="button"
                                        onClick={() => void onPublish(report.id)}
                                        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                                    >
                                        Publish
                                    </button>
                                ) : (
                                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {report.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
