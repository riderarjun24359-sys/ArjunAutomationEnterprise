import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Enterprise Automation Guide",
    description: "Free guide: How mid-market organizations deploy AI-first enterprise automation without integration debt.",
    path: "/launch/automation",
});

export default function LaunchAutomationPage() {
    const breadcrumbs = [
        { name: "Home", path: MARKETING_ROUTES.home },
        { name: "Automation Guide", path: "/launch/automation" },
    ];

    return (
        <>
            <MarketingStructuredData
                title="Enterprise Automation Guide"
                description="Free guide: How mid-market organizations deploy AI-first enterprise automation without integration debt."
                path="/launch/automation"
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="AI-First Enterprise Automation"
                description="How mid-market organizations escape tool sprawl, deploy AI workers, and reach production on a unified platform — with AI-generated first versions within hours."
            >
                <div className="space-y-16">
                    <section aria-labelledby="learn-heading">
                        <h2 id="learn-heading" className="text-2xl font-semibold text-[var(--premium-fg)]">
                            What you will learn
                        </h2>
                        <div className="mt-6 space-y-4">
                            {[
                                "Why automation projects miss their goals — and the four patterns to avoid",
                                "Platform vs. point solution: calculating true total cost of ownership",
                                "The AI-First Delivery Policy: Requirement Analysis → Solution Generation → Expert Review → Customer Validation → Secure Production Deployment",
                                "AI workers vs. chatbots: why execution beats conversation",
                                "Industry OS packs: Restaurant, Hospital, School, and Retail acceleration",
                                "Security checklist: RLS, tenant isolation, and audit trails before go-live",
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
                                Written by the Arjun Automation delivery team based on real enterprise implementations
                                across restaurants, healthcare, education, retail, and professional services.
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
                            <LeadForm source="launch-automation" compact submitLabel="Get the Guide" />
                        </div>
                    </section>
                </div>
            </PremiumPageShell>
            <CtaSection secondaryLabel="Explore Solutions" secondaryHref={MARKETING_ROUTES.solutions} />
        </>
    );
}
