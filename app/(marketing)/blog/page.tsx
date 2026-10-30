import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSignup } from "@/src/modules/company-launch-kit/components/NewsletterSignup";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { BLOG_POSTS } from "@/src/modules/company-launch-kit/data/blog";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Blog",
    description: "Insights on enterprise automation, AI workers, industry OS packs, and platform best practices from Arjun Automation.",
    path: "/blog",
});

export default function BlogPage() {
    const breadcrumbs = [
        { name: "Home", path: MARKETING_ROUTES.home },
        { name: "Blog", path: "/blog" },
    ];

    return (
        <>
            <MarketingStructuredData
                title="Blog"
                description="Insights on enterprise automation, AI workers, industry OS packs, and platform best practices from Arjun Automation."
                path="/blog"
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="Blog"
                description="Enterprise automation insights, AI worker strategies, and platform best practices."
            >
                <div className="space-y-16">
                    <section aria-labelledby="recent-heading">
                        <h2 id="recent-heading" className="text-2xl font-semibold text-[var(--premium-fg)]">
                            Recent articles
                        </h2>
                        <div className="mt-8 grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2 space-y-8">
                                {BLOG_POSTS.map((post) => (
                                    <article
                                        key={post.slug}
                                        className="rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] p-8"
                                    >
                                        <span className="text-xs font-medium text-[var(--dos-brand-primary)]">
                                            {post.category}
                                        </span>
                                        <h2 className="mt-2 text-2xl font-semibold text-[var(--premium-fg)]">
                                            <Link
                                                href={MARKETING_ROUTES.blogPost(post.slug)}
                                                className="hover:text-[var(--dos-brand-primary-hover)]"
                                            >
                                                {post.title}
                                            </Link>
                                        </h2>
                                        <p className="mt-3 text-[var(--premium-fg-muted)]">{post.excerpt}</p>
                                        <div className="mt-4 flex gap-4 text-sm text-[var(--premium-fg-tertiary)]">
                                            <span>{post.author}</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                        <Link
                                            href={MARKETING_ROUTES.blogPost(post.slug)}
                                            className="mt-4 inline-block text-sm font-medium text-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary-hover)]"
                                        >
                                            Read article &rarr;
                                        </Link>
                                    </article>
                                ))}
                            </div>
                            <div>
                                <NewsletterSignup />
                            </div>
                        </div>
                    </section>
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
