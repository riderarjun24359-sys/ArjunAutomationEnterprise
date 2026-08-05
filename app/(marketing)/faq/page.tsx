import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { FaqAccordionStatic } from "@/src/modules/company-launch-kit/components/FaqAccordionStatic";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { FAQ_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { buildFaqJsonLd, buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "FAQ",
    description:
        "Answers to common questions about Arjun Automation platform implementation, AI workers, security, integrations, and managed support.",
    path: MARKETING_ROUTES.faq,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "FAQ", path: PAGE.path },
];

export default function FaqPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
                extra={[buildFaqJsonLd(FAQ_CONTENT.items)]}
            />
            <PremiumPageShell
                title="Frequently Asked Questions"
                description="Clear answers about our platform, delivery model, security, and support."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />
                <FaqAccordionStatic />
                <p className="mt-10 text-sm text-[var(--premium-fg-muted)]">
                    Still have questions?{" "}
                    <Link href={MARKETING_ROUTES.contact} className="font-medium text-indigo-700 hover:text-indigo-600">
                        Contact our team
                    </Link>{" "}
                    or explore our{" "}
                    <Link href={MARKETING_ROUTES.resources} className="font-medium text-indigo-700 hover:text-indigo-600">
                        resources
                    </Link>
                    .
                </p>
            </PremiumPageShell>
            <CtaSection primaryLabel="Book Consultation" secondaryLabel="View Pricing" secondaryHref={MARKETING_ROUTES.pricing} />
        </>
    );
}
