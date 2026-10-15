import {
    FolderKanban,
    LayoutDashboard,
    ShieldCheck,
    Users,
    Wallet,
    Workflow,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/src/lib/cn";

const CONCEPT_RAIL: { label: string; icon: LucideIcon; active?: boolean }[] = [
    { label: "Overview", icon: LayoutDashboard, active: true },
    { label: "CRM", icon: Users },
    { label: "Projects", icon: FolderKanban },
    { label: "Finance", icon: Wallet },
    { label: "Automations", icon: Workflow },
    { label: "Governance", icon: ShieldCheck },
];

const CONCEPT_KPIS: { label: string; bars: number[] }[] = [
    { label: "Pipeline", bars: [38, 52, 44, 66, 58, 74, 82] },
    { label: "Automations", bars: [26, 42, 36, 54, 62, 70, 78] },
    { label: "Approvals", bars: [58, 48, 56, 42, 50, 64, 58] },
];

const TONE_CLASS: Record<string, string> = {
    info: "border-[color-mix(in_oklab,var(--dos-info)_35%,transparent)] bg-[var(--dos-info-muted)] text-[var(--dos-info)]",
    warning:
        "border-[color-mix(in_oklab,var(--dos-warning)_35%,transparent)] bg-[var(--dos-warning-muted)] text-[var(--dos-warning)]",
    success:
        "border-[color-mix(in_oklab,var(--dos-success)_35%,transparent)] bg-[var(--dos-success-muted)] text-[var(--dos-success)]",
    neutral: "border-[var(--dos-border)] bg-[var(--premium-bg-secondary)] text-[var(--premium-fg-muted)]",
};

const CONCEPT_ROWS: { name: string; status: string; tone: keyof typeof TONE_CLASS }[] = [
    { name: "Lead intake → CRM", status: "Automated", tone: "info" },
    { name: "Invoice approval", status: "In review", tone: "warning" },
    { name: "Client onboarding checklist", status: "Approved", tone: "success" },
    { name: "Quarterly access review", status: "Scheduled", tone: "neutral" },
];

/**
 * Honest hero visual: a clearly-labelled *interface concept*, not a live
 * product screenshot. Built entirely from design-OS tokens so it inherits the
 * real theme. No fabricated customer data, metrics, or status feeds — the
 * caption states this explicitly.
 */
export function HeroProductConcept({ className }: { className?: string }) {
    return (
        <figure className={cn("relative mx-auto w-full max-w-xl lg:max-w-none", className)}>
            <div className="premium-card overflow-hidden p-0 shadow-[var(--dos-shadow-glow)]">
                {/* Window bar */}
                <div className="flex items-center gap-3 border-b border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] px-4 py-3">
                    <span className="flex gap-1.5" aria-hidden="true">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                    </span>
                    <span className="truncate text-xs font-medium text-[var(--premium-fg-muted)]">
                        Arjun OS — Operations Console
                    </span>
                    <span className="ml-auto shrink-0 rounded-full border border-[var(--dos-border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--premium-fg-muted)]">
                        Product concept
                    </span>
                </div>

                <div className="flex">
                    {/* Module rail */}
                    <aside
                        className="hidden w-40 shrink-0 border-r border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] p-3 sm:block"
                        aria-hidden="true"
                    >
                        <ul className="space-y-1">
                            {CONCEPT_RAIL.map(({ label, icon: Icon, active }) => (
                                <li key={label}>
                                    <span
                                        className={cn(
                                            "flex items-center gap-2 rounded-[var(--dos-radius-md)] px-2.5 py-2 text-xs font-medium",
                                            active
                                                ? "bg-[var(--premium-bg)] text-[var(--premium-fg)] shadow-[var(--dos-shadow-sm)]"
                                                : "text-[var(--premium-fg-muted)]",
                                        )}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Main panel */}
                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                            {CONCEPT_KPIS.map((kpi) => (
                                <div
                                    key={kpi.label}
                                    className="rounded-[var(--dos-radius-lg)] border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] p-3"
                                >
                                    <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-[var(--premium-fg-muted)]">
                                        {kpi.label}
                                    </p>
                                    <div className="mt-3 flex h-12 items-end gap-1" aria-hidden="true">
                                        {kpi.bars.map((height, index) => (
                                            <span
                                                key={index}
                                                className="flex-1 rounded-full bg-[var(--dos-brand-primary)]/60"
                                                style={{ height: `${height}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <ul className="mt-4 space-y-2" aria-hidden="true">
                            {CONCEPT_ROWS.map((row) => (
                                <li
                                    key={row.name}
                                    className="flex items-center justify-between gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] px-3 py-2.5"
                                >
                                    <span className="flex min-w-0 items-center gap-2.5">
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--dos-brand-primary)]/70" />
                                        <span className="truncate text-sm font-medium text-[var(--premium-fg)]">{row.name}</span>
                                    </span>
                                    <span
                                        className={cn(
                                            "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                                            TONE_CLASS[row.tone],
                                        )}
                                    >
                                        {row.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <figcaption className="mt-3 text-center text-xs text-[var(--premium-fg-muted)]">
                Illustrative interface concept — not live customer data.
            </figcaption>
        </figure>
    );
}
