import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { formatMoney } from "@/src/modules/database/lib/finance-mappers";
import type { Payment } from "@/src/modules/finance/types";

interface PaymentTableProps {
    payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
    return (
        <Card hover>
            <SectionHeader title="Payments" description="Collected revenue against invoices" />
            {payments.length === 0 ? (
                <div className="mt-6">
                    <EmptyState title="No payments recorded" description="Record a payment against an open invoice." />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div>
                                <p className="font-medium">{payment.invoiceNumber}</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {payment.clientName} • {payment.method.toUpperCase()} • {payment.paymentDate}
                                </p>
                            </div>
                            <div className="text-right text-sm">
                                <p className="capitalize">{payment.status}</p>
                                <p className="font-medium">{formatMoney(payment.amount)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
