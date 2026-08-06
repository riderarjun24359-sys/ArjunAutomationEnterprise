import type { Metadata } from "next";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { UpgradeFlowPanel } from "@/src/modules/soft-launch/components/UpgradeFlowPanel";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Upgrade plan",
    description: "Compare Free Trial, Starter, Professional, and Enterprise plans and continue to the soft-launch upgrade flow.",
    path: MARKETING_ROUTES.upgrade,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Pricing", path: MARKETING_ROUTES.pricing },
    { name: "Upgrade", path: PAGE.path },
];

export default function UpgradePage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell title={PAGE.title} description={PAGE.description}>
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="mt-10">
                    <UpgradeFlowPanel />
                </div>
            </PremiumPageShell>
        </>
    );
}
