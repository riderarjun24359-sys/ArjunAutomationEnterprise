import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Expense } from "@/src/modules/finance/types";

interface ExpenseTableProps {
    expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
    return (
        <section className="os-panel p-6">
            <header className="mb-6">
                <h2 className="dos-text-h2">Expenses</h2>
                <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Operational costs linked to delivery</p>
            </header>
            
            {expenses.length === 0 ? (
                <div className="rounded-[var(--dos-radius-lg)] border border-dashed border-[var(--dos-border)] p-8 text-center">
                    <p className="dos-text-secondary">No expenses recorded.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4 transition">
                            <div>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{expense.description}</p>
                                <p className="mt-1 dos-text-body-sm text-[var(--dos-text-secondary)]">
                                    {expense.category}
                                    {expense.projectName ? ` • ${expense.projectName}` : ""}
                                    {expense.clientName ? ` • ${expense.clientName}` : ""}
                                </p>
                            </div>
                            <div className="text-right dos-text-body-sm text-[var(--dos-text-secondary)]">
                                <p className="capitalize dos-text-caption">{expense.status}</p>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{formatMoney(expense.amount)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
