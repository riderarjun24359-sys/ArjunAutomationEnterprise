import { verifyBrandBookCompleteness } from "@/src/modules/brand-os/lib/completeness";
import type { BrandDocument, BrandDocumentCategory, BrandDocumentRegistry } from "@/src/modules/brand-os/types";

export const BRAND_DOCUMENTS: BrandDocumentRegistry = {
    "brand-book": {
        id: "brand-book",
        title: "Brand Book",
        category: "foundation",
        description: "Official brand foundation: story, values, messaging, and voice guidelines.",
        path: "content/brand-book.md",
        pdfReady: true,
        requiredSections: [
            "Company Story",
            "Mission",
            "Vision",
            "Core Values",
            "Brand Promise",
            "Positioning Statement",
            "UVP",
            "Target Audience",
            "Industries Served",
            "Customer Personas",
            "Brand Personality",
            "Tone of Voice",
            "Writing Guidelines",
            "Messaging Framework",
            "Elevator Pitch",
            "Tagline Options",
            "Brand Do's",
            "Brand Don'ts",
        ],
    },
    "visual-identity": {
        id: "visual-identity",
        title: "Visual Identity",
        category: "foundation",
        description: "Color system, typography, logo usage, spacing, and UI design language.",
        path: "content/visual-identity.md",
        pdfReady: true,
    },
    "company-profile": {
        id: "company-profile",
        title: "Company Profile",
        category: "foundation",
        description: "About us, services, industries, delivery methodology, and contact.",
        path: "content/company-profile.md",
        pdfReady: true,
    },
    "services-index": {
        id: "services-index",
        title: "Service Library",
        category: "services",
        description: "Overview of Arjun Automation service offerings.",
        path: "content/services/index.md",
        pdfReady: true,
    },
    "platform-implementation": {
        id: "platform-implementation",
        title: "Platform Implementation",
        category: "services",
        description: "Full-stack enterprise platform deployment and configuration.",
        path: "content/services/platform-implementation.md",
        pdfReady: true,
        serviceFields: ["Description", "Problems Solved", "Deliverables", "Benefits", "Timeline", "Ideal Customer", "Pricing Structure"],
    },
    "industry-pack-deployment": {
        id: "industry-pack-deployment",
        title: "Industry Pack Deployment",
        category: "services",
        description: "Pre-built industry operating systems for rapid go-live.",
        path: "content/services/industry-pack-deployment.md",
        pdfReady: true,
        serviceFields: ["Description", "Problems Solved", "Deliverables", "Benefits", "Timeline", "Ideal Customer", "Pricing Structure"],
    },
    "ai-worker-integration": {
        id: "ai-worker-integration",
        title: "AI Worker Integration",
        category: "services",
        description: "Deploy AI workers across BA, architecture, development, QA, and DevOps.",
        path: "content/services/ai-worker-integration.md",
        pdfReady: true,
        serviceFields: ["Description", "Problems Solved", "Deliverables", "Benefits", "Timeline", "Ideal Customer", "Pricing Structure"],
    },
    "enterprise-consulting": {
        id: "enterprise-consulting",
        title: "Enterprise Consulting",
        category: "services",
        description: "Strategic advisory for digital transformation and operating model design.",
        path: "content/services/enterprise-consulting.md",
        pdfReady: true,
        serviceFields: ["Description", "Problems Solved", "Deliverables", "Benefits", "Timeline", "Ideal Customer", "Pricing Structure"],
    },
    "managed-support": {
        id: "managed-support",
        title: "Managed Support",
        category: "services",
        description: "Ongoing platform operations, monitoring, and customer success.",
        path: "content/services/managed-support.md",
        pdfReady: true,
        serviceFields: ["Description", "Problems Solved", "Deliverables", "Benefits", "Timeline", "Ideal Customer", "Pricing Structure"],
    },
    "proposal-template": {
        id: "proposal-template",
        title: "Proposal Template",
        category: "sales-kit",
        description: "Standard proposal structure for client engagements.",
        path: "content/sales-kit/proposal-template.md",
        pdfReady: true,
    },
    "quotation-template": {
        id: "quotation-template",
        title: "Quotation Template",
        category: "sales-kit",
        description: "Pricing quotation format for scoped engagements.",
        path: "content/sales-kit/quotation-template.md",
        pdfReady: true,
    },
    "statement-of-work": {
        id: "statement-of-work",
        title: "Statement of Work",
        category: "sales-kit",
        description: "SOW template with scope, milestones, and acceptance criteria.",
        path: "content/sales-kit/statement-of-work.md",
        pdfReady: true,
    },
    "client-onboarding-checklist": {
        id: "client-onboarding-checklist",
        title: "Client Onboarding Checklist",
        category: "sales-kit",
        description: "Step-by-step checklist for new client onboarding.",
        path: "content/sales-kit/client-onboarding-checklist.md",
        pdfReady: true,
    },
    "discovery-questionnaire": {
        id: "discovery-questionnaire",
        title: "Discovery Questionnaire",
        category: "sales-kit",
        description: "Pre-engagement discovery questions for sales and delivery teams.",
        path: "content/sales-kit/discovery-questionnaire.md",
        pdfReady: true,
    },
    faq: {
        id: "faq",
        title: "Sales FAQ",
        category: "sales-kit",
        description: "Frequently asked questions for prospects and sales conversations.",
        path: "content/sales-kit/faq.md",
        pdfReady: true,
    },
    "email-templates": {
        id: "email-templates",
        title: "Email Templates",
        category: "sales-kit",
        description: "Outreach, follow-up, and onboarding email templates.",
        path: "content/sales-kit/email-templates.md",
        pdfReady: true,
    },
    "enterprise-brand-book-v1": {
        id: "enterprise-brand-book-v1",
        title: "Enterprise Brand Book v1.0",
        category: "foundation",
        description: "Complete Enterprise Brand Identity System — strategy, logo, visual language, applications, digital rules.",
        path: "content/enterprise-brand-book-v1.md",
        pdfReady: true,
    },
    "logo-system": {
        id: "logo-system",
        title: "Logo System",
        category: "foundation",
        description: "Vertex Arc Mark specifications, variants, safe area, and usage rules.",
        path: "content/logo-system.md",
        pdfReady: true,
    },
    "brand-applications": {
        id: "brand-applications",
        title: "Brand Applications",
        category: "foundation",
        description: "Business card, letterhead, proposal, invoice, social, and presentation standards.",
        path: "content/brand-applications.md",
        pdfReady: true,
    },
    "digital-design-language": {
        id: "digital-design-language",
        title: "Digital Design Language",
        category: "foundation",
        description: "Product UI rules for buttons, inputs, cards, navigation, and animations.",
        path: "content/digital-design-language.md",
        pdfReady: true,
    },
};

export const BRAND_ASSET_FOLDERS = [
    "logos",
    "icons",
    "fonts",
    "social",
    "templates",
    "presentations",
    "proposals",
    "backgrounds",
    "illustrations",
] as const;

export function getDocumentsByCategory(category: BrandDocumentCategory): BrandDocument[] {
    return Object.values(BRAND_DOCUMENTS).filter((doc) => doc.category === category);
}

export function getDocumentById(id: string): BrandDocument | undefined {
    return BRAND_DOCUMENTS[id];
}

export function getAllDocuments(): BrandDocument[] {
    return Object.values(BRAND_DOCUMENTS);
}

export function checkDocumentCompleteness(content: string, document: BrandDocument): { complete: boolean; missing: string[] } {
    const missing: string[] = [];

    if (document.id === "brand-book") {
        const result = verifyBrandBookCompleteness(content);
        return { complete: result.complete, missing: result.missing };
    }

    if (document.serviceFields) {
        for (const field of document.serviceFields) {
            const pattern = new RegExp(`^##\\s+${field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im");
            if (!pattern.test(content)) {
                missing.push(field);
            }
        }
    }

    return { complete: missing.length === 0, missing };
}
