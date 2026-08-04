import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyLayout } from "@/src/modules/company-launch-kit/components/CaseStudyLayout";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Case Studies",
    description: "Enterprise automation case studies from Arjun Automation — measurable outcomes across industries.",
    path: "/case-studies",
});

const caseStudies = [
    {
        slug: "school-management",
        title: "12-Campus School Chain Unified in 90 Days",
        industry: "Education",
        client: "Multi-campus education group, 8,000+ students",
        challenge: PORTFOLIO_ITEMS.find((p) => p.slug === "school-management")!.challenge,
        solution: PORTFOLIO_ITEMS.find((p) => p.slug === "school-management")!.solution,
        results: PORTFOLIO_ITEMS.find((p) => p.slug === "school-management")!.results,
    },
    {
        slug: "ai-agents",
        title: "AI Worker Workforce Cuts Delivery Time 40%",
        industry: "Technology",
        client: "Series B SaaS company, 200 employees",
        challenge: PORTFOLIO_ITEMS.find((p) => p.slug === "ai-agents")!.challenge,
        solution: PORTFOLIO_ITEMS.find((p) => p.slug === "ai-agents")!.solution,
        results: PORTFOLIO_ITEMS.find((p) => p.slug === "ai-agents")!.results,
    },
    {
        slug: "business-automation",
        title: "25-Location Retail Group Standardizes Operations",
        industry: "Retail",
        client: "Regional retail group, 25 locations",
        challenge: PORTFOLIO_ITEMS.find((p) => p.slug === "business-automation")!.challenge,
        solution: PORTFOLIO_ITEMS.find((p) => p.slug === "business-automation")!.solution,
        results: PORTFOLIO_ITEMS.find((p) => p.slug === "business-automation")!.results,
    },
];

export default function CaseStudiesPage() {
    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-indigo-950">Case Studies</h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        Measurable outcomes from enterprise automation deployments.
                    </p>
                </div>
            </section>

            <section className="py-16 space-y-16">
                {caseStudies.map((study) => (
                    <div key={study.slug}>
                        <CaseStudyLayout
                            title={study.title}
                            industry={study.industry}
                            client={study.client}
                            challenge={study.challenge}
                            solution={study.solution}
                            results={study.results}
                        />
                        <div className="mx-auto max-w-4xl px-6 lg:px-8 mt-4">
                            <Link href={MARKETING_ROUTES.portfolioItem(study.slug)} className="text-sm font-medium text-indigo-700 hover:text-indigo-600">
                                View full portfolio entry &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            <CtaSection />
        </>
    );
}
