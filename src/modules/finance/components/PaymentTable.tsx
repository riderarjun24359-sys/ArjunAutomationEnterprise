import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Payment } from "@/src/modules/finance/types";
import { FinanceRow } from "@/src/design-os/components/primitives/FinanceRow";

interface PaymentTableProps {
    payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
    return (
        <section className="os-panel p-6">
            <header className="mb-6">
                <h2 className="dos-text-h2">Payments</h2>
                <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Payment history and receipts</p>
            </header>
            
            {payments.length === 0 ? (
                <div className="rounded-[var(--dos-radius-lg)] border border-dashed border-[var(--dos-border)] p-8 text-center">
                    <p className="dos-text-secondary">No payments found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {payments.map((payment) => (
                        <FinanceRow key={payment.id}>
                            <div>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{payment.invoiceNumber}</p>
                                <p className="mt-1 dos-text-body-sm text-[var(--dos-text-secondary)]">
                                    {payment.clientName} • {payment.method.toUpperCase()} • {payment.paymentDate}
                                </p>
                            </div>
                            <div className="text-right dos-text-body-sm text-[var(--dos-text-secondary)]">
                                <p className="capitalize dos-text-caption">{payment.status}</p>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{formatMoney(payment.amount)}</p>
                            </div>
                        </FinanceRow>
                    ))}
                </div>
            )}
        </section>
    );
}

