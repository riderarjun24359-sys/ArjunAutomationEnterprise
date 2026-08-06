/**
 * Bootstrap V4 Design OS — Part 3: Components library
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

const root = process.cwd();

function write(rel, content) {
    const full = join(root, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
    console.log("wrote", rel);
}

write("src/design-os/components/Button.tsx", `"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { useMagnetic } from "@/src/design-os/motion/hooks/useMagnetic";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-[var(--dos-brand-primary)] text-white hover:bg-[var(--dos-brand-primary-hover)]",
                secondary: "border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] text-[var(--dos-text-primary)] hover:bg-[var(--dos-surface-tertiary)]",
                ghost: "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]",
                danger: "bg-[var(--dos-error)] text-white hover:opacity-90",
            },
            size: {
                sm: "h-8 px-3 text-xs rounded-[var(--dos-radius-md)]",
                md: "h-10 px-4 text-sm rounded-[var(--dos-radius-lg)]",
                lg: "h-12 px-6 text-base rounded-[var(--dos-radius-lg)]",
            },
        },
        defaultVariants: { variant: "primary", size: "md" },
    },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    loading?: boolean;
    magnetic?: boolean;
}

export function Button({ className, variant, size, loading, magnetic, children, disabled, ...props }: ButtonProps) {
    const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLButtonElement>();

    return (
        <motion.button
            ref={magnetic ? ref : undefined}
            onMouseMove={magnetic ? onMouseMove : undefined}
            onMouseLeave={magnetic ? onMouseLeave : undefined}
            whileTap={{ scale: 0.98 }}
            className={cn(buttonVariants({ variant, size }), className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {children}
        </motion.button>
    );
}
`);

write("src/design-os/components/Input.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
    return (
        <input
            className={cn(
                "h-10 w-full rounded-[var(--dos-radius-lg)] border bg-[var(--dos-surface-secondary)] px-3 text-sm text-[var(--dos-text-primary)] outline-none transition placeholder:text-[var(--dos-text-tertiary)] focus:border-[var(--dos-border-focus)] focus:ring-2 focus:ring-[var(--dos-border-focus)]/20",
                error ? "border-[var(--dos-error)]" : "border-[var(--dos-border)]",
                className,
            )}
            {...props}
        />
    );
}
`);

write("src/design-os/components/Textarea.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={cn(
                "min-h-[100px] w-full rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-2 text-sm text-[var(--dos-text-primary)] outline-none transition placeholder:text-[var(--dos-text-tertiary)] focus:border-[var(--dos-border-focus)] focus:ring-2 focus:ring-[var(--dos-border-focus)]/20",
                className,
            )}
            {...props}
        />
    );
}
`);

write("src/design-os/components/Select.tsx", `"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/cn";

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <select
                className={cn(
                    "h-10 w-full appearance-none rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 pr-10 text-sm text-[var(--dos-text-primary)] outline-none focus:border-[var(--dos-border-focus)]",
                    className,
                )}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dos-text-tertiary)]" />
        </div>
    );
}
`);

write("src/design-os/components/Card.tsx", `"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/src/lib/cn";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: React.ReactNode;
    glass?: boolean;
    hover?: boolean;
}

export function Card({ children, className, glass = false, hover = false, ...props }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            whileHover={hover ? { y: -4, boxShadow: "var(--dos-shadow-lg)" } : undefined}
            className={cn(
                "rounded-[var(--dos-radius-2xl)] border p-6",
                glass ? "dos-glass" : "border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-shadow-md)]",
                className,
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
`);

write("src/design-os/components/Dialog.tsx", `"use client";

import { X } from "lucide-react";
import { cn } from "@/src/lib/cn";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[var(--dos-z-modal)] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[var(--dos-surface-overlay)]" onClick={onClose} aria-hidden="true" />
            <div className={cn("relative z-10 w-full max-w-lg rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-6 shadow-[var(--dos-shadow-xl)]", className)} role="dialog" aria-modal="true" aria-labelledby="dos-dialog-title">
                <div className="mb-4 flex items-center justify-between">
                    <h2 id="dos-dialog-title" className="text-lg font-semibold text-[var(--dos-text-primary)]">{title}</h2>
                    <button type="button" onClick={onClose} className="rounded-[var(--dos-radius-md)] p-1 text-[var(--dos-text-tertiary)] hover:bg-[var(--dos-surface-tertiary)]" aria-label="Close">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
`);

write("src/design-os/components/Table.tsx", `"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/src/lib/cn";

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("overflow-hidden rounded-[var(--dos-radius-xl)] border border-[var(--dos-border)]", className)}>
            <table className="w-full text-sm">{children}</table>
        </div>
    );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
    return <thead className="border-b border-[var(--dos-border)] bg-[var(--dos-surface-secondary)]">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
    return <tbody className="divide-y divide-[var(--dos-border-subtle)] [&>tr:nth-child(even)]:bg-[var(--dos-surface-secondary)]/50">{children}</tbody>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
    return <tr className={cn("transition hover:bg-[var(--dos-surface-tertiary)]/50", className)}>{children}</tr>;
}

export function TableHead({ children, sortable, sortDirection, onSort, className }: { children: React.ReactNode; sortable?: boolean; sortDirection?: "asc" | "desc" | null; onSort?: () => void; className?: string }) {
    const SortIcon = sortDirection === "asc" ? ArrowUp : sortDirection === "desc" ? ArrowDown : ArrowUpDown;
    return (
        <th className={cn("px-4 py-3 text-left font-semibold text-[var(--dos-text-secondary)]", className)}>
            {sortable ? (
                <button type="button" onClick={onSort} className="inline-flex items-center gap-1 hover:text-[var(--dos-text-primary)]">
                    {children}
                    <SortIcon className="h-3.5 w-3.5" />
                </button>
            ) : children}
        </th>
    );
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
    return <td className={cn("px-4 py-3 text-[var(--dos-text-primary)]", className)}>{children}</td>;
}
`);

write("src/design-os/components/ChartContainer.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export function ChartContainer({ title, description, children, className }: { title?: string; description?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-6 shadow-[var(--dos-shadow-sm)]", className)}>
            {title ? <h3 className="text-base font-semibold text-[var(--dos-text-primary)]">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{description}</p> : null}
            <div className="mt-4 [&_.recharts-cartesian-grid_line]:stroke-[var(--dos-border-subtle)] [&_.recharts-text]:fill-[var(--dos-text-secondary)]">
                {children}
            </div>
        </div>
    );
}
`);

write("src/design-os/components/Form.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export function FormField({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("space-y-1.5", className)}>{children}</div>;
}

export function FormLabel({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
    return (
        <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-[var(--dos-text-primary)]", className)}>
            {children}
        </label>
    );
}

export function FormError({ children, className }: { children?: React.ReactNode; className?: string }) {
    if (!children) return null;
    return <p className={cn("text-xs text-[var(--dos-error)]", className)} role="alert">{children}</p>;
}
`);

write("src/design-os/components/Dropdown.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export function Dropdown({ trigger, children, className }: { trigger: React.ReactNode; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("group relative inline-block", className)}>
            {trigger}
            <div className="invisible absolute right-0 top-full z-[var(--dos-z-dropdown)] mt-1 min-w-[180px] rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] py-1 opacity-0 shadow-[var(--dos-shadow-lg)] transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                {children}
            </div>
        </div>
    );
}

export function DropdownItem({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
    return (
        <button type="button" onClick={onClick} className={cn("block w-full px-3 py-2 text-left text-sm text-[var(--dos-text-primary)] hover:bg-[var(--dos-surface-tertiary)]", className)}>
            {children}
        </button>
    );
}
`);

write("src/design-os/components/Tabs.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export function Tabs({ tabs, active, onChange, className }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void; className?: string }) {
    return (
        <div className={cn("flex gap-1 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] p-1", className)} role="tablist">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active === tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "rounded-[var(--dos-radius-md)] px-4 py-2 text-sm font-medium transition",
                        active === tab.id
                            ? "bg-[var(--dos-surface-elevated)] text-[var(--dos-text-primary)] shadow-[var(--dos-shadow-sm)]"
                            : "text-[var(--dos-text-secondary)] hover:text-[var(--dos-text-primary)]",
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
`);

write("src/design-os/components/Badge.tsx", `"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/cn";

const badgeVariants = cva("inline-flex items-center rounded-[var(--dos-radius-full)] px-2.5 py-0.5 text-xs font-medium", {
    variants: {
        variant: {
            default: "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-primary)]",
            success: "bg-[var(--dos-success-muted)] text-[var(--dos-success)]",
            warning: "bg-[var(--dos-warning-muted)] text-[var(--dos-warning)]",
            error: "bg-[var(--dos-error-muted)] text-[var(--dos-error)]",
            info: "bg-[var(--dos-info-muted)] text-[var(--dos-info)]",
        },
    },
    defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, children }: React.PropsWithChildren<VariantProps<typeof badgeVariants> & { className?: string }>) {
    return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
`);

write("src/design-os/components/Notification.tsx", `"use client";

import { X } from "lucide-react";
import { cn } from "@/src/lib/cn";

export function Notification({ title, message, variant = "info", onDismiss, className }: { title: string; message?: string; variant?: "success" | "warning" | "error" | "info"; onDismiss?: () => void; className?: string }) {
    const colors = {
        success: "border-[var(--dos-success)]/30 bg-[var(--dos-success-muted)]",
        warning: "border-[var(--dos-warning)]/30 bg-[var(--dos-warning-muted)]",
        error: "border-[var(--dos-error)]/30 bg-[var(--dos-error-muted)]",
        info: "border-[var(--dos-info)]/30 bg-[var(--dos-info-muted)]",
    };
    return (
        <div className={cn("flex items-start gap-3 rounded-[var(--dos-radius-lg)] border p-4", colors[variant], className)} role="status">
            <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--dos-text-primary)]">{title}</p>
                {message ? <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{message}</p> : null}
            </div>
            {onDismiss ? (
                <button type="button" onClick={onDismiss} className="text-[var(--dos-text-tertiary)] hover:text-[var(--dos-text-primary)]" aria-label="Dismiss">
                    <X className="h-4 w-4" />
                </button>
            ) : null}
        </div>
    );
}
`);

write("src/design-os/components/LoadingState.tsx", `"use client";

import { cn } from "@/src/lib/cn";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";

export function LoadingState({ label = "Loading...", className }: { label?: string; className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-4 rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-12", className)}>
            <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--dos-brand-primary)]" />
                <span className="text-sm text-[var(--dos-text-secondary)]">{label}</span>
            </div>
            <SkeletonLoader className="h-2 w-48" />
        </div>
    );
}
`);

write("src/design-os/components/EmptyState.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export function EmptyState({ title, description, action, className }: { title: string; description: string; action?: React.ReactNode; className?: string }) {
    return (
        <div className={cn("rounded-[var(--dos-radius-2xl)] border border-dashed border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] p-8 text-center", className)}>
            <p className="font-semibold text-[var(--dos-text-primary)]">{title}</p>
            <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{description}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}
`);

write("src/design-os/components/ErrorState.tsx", `"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { Button } from "./Button";

export function ErrorState({ title = "Something went wrong", description, onRetry, className }: { title?: string; description: string; onRetry?: () => void; className?: string }) {
    return (
        <div className={cn("flex flex-col items-center gap-4 rounded-[var(--dos-radius-2xl)] border border-[var(--dos-error)]/30 bg-[var(--dos-error-muted)] p-8 text-center", className)}>
            <AlertTriangle className="h-8 w-8 text-[var(--dos-error)]" />
            <div>
                <p className="font-semibold text-[var(--dos-text-primary)]">{title}</p>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{description}</p>
            </div>
            {onRetry ? <Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button> : null}
        </div>
    );
}
`);

write("src/design-os/components/AnimatedLink.tsx", `"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";

export function AnimatedLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <Link href={href} className={cn("group relative inline-flex text-[var(--dos-text-link)]", className)}>
            {children}
            <motion.span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[var(--dos-text-link)] transition group-hover:scale-x-100" layoutId="dos-link-underline" />
        </Link>
    );
}
`);

write("src/design-os/components/ThemeToggle.tsx", `"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";

function subscribeMounted(callback: () => void) { callback(); return () => {}; }
function getMountedSnapshot() { return true; }
function getMountedServerSnapshot() { return false; }

export function ThemeToggle({ className }: { className?: string }) {
    const { setTheme, resolvedTheme } = useTheme();
    const mounted = useSyncExternalStore(subscribeMounted, getMountedSnapshot, getMountedServerSnapshot);
    if (!mounted) return <div className={cn("h-9 w-9 rounded-[var(--dos-radius-lg)]", className)} aria-hidden="true" />;
    const isDark = resolvedTheme === "dark";
    return (
        <motion.button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn("flex h-9 w-9 items-center justify-center rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] text-[var(--dos-text-secondary)] hover:text-[var(--dos-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]", className)}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.button>
    );
}
`);

write("src/design-os/components/index.ts", `export { Button } from "./Button";
export { Input } from "./Input";
export { Textarea } from "./Textarea";
export { Select } from "./Select";
export { Card } from "./Card";
export { Dialog } from "./Dialog";
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Table";
export { ChartContainer } from "./ChartContainer";
export { FormField, FormLabel, FormError } from "./Form";
export { Dropdown, DropdownItem } from "./Dropdown";
export { Tabs } from "./Tabs";
export { Badge } from "./Badge";
export { Notification } from "./Notification";
export { LoadingState } from "./LoadingState";
export { EmptyState } from "./EmptyState";
export { ErrorState } from "./ErrorState";
export { AnimatedLink } from "./AnimatedLink";
export { ThemeToggle } from "./ThemeToggle";
`);

console.log("Part 3 components complete");
