import Link from "next/link";
import type { BreadcrumbItem } from "@/src/lib/seo";

type MarketingBreadcrumbsProps = {
    items: BreadcrumbItem[];
};

export function MarketingBreadcrumbs({ items }: MarketingBreadcrumbsProps) {
    if (items.length <= 1) return null;

    return (
        <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--premium-fg-muted)]">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={item.path} className="flex items-center gap-2">
                            {index > 0 && (
                                <span className="text-[var(--premium-border)]" aria-hidden="true">
                                    /
                                </span>
                            )}
                            {isLast ? (
                                <span aria-current="page" className="font-medium text-[var(--premium-fg)]">
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.path}
                                    className="rounded hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
