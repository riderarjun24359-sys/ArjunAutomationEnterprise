import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import type { RevenueAnalytics } from "@/src/modules/analytics/types";

interface RevenueAnalyticsPanelProps {
    revenue: RevenueAnalytics | null;
}

export function RevenueAnalyticsPanel({ revenue }: RevenueAnalyticsPanelProps) {
    return (
        <Card hover>
            <SectionHeader title="Revenue analytics" description="Invoice, payment, and expense performance" />
            <div className="mt-6">
                <EmptyState
                    title="Revenue not verified"
                    description={revenue
                        ? "Revenue totals and trends remain hidden until Razorpay settlements are reconciled to exact INR invoices and deals."
                        : "Finance records will populate analytics after the INR settlement ledger is verified."}
                />
            </div>
        </Card>
    );
}
