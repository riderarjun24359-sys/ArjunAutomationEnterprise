export function LoadingState({ label = "Loading dashboard data" }: { label?: string }) {
    return (
        <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white/80 p-12 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
            <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
                <span>{label}</span>
            </div>
        </div>
    );
}
