"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchContent } from "@/src/modules/company-launch-kit/data/search-index";

export function SearchContent() {
    const [query, setQuery] = useState("");
    const results = useMemo(() => searchContent(query, 30), [query]);
    const hasQuery = query.trim().length > 0;

    return (
        <section aria-labelledby="site-search-heading" className="space-y-6">
            <div className="premium-glass rounded-2xl p-6 sm:p-8">
                <label id="site-search-heading" htmlFor="site-search-input" className="block text-lg font-semibold text-[var(--premium-fg)]">
                    Search the website
                </label>
                <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">Find services, portfolio projects, articles, and resources.</p>
                <input
                    id="site-search-input"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try “CRM”, “school”, “AI automation”…"
                    autoComplete="off"
                    className="mt-4 w-full rounded-xl border border-[var(--premium-border)] bg-[var(--premium-bg)] px-4 py-3 text-base text-[var(--premium-fg)] outline-none transition placeholder:text-[var(--premium-fg-muted)] focus:border-[var(--dos-brand-primary)] focus:ring-2 focus:ring-[var(--dos-brand-primary)]/20"
                />
            </div>

            {hasQuery ? (
                <div aria-live="polite">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-[var(--premium-fg)]">Search results</h2>
                        <span className="text-sm text-[var(--premium-fg-muted)]">{results.length} found</span>
                    </div>
                    {results.length === 0 ? (
                        <div className="premium-glass rounded-2xl p-8 text-center">
                            <p className="font-semibold text-[var(--premium-fg)]">No matching results</p>
                            <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">Try a shorter phrase or a different keyword.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {results.map((result) => (
                                <article key={`${result.category}:${result.href}`} className="premium-glass rounded-2xl p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="rounded-full bg-[var(--dos-brand-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--dos-brand-primary)]">{result.category}</span>
                                        <Link href={result.href} className="text-sm font-semibold text-[var(--dos-brand-primary)] hover:underline">Open page →</Link>
                                    </div>
                                    <h3 className="mt-3 text-lg font-semibold text-[var(--premium-fg)]">{result.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--premium-fg-muted)]">{result.description}</p>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-sm text-[var(--premium-fg-muted)]">Start typing to search across the site. Or use the quick links below.</p>
            )}
        </section>
    );
}
