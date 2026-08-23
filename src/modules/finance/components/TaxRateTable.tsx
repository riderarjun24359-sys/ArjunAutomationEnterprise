import { Card } from "@/src/design-os/components/primitives/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { TaxRate } from "@/src/modules/finance/types";
import { FinanceRow } from "@/src/design-os/components/primitives/FinanceRow";

interface TaxRateTableProps {
    taxRates: TaxRate[];
}

export function TaxRateTable({ taxRates }: TaxRateTableProps) {
    return (
        <Card variant="base">
            <SectionHeader title="Tax rates" description="Organization tax configuration" />
            {taxRates.length === 0 ? (
                <div className="mt-6">
                    <p className="text-center text-sm text-[var(--dos-text-secondary)]">No tax rates configured.</p>
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {taxRates.map((taxRate) => (
                        <FinanceRow key={taxRate.id}>
                            <div className="flex flex-col">
                                <p className="font-semibold text-[var(--dos-text-primary)]">{taxRate.name}</p>
                                {taxRate.isDefault ? (
                                    <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--dos-tint-success)]">Default</span>
                                ) : null}
                            </div>
                            <p className="text-lg font-bold text-[var(--dos-text-primary)] tabular-nums">{taxRate.ratePercent}%</p>
                        </FinanceRow>
                    ))}
                </div>
            )}
        </Card>
    );
}
