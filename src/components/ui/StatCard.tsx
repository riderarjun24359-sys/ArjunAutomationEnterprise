import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/src/components/ui/Card";

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
        <Card hover className={isAccent ? "border-emerald-200 bg-emerald-50/90 dark:border-emerald-800 dark:bg-emerald-950/50" : undefined}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
                </div>
                <div className={`rounded-2xl p-2 ${trend === "up" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"}`}>
                    {trend === "up" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                </div>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
        </Card>
    );
}
