import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Refund Policy",
    description: "Refund policy for Arjun Automation Enterprises subscriptions and implementation retainers.",
    path: MARKETING_ROUTES.refund,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    noIndex: true,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Refund Policy", path: PAGE.path },
];

export default function RefundPolicyPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell title={PAGE.title} description="Clear refund terms for platform subscriptions and professional services.">
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="mx-auto mt-10 max-w-3xl space-y-6 text-[var(--premium-fg-muted)] leading-relaxed">
                    <p>
                        Free Trial plans are complimentary for 14 days and do not require payment. If you upgrade to a paid platform subscription (Starter or Professional), you may request a refund within 7 days of the first charge when platform access has not been used for production workloads.
                    </p>
                    <p>
                        Enterprise agreements and implementation retainers follow the statement of work. Milestone payments already accepted for completed discovery or delivery work are non-refundable. Unused prepaid managed-support months may be credited toward future service by written agreement.
                    </p>
                    <p>
                        To request a refund, contact us on WhatsApp at +91 73370 28357 with your organization name, invoice ID, and reason. We respond within 3 business days.
                    </p>
                    <p>
                        See also our <Link className="underline" href={MARKETING_ROUTES.terms}>Terms of Service</Link> and <Link className="underline" href={MARKETING_ROUTES.privacy}>Privacy Policy</Link>.
                    </p>
                </div>
            </PremiumPageShell>
            <CtaSection title="Questions about billing?" description="Our support team can clarify refund eligibility before you upgrade." />
        </>
    );
}

