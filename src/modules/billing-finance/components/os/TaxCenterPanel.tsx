import { TaxRateForm } from "@/src/modules/finance/components/TaxRateForm";
import { TaxRateTable } from "@/src/modules/finance/components/TaxRateTable";
import type { TaxRate } from "@/src/modules/finance/types";
import type { TaxRateFormValues } from "@/src/modules/finance/schemas";

interface TaxCenterPanelProps {
    taxRates: TaxRate[];
    onSubmit: (values: TaxRateFormValues) => void | Promise<void>;
}

export function TaxCenterPanel({ taxRates, onSubmit }: TaxCenterPanelProps) {
    return (
        <div className="space-y-6">
            <TaxRateForm onSubmit={onSubmit} />
            <TaxRateTable taxRates={taxRates} />
        </div>
    );
}
