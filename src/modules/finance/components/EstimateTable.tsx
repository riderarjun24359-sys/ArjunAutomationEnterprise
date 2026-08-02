import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Estimate } from "@/src/modules/finance/types";

interface EstimateTableProps {
    estimates: Estimate[];
    onConvert?: (id: string) => void | Promise<void>;
}

export function EstimateTable({ estimates, onConvert }: EstimateTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Estimates" description="Proposals linked to clients and projects" />
            {estimates.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No estimates found" description="Create an estimate to start the sales pipeline." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {estimates.map((estimate) => (
                        <div key={estimate.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div>
                                <p className="font-medium">{estimate.number}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {estimate.clientName}
                                    {estimate.projectName ? ` • ${estimate.projectName}` : ""}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-right text-sm">
                                <div>
                                    <p className="capitalize">{estimate.status}</p>
                                    <p>{formatMoney(estimate.total)}</p>
                                </div>
                                {onConvert && estimate.status !== "declined" ? (
                                    <button
                                        type="button"
                                        onClick={() => void onConvert(estimate.id)}
                                        className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                                    >
                                        Convert
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
