import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Invoice } from "@/src/modules/finance/types";

interface InvoiceDetailPanelProps {
    invoice: Invoice | null;
}

export function InvoiceDetailPanel({ invoice }: InvoiceDetailPanelProps) {
    if (!invoice) {
        return (
            <section className="os-panel p-8 text-center text-[var(--dos-text-secondary)]">
                Select an invoice to inspect details.
            </section>
        );
    }

    return (
        <section className="os-panel p-6">
            <header className="mb-6 border-b border-[var(--dos-border-subtle)] pb-4">
                <h2 className="dos-text-h2">{invoice.number}</h2>
                <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">
                    {invoice.clientName}{invoice.projectName ? ` • ${invoice.projectName}` : ""}
                </p>
            </header>
            
            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    {[
                        { label: "Status", value: invoice.status },
                        { label: "Balance Due", value: formatMoney(invoice.balanceDue) },
                        { label: "Issue Date", value: invoice.issueDate },
                        { label: "Due Date", value: invoice.dueDate || "—" },
                    ].map((item) => (
                        <div key={item.label} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4">
                            <p className="dos-text-caption text-[var(--dos-text-tertiary)]">{item.label}</p>
                            <p className="mt-1 font-semibold text-[var(--dos-text-primary)] capitalize">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h4 className="mb-3 dos-text-h3">Line Items</h4>
                    <div className="space-y-3">
                        {invoice.lineItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4">
                                <div>
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{item.description}</p>
                                    <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">{item.quantity} × {formatMoney(item.unitPrice)}</p>
                                </div>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{formatMoney(item.amount)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-5 space-y-2">
                    <div className="flex justify-between dos-text-body-sm text-[var(--dos-text-secondary)]">
                        <span>Subtotal</span>
                        <span>{formatMoney(invoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between dos-text-body-sm text-[var(--dos-text-secondary)]">
                        <span>Tax</span>
                        <span>{formatMoney(invoice.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[var(--dos-text-primary)] pt-2 border-t border-[var(--dos-border-subtle)]">
                        <span>Total</span>
                        <span>{formatMoney(invoice.total)}</span>
                    </div>
                    <div className="flex justify-between dos-text-body-sm text-[var(--dos-success)] pt-1">
                        <span>Paid</span>
                        <span>{formatMoney(invoice.amountPaid)}</span>
                    </div>
                </div>

                {invoice.notes ? (
                    <div className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4">
                        <p className="dos-text-caption text-[var(--dos-text-tertiary)]">Notes</p>
                        <p className="mt-1 dos-text-body-sm text-[var(--dos-text-secondary)]">{invoice.notes}</p>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
