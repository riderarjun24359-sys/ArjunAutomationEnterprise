import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { TaxRate } from "@/src/modules/finance/types";

interface TaxRateTableProps {
    taxRates: TaxRate[];
}

export function TaxRateTable({ taxRates }: TaxRateTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Tax rates" description="Organization tax configuration" />
            {taxRates.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No tax rates configured" description="Create a tax rate for invoice calculations." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {taxRates.map((taxRate) => (
                        <div key={taxRate.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div>
                                <p className="font-medium">{taxRate.name}</p>
                                {taxRate.isDefault ? (
                                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-600">Default</p>
                                ) : null}
                            </div>
                            <p className="text-lg font-semibold">{taxRate.ratePercent}%</p>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
