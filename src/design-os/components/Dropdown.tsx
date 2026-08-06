"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { dropdownMenu } from "@/src/design-os/motion/variants";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export function Dropdown({ trigger, children, className }: { trigger: React.ReactNode; children: React.ReactNode; className?: string }) {
    const [open, setOpen] = useState(false);
    const reduced = useReducedMotion();
    const menuId = useId();

    return (
        <div
            className={cn("relative inline-block", className)}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
            }}
        >
            <div aria-haspopup="menu" aria-expanded={open} aria-controls={menuId}>
                {trigger}
            </div>
            <AnimatePresence>
                {open ? (
                    <m.div
                        id={menuId}
                        role="menu"
                        className="dos-gpu absolute right-0 top-full z-[var(--dos-z-dropdown)] mt-1 min-w-[180px] rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] py-1 shadow-[var(--dos-elevation-3)]"
                        variants={reduced ? undefined : dropdownMenu}
                        initial={reduced ? false : "hidden"}
                        animate="visible"
                        exit="exit"
                    >
                        {children}
                    </m.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}

export function DropdownItem({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
    return (
        <button
            type="button"
            role="menuitem"
            onClick={onClick}
            className={cn(
                "dos-focus-ring block w-full px-3 py-2 text-left text-sm text-[var(--dos-text-primary)] transition-colors hover:bg-[var(--dos-surface-tertiary)]",
                className,
            )}
        >
            {children}
        </button>
    );
}
