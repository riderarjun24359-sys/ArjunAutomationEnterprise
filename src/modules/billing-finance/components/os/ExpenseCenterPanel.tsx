import { Card } from "@/src/design-os/components/primitives/Card";
import { ExpenseForm } from "@/src/modules/finance/components/ExpenseForm";
import { ExpenseTable } from "@/src/modules/finance/components/ExpenseTable";
import type { FinanceClientOption, FinanceProjectOption, ExpenseFormValues, Expense } from "@/src/modules/finance/types";

interface ExpenseCenterPanelProps {
    expenses: Expense[];
    clients: FinanceClientOption[];
    projects: FinanceProjectOption[];
    onCreate: (values: ExpenseFormValues) => void | Promise<void>;
}

export function ExpenseCenterPanel({ expenses, clients, projects, onCreate }: ExpenseCenterPanelProps) {
    return (
        <div className="space-y-6">
            <ExpenseForm clients={clients} projects={projects} onSubmit={onCreate} />
            <ExpenseTable expenses={expenses} />
        </div>
    );
}
