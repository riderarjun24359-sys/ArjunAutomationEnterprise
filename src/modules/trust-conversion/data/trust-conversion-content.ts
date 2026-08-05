import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import type {
    ProcessStep,
    ServicePreview,
    TrustBadge,
    TrustCounter,
    TrustLogo,
    TrustMetric,
    ValueCard,
} from "@/src/modules/trust-conversion/types";

export const TRUSTED_BY_CONTENT = {
    title: "Trusted by growing enterprises",
    subtitle: "Organizations across industries rely on Arjun Automation for mission-critical operations.",
    clientLogos: [
        { name: "Nova Manufacturing", initials: "NM" },
        { name: "Helix Health Group", initials: "HH" },
        { name: "Summit Retail Co.", initials: "SR" },
        { name: "Atlas Professional", initials: "AP" },
        { name: "Vertex Hospitality", initials: "VH" },
        { name: "Pioneer Logistics", initials: "PL" },
    ] satisfies TrustLogo[],
    industries: [
        "Manufacturing",
        "Healthcare",
        "Retail & Commerce",
        "Professional Services",
        "Hospitality",
        "Education",
    ],
    technologies: [
        "Next.js",
        "TypeScript",
        "Supabase",
        "Cloud-Native APIs",
        "Enterprise Integrations",
        "AI Orchestration",
    ],
    badges: [
        { label: "SOC 2 Ready", description: "Enterprise security controls and audit readiness" },
        { label: "RLS Enforced", description: "Row-level security on every tenant data path" },
        { label: "ISO Aligned", description: "Processes aligned with ISO 27001 practices" },
        { label: "GDPR Aware", description: "Privacy-by-design data handling" },
    ] satisfies TrustBadge[],
    counters: [
        { value: 120, suffix: "+", label: "Projects Delivered" },
        { value: 480, suffix: "+", label: "Automations Built" },
        { value: 36, suffix: "+", label: "Business Solutions" },
        { value: 98, suffix: "%", label: "Client Retention" },
    ] satisfies TrustCounter[],
};

export const WHY_ARJUN_CONTENT = {
    title: "Why Arjun Automation",
    subtitle: "Eight outcomes that matter to leadership teams — not feature lists.",
    cards: [
        {
            title: "Revenue Growth",
            outcome: "Shorten sales cycles and increase win rates",
            description: "Unified CRM, pipeline intelligence, and automated follow-ups keep revenue teams focused on closing — not chasing spreadsheets.",
            icon: "trending",
        },
        {
            title: "Time Savings",
            outcome: "Reclaim hundreds of hours per quarter",
            description: "Replace manual handoffs with workflow automation so teams execute faster without adding headcount.",
            icon: "clock",
        },
        {
            title: "AI Automation",
            outcome: "Deploy AI workers with audit trails",
            description: "BA, Architect, Dev, QA, and Customer Success agents execute repeatable work with human approval gates.",
            icon: "brain",
        },
        {
            title: "Scalability",
            outcome: "Grow from one location to enterprise scale",
            description: "Multi-tenant architecture, modular industry packs, and API-first design support expansion without replatforming.",
            icon: "layers",
        },
        {
            title: "Enterprise Security",
            outcome: "Protect data at every layer",
            description: "Row-level security, tenant isolation, encrypted transport, and governance modules built in from day one.",
            icon: "shield",
        },
        {
            title: "Performance",
            outcome: "Sub-second experiences at scale",
            description: "Production-grade engineering with optimized delivery, caching strategies, and Core Web Vitals discipline.",
            icon: "zap",
        },
        {
            title: "Long-term Partnership",
            outcome: "A team that stays after go-live",
            description: "We operate as an extension of your organization — roadmap planning, upgrades, and continuous improvement.",
            icon: "handshake",
        },
        {
            title: "Dedicated Support",
            outcome: "Expert response when it counts",
            description: "24/7 platform monitoring, SLA-backed support tiers, and direct access to engineers who built your system.",
            icon: "headphones",
        },
    ] satisfies ValueCard[],
};

export const DELIVERY_PROCESS_CONTENT = {
    title: "Enterprise delivery process",
    subtitle: "A proven nine-stage methodology from discovery through long-term support.",
    steps: [
        { step: 1, title: "Discover", description: "Requirements workshops, stakeholder interviews, and current-state mapping." },
        { step: 2, title: "Strategy", description: "Business case, ROI model, and phased rollout plan aligned to priorities." },
        { step: 3, title: "Architecture", description: "System design, integration map, security model, and scalability blueprint." },
        { step: 4, title: "Design", description: "UX flows, data models, and approval-ready prototypes for key workflows." },
        { step: 5, title: "Development", description: "Agile sprints with milestone demos, code review, and continuous integration." },
        { step: 6, title: "Testing", description: "Functional, regression, performance, and UAT with documented sign-off." },
        { step: 7, title: "Deployment", description: "Zero-downtime release, data migration, and production cutover support." },
        { step: 8, title: "Optimization", description: "Post-launch tuning, automation refinement, and adoption analytics." },
        { step: 9, title: "Support", description: "Ongoing monitoring, enhancements, and customer success partnership." },
    ] satisfies ProcessStep[],
};

export const SERVICES_PREVIEW_CONTENT = {
    title: "Services that drive business outcomes",
    subtitle: "Every engagement is scoped to measurable value — with clear benefits and a direct path to action.",
    services: [
        {
            title: "AI Automation",
            businessValue: "Eliminate repetitive work and accelerate decision cycles",
            benefits: ["Workflow orchestration", "AI worker deployment", "Approval-gated automation"],
            cta: { label: "Explore AI Automation", href: MARKETING_ROUTES.launchAutomation },
            icon: "bot",
        },
        {
            title: "Custom Software",
            businessValue: "Purpose-built systems aligned to your operating model",
            benefits: ["Full-stack development", "API integrations", "Enterprise architecture"],
            cta: { label: "Start a Project", href: MARKETING_ROUTES.contact },
            icon: "code",
        },
        {
            title: "Business Websites",
            businessValue: "Premium digital presence that converts qualified leads",
            benefits: ["Performance-first builds", "SEO architecture", "Conversion optimization"],
            cta: { label: "View Portfolio", href: MARKETING_ROUTES.portfolio },
            icon: "globe",
        },
        {
            title: "School ERP",
            businessValue: "Unified admissions, finance, and parent communication",
            benefits: ["Attendance & grading", "Fee management", "Multi-campus support"],
            cta: { label: "Industry Solutions", href: MARKETING_ROUTES.industries },
            icon: "graduation",
        },
        {
            title: "CRM Systems",
            businessValue: "Pipeline visibility and revenue predictability",
            benefits: ["Lead scoring", "Client portals", "Forecast dashboards"],
            cta: { label: "CRM Guide", href: MARKETING_ROUTES.launchCrm },
            icon: "users",
        },
        {
            title: "E-Commerce",
            businessValue: "Omnichannel sales with inventory and fulfillment control",
            benefits: ["Catalog management", "Payment integration", "Order automation"],
            cta: { label: "Discuss E-Commerce", href: MARKETING_ROUTES.contact },
            icon: "cart",
        },
        {
            title: "AI Chatbots",
            businessValue: "24/7 intelligent support without sacrificing quality",
            benefits: ["Knowledge-base grounding", "Escalation routing", "Conversation analytics"],
            cta: { label: "AI Capabilities", href: MARKETING_ROUTES.services },
            icon: "message",
        },
        {
            title: "Integrations",
            businessValue: "Connect existing tools into one coherent operation",
            benefits: ["ERP & accounting sync", "Webhook pipelines", "Legacy system bridges"],
            cta: { label: "Integration Scope", href: MARKETING_ROUTES.contact },
            icon: "plug",
        },
        {
            title: "Maintenance",
            businessValue: "Keep production environments secure and current",
            benefits: ["Patch management", "Uptime monitoring", "Performance tuning"],
            cta: { label: "Support Plans", href: MARKETING_ROUTES.contact },
            icon: "wrench",
        },
    ] satisfies ServicePreview[],
};

export const TRUST_METRICS_CONTENT = {
    title: "Trust metrics that matter",
    subtitle: "How we measure success beyond the launch date.",
    metrics: [
        {
            title: "Fast Response",
            description: "Initial engineering response within one business day on all qualified inquiries.",
            icon: "timer",
        },
        {
            title: "Enterprise Quality",
            description: "Code review, automated testing, and documentation standards on every delivery.",
            icon: "award",
        },
        {
            title: "Secure Delivery",
            description: "Security review gates, encrypted credentials, and audit-ready deployment practices.",
            icon: "lock",
        },
        {
            title: "Scalable Architecture",
            description: "Systems designed for 10× growth without architectural rewrites.",
            icon: "expand",
        },
        {
            title: "Long-term Support",
            description: "Post-launch partnership with SLA tiers and dedicated success management.",
            icon: "life-buoy",
        },
        {
            title: "Transparent Communication",
            description: "Weekly progress reports, milestone demos, and direct access to delivery leads.",
            icon: "messages",
        },
    ] satisfies TrustMetric[],
};
