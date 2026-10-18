import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { HELP_CENTER_TOPICS } from "@/src/modules/soft-launch/data/launch-assets";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Help Center",
    description: "Help center for getting started, billing, security, and support contacts.",
    path: MARKETING_ROUTES.help,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    noIndex: true,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Help Center", path: PAGE.path },
];

export default function HelpCenterPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell title={PAGE.title} description="Guides and support destinations.">
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {HELP_CENTER_TOPICS.map((topic) => (
                        <article key={topic.title} className="rounded-3xl border border-[var(--premium-border)] p-6">
                            <h2 className="text-xl font-semibold">{topic.title}</h2>
                            <p className="mt-3 text-sm text-[var(--premium-fg-muted)]">{topic.body}</p>
                            <Link href={topic.href} className="mt-4 inline-flex text-sm font-semibold text-orange-500 underline">
                                Open
                            </Link>
                        </article>
                    ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-4 text-sm">
                    <Link href={MARKETING_ROUTES.faq} className="underline">
                        FAQ
                    </Link>
                    <Link href={MARKETING_ROUTES.contact} className="underline">
                        Contact Us
                    </Link>
                    <Link href={MARKETING_ROUTES.feedback} className="underline">
                        Feedback form
                    </Link>
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
