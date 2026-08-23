import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Invoice } from "@/src/modules/finance/types";
import { cn } from "@/src/lib/cn";
import { FinanceRow } from "@/src/design-os/components/primitives/FinanceRow";

interface InvoiceTableProps {
    invoices: Invoice[];
    selectedInvoiceId?: string | null;
    onSelectInvoice: (id: string) => void;
}

export function InvoiceTable({ invoices, selectedInvoiceId, onSelectInvoice }: InvoiceTableProps) {
    return (
        <section className="os-panel p-6">
            <header className="mb-6">
                <h2 className="dos-text-h2">Invoices</h2>
                <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Accounts receivable linked to clients and projects</p>
            </header>
            
            {invoices.length === 0 ? (
                <div className="rounded-[var(--dos-radius-lg)] border border-dashed border-[var(--dos-border)] p-8 text-center">
                    <p className="dos-text-secondary">No invoices found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {invoices.map((invoice) => (
                        <button
                            key={invoice.id}
                            type="button"
                            onClick={() => onSelectInvoice(invoice.id)}
                            className="w-full text-left"
                        >
                            <FinanceRow className={selectedInvoiceId === invoice.id ? "border-[var(--dos-border-focus)] bg-[var(--dos-surface-secondary)]" : ""}>
                                <div>
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{invoice.number}</p>
                                    <p className="mt-1 dos-text-body-sm text-[var(--dos-text-secondary)]">
                                        {invoice.clientName}
                                        {invoice.projectName ? ` • ${invoice.projectName}` : ""}
                                    </p>
                                </div>
                                <div className="text-right dos-text-body-sm text-[var(--dos-text-secondary)]">
                                    <p className="capitalize dos-text-caption">{invoice.status}</p>
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{formatMoney(invoice.total)}</p>
                                </div>
                            </FinanceRow>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
