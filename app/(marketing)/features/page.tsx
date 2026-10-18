import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { SOFT_LAUNCH_FEATURES } from "@/src/modules/soft-launch/data/launch-assets";
import { buildMetadata } from "@/src/lib/seo";
import { ROUTES } from "@/src/constants/routes";

const PAGE = {
    title: "Features",
    description: "Explore Arjun Automation platform features spanning CRM, projects, success, finance, HRMS, integrations, and security.",
    path: MARKETING_ROUTES.features,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    keywords: ["features", "enterprise platform", "CRM", "HRMS", "security"],
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Features", path: PAGE.path },
];

export default function FeaturesPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell title={PAGE.title} description={PAGE.description}>
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {SOFT_LAUNCH_FEATURES.map((feature) => (
                        <article key={feature.title} className="rounded-3xl border border-[var(--premium-border)] bg-[var(--premium-bg-elevated)] p-6">
                            <h2 className="text-xl font-semibold">{feature.title}</h2>
                            <p className="mt-3 text-sm text-[var(--premium-fg-muted)]">{feature.description}</p>
                        </article>
                    ))}
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                    <Link href={ROUTES.auth.signUp} className="rounded-full bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white">
                        Start free trial
                    </Link>
                    <Link href={MARKETING_ROUTES.pricing} className="rounded-full border border-[var(--premium-border)] px-5 py-2.5 text-sm font-semibold">
                        View pricing
                    </Link>
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
