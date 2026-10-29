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
        title: "Multi-Campus School Chain Unified on One Platform",
        industry: "Education",
        client: "Multi-campus education group",
    },
    "ai-agents": {
        title: "AI Worker Roles Embedded in the Delivery Lifecycle",
        industry: "Technology",
        client: "B2B SaaS company",
    },
    "business-automation": {
        title: "Retail Group Standardizes Operations Across Locations",
        industry: "Retail",
        client: "Regional retail group",
    },
    "ai-automation": {
        title: "AI Workflow Automation Across Intake and Reporting",
        industry: "Professional Services",
        client: "Professional services firm",
    },
    crm: {
        title: "CRM Unifying Pipeline, Delivery, and Finance",
        industry: "SaaS",
        client: "Growing SaaS company",
    },
    erp: {
        title: "ERP Hub Ending Duplicate Data Entry",
        industry: "Manufacturing",
        client: "Manufacturing distributor",
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
