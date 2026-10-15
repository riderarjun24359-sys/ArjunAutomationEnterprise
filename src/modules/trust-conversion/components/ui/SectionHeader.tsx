import { cn } from "@/src/lib/cn";

type SectionHeaderProps = {
    /** id applied to the <h2> so sections can reference it via aria-labelledby */
    id: string;
    title: string;
    subtitle?: string;
    className?: string;
};

/**
 * Shared section heading used by every trust & conversion section so the
 * type scale, spacing and colour stay identical across the homepage rather
 * than being re-declared per section.
 */
export function SectionHeader({ id, title, subtitle, className }: SectionHeaderProps) {
    return (
        <div className={cn("tc-reveal mx-auto max-w-3xl text-center", className)}>
            <h2
                id={id}
                className="font-display text-3xl font-bold tracking-[-0.02em] text-[var(--dos-text-primary)] sm:text-4xl"
            >
                {title}
            </h2>
            {subtitle ? (
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--premium-fg-muted)]">
                    {subtitle}
                </p>
            ) : null}
        </div>
    );
}
