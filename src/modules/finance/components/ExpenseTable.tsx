import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Expense } from "@/src/modules/finance/types";

interface ExpenseTableProps {
    expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Expenses" description="Operational costs linked to delivery" />
            {expenses.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No expenses recorded" description="Create an expense to track operational costs." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div>
                                <p className="font-medium">{expense.description}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {expense.category}
                                    {expense.projectName ? ` • ${expense.projectName}` : ""}
                                    {expense.clientName ? ` • ${expense.clientName}` : ""}
                                </p>
                            </div>
                            <div className="text-right text-sm">
                                <p className="capitalize">{expense.status}</p>
                                <p className="font-medium">{formatMoney(expense.amount)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
