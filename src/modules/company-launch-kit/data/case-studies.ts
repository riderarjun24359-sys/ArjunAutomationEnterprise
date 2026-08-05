import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { PORTFOLIO_ITEMS, type PortfolioItem } from "@/src/modules/company-launch-kit/data/portfolio";

export interface CaseStudyItem {
    slug: string;
    title: string;
    industry: string;
    client: string;
    challenge: string;
    solution: string;
    implementation: string;
    outcome: string;
    businessImpact: string;
    results: string[];
}

const CASE_STUDY_META: Record<string, { title: string; industry: string; client: string }> = {
    "school-management": {
        title: "12-Campus School Chain Unified on One Platform",
        industry: "Education",
        client: "Multi-campus education group, 8,000+ students",
    },
    "ai-agents": {
        title: "AI Worker Workforce Cuts Delivery Time 40%",
        industry: "Technology",
        client: "Series B SaaS company, 200 employees",
    },
    "business-automation": {
        title: "25-Location Retail Group Standardizes Operations",
        industry: "Retail",
        client: "Regional retail group, 25 locations",
    },
    "ai-automation": {
        title: "70% Reduction in Manual Processing",
        industry: "Professional Services",
        client: "400-person professional services firm",
    },
    crm: {
        title: "35% Increase in Qualified Pipeline",
        industry: "SaaS",
        client: "Growing SaaS company, 150 employees",
    },
    erp: {
        title: "80% Reduction in Reconciliation Time",
        industry: "Manufacturing",
        client: "Manufacturing distributor, 500 employees",
    },
};

function buildCaseStudyFromPortfolio(item: PortfolioItem): CaseStudyItem {
    const meta = CASE_STUDY_META[item.slug] ?? {
        title: item.title,
        industry: item.category,
        client: "Enterprise client",
    };

    return {
        slug: item.slug,
        title: meta.title,
        industry: meta.industry,
        client: meta.client,
        challenge: item.challenge,
        solution: item.solution,
        implementation: `We deployed ${item.features.length} core capabilities: ${item.features.join("; ")}.`,
        outcome: item.results.join(" "),
        businessImpact: item.benefits.join(" "),
        results: item.results,
    };
}

export const CASE_STUDY_SLUGS = ["school-management", "ai-agents", "business-automation", "ai-automation", "crm", "erp"] as const;

export const CASE_STUDY_ITEMS: CaseStudyItem[] = CASE_STUDY_SLUGS.map((slug) => {
    const portfolio = PORTFOLIO_ITEMS.find((p) => p.slug === slug)!;
    return buildCaseStudyFromPortfolio(portfolio);
});

export function getCaseStudyItem(slug: string): CaseStudyItem | undefined {
    const portfolio = PORTFOLIO_ITEMS.find((p) => p.slug === slug);
    if (!portfolio || !CASE_STUDY_SLUGS.includes(slug as (typeof CASE_STUDY_SLUGS)[number])) return undefined;
    return buildCaseStudyFromPortfolio(portfolio);
}

export function getCaseStudyHref(slug: string): string {
    return MARKETING_ROUTES.caseStudyItem(slug);
}
