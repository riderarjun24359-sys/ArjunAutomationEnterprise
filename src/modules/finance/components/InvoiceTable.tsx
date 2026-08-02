import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Invoice } from "@/src/modules/finance/types";

interface InvoiceTableProps {
    invoices: Invoice[];
    selectedInvoiceId?: string | null;
    onSelectInvoice: (id: string) => void;
}

export function InvoiceTable({ invoices, selectedInvoiceId, onSelectInvoice }: InvoiceTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Invoices" description="Accounts receivable linked to clients and projects" />
            {invoices.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No invoices found" description="Create an invoice or adjust your filters." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {invoices.map((invoice) => (
                        <button
                            key={invoice.id}
                            type="button"
                            onClick={() => onSelectInvoice(invoice.id)}
                            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                                selectedInvoiceId === invoice.id
                                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/40"
                            }`}
                        >
                            <div>
                                <p className="font-medium">{invoice.number}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {invoice.clientName}
                                    {invoice.projectName ? ` • ${invoice.projectName}` : ""}
                                </p>
                            </div>
                            <div className="text-right text-sm text-slate-600 dark:text-slate-300">
                                <p className="capitalize">{invoice.status}</p>
                                <p>{formatMoney(invoice.total)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </Card>
    );
}
