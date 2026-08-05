import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { BLOG_POSTS } from "@/src/modules/company-launch-kit/data/blog";
import { CASE_STUDY_ITEMS } from "@/src/modules/company-launch-kit/data/case-studies";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Resources",
    description:
        "Guides, case studies, blog articles, and launch resources from Arjun Automation — learn how to deploy enterprise automation successfully.",
    path: MARKETING_ROUTES.resources,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Resources", path: PAGE.path },
];

const GUIDES = [
    {
        title: "Enterprise Automation Launch Guide",
        description: "Step-by-step guide to planning and launching enterprise automation.",
        href: MARKETING_ROUTES.launchAutomation,
    },
    {
        title: "CRM Implementation Guide",
        description: "Best practices for unified CRM deployment and adoption.",
        href: MARKETING_ROUTES.launchCrm,
    },
];

export default function ResourcesPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="Resources"
                description="Guides, insights, and proof points to help you evaluate and deploy enterprise automation."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />

                <div className="space-y-16">
                    <section aria-labelledby="guides-heading">
                        <h2 id="guides-heading" className="text-2xl font-semibold">
                            Launch guides
                        </h2>
                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            {GUIDES.map((guide) => (
                                <Link
                                    key={guide.href}
                                    href={guide.href}
                                    className="premium-glass rounded-2xl p-6 transition hover:ring-2 hover:ring-indigo-700/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                                >
                                    <h3 className="text-lg font-semibold">{guide.title}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{guide.description}</p>
                                    <span className="mt-4 inline-block text-sm font-medium text-indigo-700">Read guide →</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="case-studies-heading">
                        <h2 id="case-studies-heading" className="text-2xl font-semibold">
                            Case studies
                        </h2>
                        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {CASE_STUDY_ITEMS.slice(0, 3).map((study) => (
                                <Link
                                    key={study.slug}
                                    href={MARKETING_ROUTES.caseStudyItem(study.slug)}
                                    className="premium-glass rounded-2xl p-6 transition hover:ring-2 hover:ring-indigo-700/30"
                                >
                                    <span className="text-xs font-medium uppercase tracking-wider text-indigo-700">{study.industry}</span>
                                    <h3 className="mt-2 font-semibold">{study.title}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)] line-clamp-2">{study.challenge}</p>
                                </Link>
                            ))}
                        </div>
                        <Link href={MARKETING_ROUTES.caseStudies} className="mt-4 inline-block text-sm font-medium text-indigo-700">
                            View all case studies →
                        </Link>
                    </section>

                    <section aria-labelledby="blog-heading">
                        <h2 id="blog-heading" className="text-2xl font-semibold">
                            Blog
                        </h2>
                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            {BLOG_POSTS.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={MARKETING_ROUTES.blogPost(post.slug)}
                                    className="premium-glass rounded-2xl p-6 transition hover:ring-2 hover:ring-indigo-700/30"
                                >
                                    <span className="text-xs font-medium text-indigo-700">{post.category}</span>
                                    <h3 className="mt-2 font-semibold">{post.title}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)] line-clamp-2">{post.excerpt}</p>
                                </Link>
                            ))}
                        </div>
                        <Link href={MARKETING_ROUTES.blog} className="mt-4 inline-block text-sm font-medium text-indigo-700">
                            View all articles →
                        </Link>
                    </section>

                    <section aria-labelledby="quick-links-heading" className="premium-glass rounded-2xl p-8">
                        <h2 id="quick-links-heading" className="text-xl font-semibold">
                            Quick links
                        </h2>
                        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                            {[
                                { label: "FAQ", href: MARKETING_ROUTES.faq },
                                { label: "Pricing", href: MARKETING_ROUTES.pricing },
                                { label: "Services", href: MARKETING_ROUTES.services },
                                { label: "Contact", href: MARKETING_ROUTES.contact },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-indigo-700 hover:text-indigo-600">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
