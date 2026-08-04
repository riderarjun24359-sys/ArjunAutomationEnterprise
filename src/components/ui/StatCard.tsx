import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/src/design-os/components/Card";

interface StatCardProps {
    title: string;
    value: string;
    detail: string;
    trend: "up" | "down";
    tone?: "default" | "accent";
}

export function StatCard({ title, value, detail, trend, tone = "default" }: StatCardProps) {
    const isAccent = tone === "accent";

    return (
        <Card hover className={isAccent ? "border-[var(--dos-success)]/30 bg-[var(--dos-success-muted)]" : undefined}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[var(--dos-text-secondary)]">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">{value}</p>
                </div>
                <div className={`rounded-[var(--dos-radius-2xl)] p-2 ${trend === "up" ? "bg-[var(--dos-success-muted)] text-[var(--dos-success)]" : "bg-[var(--dos-error-muted)] text-[var(--dos-error)]"}`}>
                    {trend === "up" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                </div>
            </div>
            <p className="mt-4 text-sm text-[var(--dos-text-secondary)]">{detail}</p>
        </Card>
    );
}
