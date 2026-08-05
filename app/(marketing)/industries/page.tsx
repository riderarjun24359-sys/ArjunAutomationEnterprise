import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Industries",
    description:
        "Arjun Automation serves restaurants, healthcare, education, retail, professional services, technology, and manufacturing with industry-specific OS packs.",
    path: MARKETING_ROUTES.industries,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Industries", path: PAGE.path },
];

const industries = [
    { name: "Restaurants & Hospitality", useCases: "Multi-location ops, kitchen workflows, POS integration", pack: "Restaurant OS" },
    { name: "Healthcare", useCases: "Patient flow, clinical ops, pharmacy, lab integration", pack: "Hospital OS" },
    { name: "Education", useCases: "Student lifecycle, academics, parent portals, finance", pack: "School OS" },
    { name: "Retail", useCases: "Inventory, POS, customer loyalty, multi-store analytics", pack: "Retail OS" },
    { name: "Professional Services", useCases: "CRM, projects, billing, client portals", pack: "Core Platform" },
    { name: "Technology & SaaS", useCases: "Internal ops, customer success, launch readiness", pack: "Core Platform" },
    { name: "Manufacturing & Distribution", useCases: "Inventory, procurement, workflow automation", pack: "Core Platform + ERP Integration" },
];

export default function IndustriesPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell
                title="Industries We Serve"
                description="Pre-built industry OS packs accelerate deployment by 60–70% compared to greenfield configuration."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[var(--premium-border)]">
                                <th className="pb-4 pr-4 text-sm font-semibold">Industry</th>
                                <th className="pb-4 pr-4 text-sm font-semibold">Primary Use Cases</th>
                                <th className="pb-4 text-sm font-semibold">Recommended Pack</th>
                            </tr>
                        </thead>
                        <tbody>
                            {industries.map((ind) => (
                                <tr key={ind.name} className="border-b border-[var(--premium-border)]">
                                    <td className="py-4 pr-4 font-medium">{ind.name}</td>
                                    <td className="py-4 pr-4 text-sm text-[var(--premium-fg-muted)]">{ind.useCases}</td>
                                    <td className="py-4 text-sm text-indigo-700">{ind.pack}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-8 text-sm text-[var(--premium-fg-muted)]">
                    Explore our{" "}
                    <Link href={MARKETING_ROUTES.portfolio} className="text-indigo-700 hover:text-indigo-600">
                        portfolio
                    </Link>{" "}
                    and{" "}
                    <Link href={MARKETING_ROUTES.caseStudies} className="text-indigo-700 hover:text-indigo-600">
                        case studies
                    </Link>{" "}
                    for industry-specific outcomes.
                </p>
            </PremiumPageShell>
            <CtaSection
                title="Industry-specific automation"
                description="Tell us about your industry and operational challenges. We will recommend the right pack and go-live plan."
            />
        </>
    );
}
