import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { BLOG_POSTS } from "@/src/modules/company-launch-kit/data/blog";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { SERVICE_ITEMS } from "@/src/modules/company-launch-kit/data/services";

export interface SearchIndexEntry {
    title: string;
    description: string;
    href: string;
    category: "Page" | "Service" | "Portfolio" | "Blog" | "Resource";
    keywords: string[];
}

const STATIC_PAGES: SearchIndexEntry[] = [
    { title: "Home", description: "Enterprise automation platform", href: MARKETING_ROUTES.home, category: "Page", keywords: ["home", "automation", "platform"] },
    { title: "About", description: "Our story, mission, and values", href: MARKETING_ROUTES.about, category: "Page", keywords: ["about", "company", "mission"] },
    { title: "Services", description: "Platform implementation and consulting", href: MARKETING_ROUTES.services, category: "Page", keywords: ["services", "implementation"] },
    { title: "Industries", description: "Industry operating systems", href: MARKETING_ROUTES.industries, category: "Page", keywords: ["industries", "healthcare", "retail"] },
    { title: "Case Studies", description: "Measurable automation outcomes", href: MARKETING_ROUTES.caseStudies, category: "Page", keywords: ["case studies", "results"] },
    { title: "Portfolio", description: "Featured enterprise work", href: MARKETING_ROUTES.portfolio, category: "Page", keywords: ["portfolio", "projects"] },
    { title: "Pricing", description: "Transparent pricing philosophy", href: MARKETING_ROUTES.pricing, category: "Page", keywords: ["pricing", "cost", "packages"] },
    { title: "FAQ", description: "Frequently asked questions", href: MARKETING_ROUTES.faq, category: "Page", keywords: ["faq", "questions", "help"] },
    { title: "Resources", description: "Guides, blog, and case studies", href: MARKETING_ROUTES.resources, category: "Page", keywords: ["resources", "guides", "blog"] },
    { title: "Contact", description: "Book a consultation", href: MARKETING_ROUTES.contact, category: "Page", keywords: ["contact", "consultation", "sales"] },
    { title: "Solutions", description: "Automation solutions by business need", href: MARKETING_ROUTES.solutions, category: "Page", keywords: ["solutions", "automation", "workflow", "integration"] },
    { title: "Platform Features", description: "Capabilities of the automation platform", href: MARKETING_ROUTES.features, category: "Page", keywords: ["features", "platform", "capabilities", "ai"] },
    { title: "School ERP", description: "School management and ERP software", href: MARKETING_ROUTES.schoolErp, category: "Page", keywords: ["school", "erp", "education", "students", "admissions"] },
    { title: "Careers", description: "Open roles and how we work", href: MARKETING_ROUTES.careers, category: "Page", keywords: ["careers", "jobs", "hiring", "roles"] },
    { title: "Help Center", description: "Answers and support resources", href: MARKETING_ROUTES.help, category: "Page", keywords: ["help", "support", "answers"] },
    { title: "Automation Guide", description: "Enterprise automation launch guide", href: MARKETING_ROUTES.launchAutomation, category: "Resource", keywords: ["automation", "guide", "launch"] },
    { title: "CRM Guide", description: "CRM implementation guide", href: MARKETING_ROUTES.launchCrm, category: "Resource", keywords: ["crm", "guide", "sales"] },
];

export const SEARCH_INDEX: SearchIndexEntry[] = [
    ...STATIC_PAGES,
    ...SERVICE_ITEMS.map((s) => ({
        title: s.title,
        description: s.tagline,
        href: MARKETING_ROUTES.serviceItem(s.slug),
        category: "Service" as const,
        keywords: [s.slug, ...s.technologies.map((t) => t.toLowerCase())],
    })),
    ...PORTFOLIO_ITEMS.map((p) => ({
        title: p.title,
        description: p.tagline,
        href: MARKETING_ROUTES.portfolioItem(p.slug),
        category: "Portfolio" as const,
        keywords: [p.slug, p.category.toLowerCase()],
    })),
    ...BLOG_POSTS.map((p) => ({
        title: p.title,
        description: p.excerpt,
        href: MARKETING_ROUTES.blogPost(p.slug),
        category: "Blog" as const,
        keywords: [p.slug, p.category.toLowerCase()],
    })),
];

export function searchContent(query: string, limit = 20): SearchIndexEntry[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return SEARCH_INDEX.filter((entry) => {
        const haystack = [entry.title, entry.description, entry.category, ...entry.keywords].join(" ").toLowerCase();
        return normalized.split(/\s+/).every((term) => haystack.includes(term));
    }).slice(0, limit);
}
