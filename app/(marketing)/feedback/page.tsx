import type { Metadata } from "next";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { FeedbackForm } from "@/src/modules/soft-launch/components/FeedbackForm";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Feedback",
    description: "Share soft-launch feedback with the Arjun Automation support team.",
    path: MARKETING_ROUTES.feedback,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Feedback", path: PAGE.path },
];

export default function FeedbackPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell title={PAGE.title} description="Tell us what is working and what needs polish before general availability.">
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="mx-auto mt-10 max-w-xl">
                    <FeedbackForm />
                </div>
            </PremiumPageShell>
        </>
    );
}
