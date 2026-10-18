import type { Metadata } from "next";
import Link from "next/link";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { searchContent } from "@/src/modules/company-launch-kit/data/search-index";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Search",
    description: "Search Arjun Automation services, portfolio, resources, and blog articles.",
    path: MARKETING_ROUTES.search,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    noIndex: true,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Search", path: PAGE.path },
];

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
    const { q = "" } = await searchParams;
    const results = searchContent(q);

    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell title="Search" description="Find services, portfolio work, guides, and articles.">
                <MarketingBreadcrumbs items={breadcrumbs} />

                <form action={MARKETING_ROUTES.search} method="get" className="max-w-xl" role="search">
                    <label htmlFor="site-search" className="sr-only">
                        Search site
                    </label>
                    <div className="flex gap-3">
                        <input
                            id="site-search"
                            name="q"
                            type="search"
                            defaultValue={q}
                            placeholder="Search services, portfolio, blog..."
                            className="flex-1 rounded-xl border border-[var(--premium-border)] bg-[var(--premium-glass)] px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <div className="mt-10">
                    {q.trim() ? (
                        results.length > 0 ? (
                            <>
                                <p className="text-sm text-[var(--premium-fg-muted)]">
                                    {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
                                </p>
                                <ul className="mt-6 space-y-4">
                                    {results.map((result) => (
                                        <li key={result.href}>
                                            <Link
                                                href={result.href}
                                                className="block premium-glass rounded-xl p-5 transition hover:ring-2 hover:ring-orange-500/30"
                                            >
                                                <span className="text-xs font-medium uppercase tracking-wider text-orange-500">
                                                    {result.category}
                                                </span>
                                                <h2 className="mt-1 font-semibold">{result.title}</h2>
                                                <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">{result.description}</p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className="text-[var(--premium-fg-muted)]">
                                No results for &ldquo;{q}&rdquo;. Try different keywords or{" "}
                                <Link href={MARKETING_ROUTES.contact} className="text-orange-500">
                                    contact us
                                </Link>
                                .
                            </p>
                        )
                    ) : (
                        <p className="text-[var(--premium-fg-muted)]">Enter a search term to find content across our site.</p>
                    )}
                </div>
            </PremiumPageShell>
        </>
    );
}
