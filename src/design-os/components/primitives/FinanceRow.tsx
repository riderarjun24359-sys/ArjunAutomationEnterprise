import { cn } from "@/src/lib/cn";

interface FinanceRowProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function FinanceRow({ children, className, ...props }: FinanceRowProps) {
    return (
        <div 
            className={cn(
                "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4 transition-all hover:border-[var(--dos-border-focus)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
