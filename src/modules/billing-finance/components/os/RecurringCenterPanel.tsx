import { RecurringForm } from "@/src/modules/finance/components/RecurringForm";
import { RecurringTable } from "@/src/modules/finance/components/RecurringTable";
import type { FinanceClientOption, FinanceProjectOption, RecurringInvoice } from "@/src/modules/finance/types";

interface RecurringCenterPanelProps {
    clients: FinanceClientOption[];
    projects: FinanceProjectOption[];
    recurringInvoices: RecurringInvoice[];
    onCreate: (values: unknown) => void | Promise<void>;
}

export function RecurringCenterPanel({ clients, projects, recurringInvoices, onCreate }: RecurringCenterPanelProps) {
    return (
        <div className="space-y-6">
            <RecurringForm clients={clients} projects={projects} onSubmit={onCreate} />
            <RecurringTable recurringInvoices={recurringInvoices} />
        </div>
    );
}
