import { Card } from "@/src/design-os/components/primitives/Card";
import { EstimateForm } from "@/src/modules/finance/components/EstimateForm";
import { EstimateTable } from "@/src/modules/finance/components/EstimateTable";
import type { FinanceClientOption, FinanceProjectOption, Estimate } from "@/src/modules/finance/types";
import type { EstimateFormValues } from "@/src/modules/finance/schemas";

interface EstimateCenterPanelProps {
    estimates: Estimate[];
    clients: FinanceClientOption[];
    projects: FinanceProjectOption[];
    onCreate: (values: EstimateFormValues) => void | Promise<void>;
}

export function EstimateCenterPanel({ estimates, clients, projects, onCreate }: EstimateCenterPanelProps) {
    return (
        <div className="space-y-6">
            <EstimateForm clients={clients} projects={projects} onSubmit={onCreate} />
            <EstimateTable estimates={estimates} />
        </div>
    );
}
