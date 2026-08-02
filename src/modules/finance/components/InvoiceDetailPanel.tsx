import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Invoice } from "@/src/modules/finance/types";

interface InvoiceDetailPanelProps {
    invoice: Invoice | null;
}

export function InvoiceDetailPanel({ invoice }: InvoiceDetailPanelProps) {
    if (!invoice) {
        return (
            <Card hover>
                <SectionHeader title="Invoice detail" description="Select an invoice to inspect line items and balances" />
                <div className="mt-6">
                    <EmptyState title="No invoice selected" description="Choose an invoice from the list to view details." />
                </div>
            </Card>
        );
    }

    return (
        <Card hover>
            <SectionHeader title={invoice.number} description={`${invoice.clientName}${invoice.projectName ? ` • ${invoice.projectName}` : ""}`} />
            <div className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                        <p className="mt-1 font-medium capitalize">{invoice.status}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Balance Due</p>
                        <p className="mt-1 font-medium">{formatMoney(invoice.balanceDue)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Issue Date</p>
                        <p className="mt-1 font-medium">{invoice.issueDate}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Due Date</p>
                        <p className="mt-1 font-medium">{invoice.dueDate || "—"}</p>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium">Line Items</p>
                    <div className="space-y-2">
                        {invoice.lineItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <div>
                                    <p className="font-medium">{item.description}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.quantity} × {formatMoney(item.unitPrice)}</p>
                                </div>
                                <p className="font-medium">{formatMoney(item.amount)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatMoney(invoice.subtotal)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm">
                        <span>Tax</span>
                        <span>{formatMoney(invoice.taxAmount)}</span>
                    </div>
                    <div className="mt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatMoney(invoice.total)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm text-emerald-600">
                        <span>Paid</span>
                        <span>{formatMoney(invoice.amountPaid)}</span>
                    </div>
                </div>

                {invoice.notes ? (
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Notes</p>
                        <p className="mt-1 text-sm">{invoice.notes}</p>
                    </div>
                ) : null}
            </div>
        </Card>
    );
}
