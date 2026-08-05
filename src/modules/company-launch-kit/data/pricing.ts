import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

export interface PricingTier {
    name: string;
    description: string;
    scope: string[];
    indicativeRange: string;
    highlighted?: boolean;
}

export const PRICING_PHILOSOPHY = {
    title: "Transparent, outcome-aligned pricing",
    principles: [
        "Milestone-based billing after customer validation — not upfront waterfall contracts",
        "Clear scope tiers so you know what you are buying before we start",
        "Platform subscription quoted separately from implementation services",
        "Enterprise engagements scoped after technical discovery",
        "No hidden fees — change requests billed at agreed T&M rates",
    ],
};

export const IMPLEMENTATION_TIERS: PricingTier[] = [
    {
        name: "Essential",
        description: "Core platform for growing organizations ready to unify operations.",
        scope: ["CRM, Projects, Tasks, Finance", "Enterprise identity (MFA, RBAC)", "Standard integrations", "Admin and user training"],
        indicativeRange: "$45,000 – $75,000",
    },
    {
        name: "Professional",
        description: "Expanded module suite with integrations for multi-department operations.",
        scope: ["Everything in Essential", "HR, Inventory, Documents", "Up to 2 external integrations", "Data migration (agreed volumes)"],
        indicativeRange: "$75,000 – $120,000",
        highlighted: true,
    },
    {
        name: "Enterprise",
        description: "Full platform with AI workers, complex integrations, and enterprise governance.",
        scope: ["Everything in Professional", "Full module suite + AI workers", "Up to 3 integrations + data migration", "Dedicated project team"],
        indicativeRange: "$120,000 – $200,000",
    },
];

export const MANAGED_SUPPORT_TIERS: PricingTier[] = [
    {
        name: "Standard",
        description: "Business-hours monitoring and support for stable production environments.",
        scope: ["Business-hours support", "Monthly platform updates", "Health reporting", "Email and ticket support"],
        indicativeRange: "From $2,500/month",
    },
    {
        name: "Professional",
        description: "Extended coverage with dedicated CSM for growing deployments.",
        scope: ["Extended-hours support", "Dedicated CSM", "Proactive health monitoring", "Quarterly optimization reviews"],
        indicativeRange: "From $5,000/month",
        highlighted: true,
    },
    {
        name: "Enterprise",
        description: "24/7 SLA-backed support for mission-critical operations.",
        scope: ["24/7 monitoring and response", "Dedicated support team", "99.9% uptime SLA", "Executive business reviews"],
        indicativeRange: "Custom — contact sales",
    },
];

export const ENTERPRISE_ENGAGEMENT = {
    title: "Enterprise engagement model",
    description:
        "For organizations with complex requirements — multi-entity structures, regulated industries, custom integrations, or global rollouts — we follow a structured enterprise engagement model.",
    steps: [
        { title: "Discovery & Assessment", description: "Technical discovery, stakeholder workshops, and scope definition" },
        { title: "Proposal & Business Case", description: "Detailed SOW, milestone plan, and ROI modeling" },
        { title: "Pilot & Validate", description: "Controlled pilot with measurable success criteria" },
        { title: "Scale & Deploy", description: "Phased rollout across locations, departments, or entities" },
        { title: "Operate & Optimize", description: "Managed support with continuous improvement" },
    ],
    cta: { label: "Book Enterprise Consultation", href: MARKETING_ROUTES.contact },
};
