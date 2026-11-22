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

/**
 * First-customer pilot programme.
 *
 * WHY THIS EXISTS
 * ---------------
 * The standard tiers above assume an established delivery team and a mature
 * client organisation. For an early customer that is not yet true, those tiers
 * are the wrong starting point — and a business with no reference clients
 * cannot sell a five-figure engagement to anyone.
 *
 * A pilot removes that deadlock: the first few customers get a reduced setup
 * fee in exchange for something we genuinely need more than money — a real
 * deployment we can point at, and a written testimonial with their permission
 * to publish.
 *
 * This is ADDITIVE. It sits above the standard tiers and does not discount or
 * replace them. Once a pilot converts to a full engagement, normal pricing
 * applies from the upgrade point onward.
 *
 * EDITING THE NUMBERS
 * -------------------
 * `slots` is the only quantity that matters commercially — it creates the
 * scarcity. `setupFee` is a placeholder: set it to whatever your real floor is.
 * If a pilot would cost you money to deliver, delete the section from
 * `app/(marketing)/pricing/page.tsx` rather than pricing below your cost.
 */
export const PILOT_PROGRAMME = {
    title: "First-customer pilot programme",
    subtitle:
        "We are early. Rather than sell you a five-figure engagement on claims alone, we are looking for a small number of founding customers to build the reference base with — in exchange for a reduced setup fee and a testimonial we can publish.",
    slots: 3,
    slotsLabel: "pilot slots available this quarter",
    setupFee: "Contact for INR Pricing",
    setupFeeNote: "setup fee, credited in full against a full engagement if you continue",
    includes: [
        "One real workflow automated end to end — not a demo, not a sandbox",
        "Direct access to the founder and the engineers building it",
        "60 days of priority support and changes after go-live",
        "A written testimonial with your name and business, published with your permission",
    ],
    expectations: [
        "A working system in your business within weeks, on a scope we agree up front",
        "Honest feedback — including about what we got wrong",
        "A monthly check-in for the first three months after go-live",
    ],
    honest: "This is not charity work, and it is not a discount that quietly becomes permanent. It is a trade: a low setup fee for a real deployment and a reference we can be honest about. If the fit is wrong, we will tell you so before you spend anything.",
    ctaLabel: "Apply for a pilot slot",
} as const;

export const IMPLEMENTATION_TIERS: PricingTier[] = [
    {
        name: "Essential",
        description: "Core platform for growing organizations ready to unify operations.",
        scope: ["CRM, Projects, Tasks, Finance", "Enterprise identity (MFA, RBAC)", "Standard integrations", "Admin and user training"],
        indicativeRange: "Custom Enterprise Pricing — INR",
    },
    {
        name: "Professional",
        description: "Expanded module suite with integrations for multi-department operations.",
        scope: ["Everything in Essential", "HR, Inventory, Documents", "Up to 2 external integrations", "Data migration (agreed volumes)"],
        indicativeRange: "Custom Enterprise Pricing — INR",
        highlighted: true,
    },
    {
        name: "Enterprise",
        description: "Full platform with AI workers, complex integrations, and enterprise governance.",
        scope: ["Everything in Professional", "Full module suite + AI workers", "Up to 3 integrations + data migration", "Dedicated project team"],
        indicativeRange: "Custom Enterprise Pricing — INR",
    },
];

export const MANAGED_SUPPORT_TIERS: PricingTier[] = [
    {
        name: "Standard",
        description: "Business-hours monitoring and support for stable production environments.",
        scope: ["Business-hours support", "Monthly platform updates", "Health reporting", "Email and ticket support"],
        indicativeRange: "Contact for INR Pricing",
    },
    {
        name: "Professional",
        description: "Extended coverage with dedicated CSM for growing deployments.",
        scope: ["Extended-hours support", "Dedicated CSM", "Proactive health monitoring", "Quarterly optimization reviews"],
        indicativeRange: "Contact for INR Pricing",
        highlighted: true,
    },
    {
        name: "Enterprise",
        description: "Extended-coverage support for mission-critical operations (terms by agreement).",
        scope: ["Extended-hours monitoring and response", "Dedicated support team", "Platform health and readiness endpoints", "Executive business reviews"],
        indicativeRange: "Contact for INR Pricing",
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


/**
 * Public project pricing — single source of truth for the rebuilt homepage
 * and the new /pricing page. All amounts are INR starting prices.
 */
export const PROJECT_PRICING = [
    {
        id: "starter-website",
        name: "Starter Website",
        price: "₹35,000",
        numericPrice: 35000,
        qualifier: "Starts from",
        summary: "A focused, custom website built to explain your offer and capture enquiries.",
        features: ["5–7 custom pages", "Mobile-responsive layouts", "SEO foundations and page metadata", "WhatsApp and enquiry capture"],
    },
    {
        id: "automation-sprint",
        name: "Automation Sprint",
        price: "₹45,000",
        numericPrice: 45000,
        qualifier: "Starts from",
        summary: "Automate one or two repetitive workflows using the tools you already have.",
        features: ["1–2 agreed core workflows", "Lead intake and routing", "WhatsApp or email follow-ups", "Team alerts and basic reporting"],
    },
    {
        id: "growth-platform",
        name: "Growth Platform",
        price: "₹1,25,000",
        numericPrice: 125000,
        qualifier: "Starts from",
        summary: "A connected website, workflow automation and a tailored customer or team portal.",
        features: ["Custom website", "Multi-step workflow automation", "AI integrations where appropriate", "Custom CRM or client portal"],
        highlighted: true,
    },
    {
        id: "custom-erp",
        name: "Enterprise / Custom ERP",
        price: "₹2,50,000+",
        numericPrice: 250000,
        qualifier: "Starts from",
        summary: "A scoped business system for complex operations and role-based teams.",
        features: ["Custom ERP or CRM modules", "Role-based access design", "Agreed data migration", "Integration and go-live planning"],
    },
] as const;

export const MANAGED_SUPPORT_PRICING = [
    {
        id: "care",
        name: "Care Plan",
        price: "₹10,000",
        period: "/ month",
        features: ["Hosting management", "Uptime monitoring", "Security updates", "Minor text and bug fixes"],
    },
    {
        id: "growth-support",
        name: "Growth Support",
        price: "₹25,000",
        period: "/ month",
        features: ["Active workflow and AI monitoring", "API maintenance", "Up to 8 hours of enhancements per month", "1-business-day response SLA"],
    },
] as const;
