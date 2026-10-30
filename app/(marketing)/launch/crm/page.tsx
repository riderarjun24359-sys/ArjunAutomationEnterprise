import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "CRM Transformation Guide",
    description: "Free guide: Unified CRM implementation — from pipeline chaos to quote-to-cash with AI-first delivery.",
    path: "/launch/crm",
});

export default function LaunchCrmPage() {
    const breadcrumbs = [
        { name: "Home", path: MARKETING_ROUTES.home },
        { name: "CRM Guide", path: "/launch/crm" },
    ];

    return (
        <>
            <MarketingStructuredData
                title="CRM Transformation Guide"
                description="Free guide: Unified CRM implementation — from pipeline chaos to quote-to-cash with AI-first delivery."
                path="/launch/crm"
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="Unified CRM: Pipeline to Quote-to-Cash"
                description="Stop losing deals to inconsistent follow-up. Learn how growth-stage companies deploy enterprise CRM integrated with delivery, billing, and customer success."
            >
                <div className="space-y-16">
                    <section aria-labelledby="learn-heading">
                        <h2 id="learn-heading" className="text-2xl font-semibold text-[var(--premium-fg)]">
                            What you will learn
                        </h2>
                        <div className="mt-6 space-y-4">
                            {[
                                "The hidden cost of CRM + project + billing tool sprawl",
                                "Pipeline management that sales teams actually adopt",
                                "Connecting CRM to delivery and finance for quote-to-cash visibility",
                                "Client portals: self-service document sharing and status tracking",
                                "Revenue forecasting boards can trust",
                                "Customer health scores that predict renewal risk",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[var(--premium-fg-muted)] leading-relaxed">
                                    <span
                                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--dos-brand-primary)]"
                                        aria-hidden="true"
                                    />
                                    {item}
                                </li>
                            ))}
                            <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">
                                Based on how Arjun Automation CRM connects pipeline, delivery, and finance in one
                                workflow.
                            </p>
                        </div>
                    </section>

                    <section aria-labelledby="download-heading" className="premium-glass rounded-2xl p-8">
                        <h2 id="download-heading" className="text-lg font-semibold text-[var(--premium-fg)]">
                            Download the guide
                        </h2>
                        <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">
                            Enter your details and our team aims to send the guide within one business day.
                        </p>
                        <div className="mt-6">
                            <LeadForm source="launch-crm" compact submitLabel="Get the Guide" />
                        </div>
                    </section>
                </div>
            </PremiumPageShell>
            <CtaSection secondaryLabel="View Portfolio" secondaryHref={MARKETING_ROUTES.portfolio} />
        </>
    );
}
