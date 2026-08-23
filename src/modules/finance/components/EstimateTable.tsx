import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Estimate } from "@/src/modules/finance/types";
import { cn } from "@/src/lib/cn";
import { FinanceRow } from "@/src/design-os/components/primitives/FinanceRow";

interface EstimateTableProps {
    estimates: Estimate[];
    onConvert?: (id: string) => void | Promise<void>;
}

export function EstimateTable({ estimates, onConvert }: EstimateTableProps) {
    return (
        <section className="os-panel p-6">
            <header className="mb-6">
                <h2 className="dos-text-h2">Estimates</h2>
                <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Proposals linked to clients and projects</p>
            </header>
            
            {estimates.length === 0 ? (
                <div className="rounded-[var(--dos-radius-lg)] border border-dashed border-[var(--dos-border)] p-8 text-center">
                    <p className="dos-text-secondary">No estimates found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {estimates.map((estimate) => (
                        <FinanceRow key={estimate.id}>
                            <div>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{estimate.number}</p>
                                <p className="mt-1 dos-text-body-sm text-[var(--dos-text-secondary)]">
                                    {estimate.clientName}
                                    {estimate.projectName ? ` • ${estimate.projectName}` : ""}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-right dos-text-body-sm text-[var(--dos-text-secondary)]">
                                <div>
                                    <p className="capitalize dos-text-caption">{estimate.status}</p>
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{formatMoney(estimate.total)}</p>
                                </div>
                                {onConvert && estimate.status !== "declined" ? (
                                    <button
                                        type="button"
                                        onClick={() => void onConvert(estimate.id)}
                                        className="rounded-full border border-[var(--dos-border)] px-4 py-1.5 text-xs font-semibold hover:border-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary)] transition"
                                    >
                                        Convert
                                    </button>
                                ) : null}
                            </div>
                        </FinanceRow>
                    ))}
                </div>
            )}
        </section>
    );
}
