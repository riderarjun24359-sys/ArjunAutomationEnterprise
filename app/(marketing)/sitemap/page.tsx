import type { Metadata } from "next";
import Link from "next/link";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { BLOG_POSTS } from "@/src/modules/company-launch-kit/data/blog";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { SERVICE_ITEMS } from "@/src/modules/company-launch-kit/data/services";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Sitemap",
    description: "Complete sitemap of Arjun Automation public website pages, services, portfolio, and resources.",
    path: MARKETING_ROUTES.sitemap,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    noIndex: true,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Sitemap", path: PAGE.path },
];

const MAIN_PAGES = [
    { label: "Home", href: MARKETING_ROUTES.home },
    { label: "About", href: MARKETING_ROUTES.about },
    { label: "Services", href: MARKETING_ROUTES.services },
    { label: "Industries", href: MARKETING_ROUTES.industries },
    { label: "Case Studies", href: MARKETING_ROUTES.caseStudies },
    { label: "Portfolio", href: MARKETING_ROUTES.portfolio },
    { label: "Pricing", href: MARKETING_ROUTES.pricing },
    { label: "FAQ", href: MARKETING_ROUTES.faq },
    { label: "Resources", href: MARKETING_ROUTES.resources },
    { label: "Blog", href: MARKETING_ROUTES.blog },
    { label: "Contact", href: MARKETING_ROUTES.contact },
    { label: "Search", href: MARKETING_ROUTES.search },
    { label: "Privacy Policy", href: MARKETING_ROUTES.privacy },
    { label: "Terms of Service", href: MARKETING_ROUTES.terms },
];

export default function SitemapPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell title="Sitemap" description="All pages on the Arjun Automation public website.">
                <MarketingBreadcrumbs items={breadcrumbs} />

                <div className="grid gap-12 lg:grid-cols-2">
                    <section aria-labelledby="main-pages">
                        <h2 id="main-pages" className="text-lg font-semibold">
                            Main pages
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {MAIN_PAGES.map((page) => (
                                <li key={page.href}>
                                    <Link href={page.href} className="text-indigo-700 hover:text-indigo-600">
                                        {page.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="services-pages">
                        <h2 id="services-pages" className="text-lg font-semibold">
                            Services
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {SERVICE_ITEMS.map((service) => (
                                <li key={service.slug}>
                                    <Link href={MARKETING_ROUTES.serviceItem(service.slug)} className="text-indigo-700 hover:text-indigo-600">
                                        {service.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="portfolio-pages">
                        <h2 id="portfolio-pages" className="text-lg font-semibold">
                            Portfolio
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {PORTFOLIO_ITEMS.map((item) => (
                                <li key={item.slug}>
                                    <Link href={MARKETING_ROUTES.portfolioItem(item.slug)} className="text-indigo-700 hover:text-indigo-600">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="blog-pages">
                        <h2 id="blog-pages" className="text-lg font-semibold">
                            Blog
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {BLOG_POSTS.map((post) => (
                                <li key={post.slug}>
                                    <Link href={MARKETING_ROUTES.blogPost(post.slug)} className="text-indigo-700 hover:text-indigo-600">
                                        {post.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <p className="mt-12 text-sm text-[var(--premium-fg-muted)]">
                    Machine-readable sitemap:{" "}
                    <Link href="/sitemap.xml" className="text-indigo-700">
                        /sitemap.xml
                    </Link>
                </p>
            </PremiumPageShell>
        </>
    );
}
