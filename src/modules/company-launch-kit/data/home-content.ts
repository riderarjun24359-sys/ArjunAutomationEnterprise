import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

export const HERO_CONTENT = {
    eyebrow: "Arjun Automation OS",
    headline: "Enterprise automation. Without the enterprise wait.",
    subheadline:
        "Arjun Automation is the enterprise operating system for companies that have outgrown spreadsheets and point tools. CRM, projects, finance, AI workers, and industry-specific modules — one secure platform.",
    primaryCta: { label: "Schedule Discovery Call", href: MARKETING_ROUTES.contact },
    secondaryCta: { label: "Explore Solutions", href: MARKETING_ROUTES.solutions },
    stats: [
        { value: 40, suffix: "+", label: "Integrated Modules" },
        { value: 90, suffix: " days", label: "Average Go-Live" },
        { value: 99, suffix: ".9%", label: "Platform Uptime" },
        { value: 500, suffix: "+", label: "Automations Deployed" },
    ],
    trustIndicators: ["SOC 2 Ready", "Row-Level Security", "Multi-Tenant", "AI-Native"],
};

export const WHY_US_CONTENT = {
    title: "Why organizations choose Arjun Automation",
    subtitle: "Speed without compromise. Enterprise rigor without enterprise drag.",
    pillars: [
        {
            title: "Unified Platform",
            description: "40+ integrated modules share a single data layer, authentication system, and audit framework.",
            icon: "layers",
        },
        {
            title: "AI-Native Operations",
            description: "AI workers that execute — BA, Architect, Dev, QA, DevOps, and Customer Success agents with audit trails.",
            icon: "brain",
        },
        {
            title: "Industry-Ready Speed",
            description: "Restaurant OS, Hospital OS, School OS, and Retail OS packs accelerate deployment by 60–70%.",
            icon: "zap",
        },
        {
            title: "Enterprise Trust",
            description: "Row Level Security, tenant isolation, audit logs, and governance modules built in from day one.",
            icon: "shield",
        },
    ],
};

export const SERVICES_CONTENT = {
    title: "Services built for outcomes",
    subtitle: "Structured delivery from discovery to hypercare — transparent timelines and milestone-based billing.",
    services: [
        {
            title: "Platform Implementation",
            description: "Full Arjun Automation OS deployment, configuration, and integration with your existing systems.",
            timeline: "8–12 weeks",
        },
        {
            title: "Industry Pack Deployment",
            description: "Restaurant, Hospital, School, or Retail OS go-live with industry-specific workflows and dashboards.",
            timeline: "6–10 weeks",
        },
        {
            title: "AI Worker Integration",
            description: "Activate BA, Solution Architect, Dev Factory, QA, DevOps, and Customer Success AI agents.",
            timeline: "2–4 weeks",
        },
        {
            title: "Enterprise Consulting",
            description: "Operating model design, automation strategy, and transformation roadmap for complex organizations.",
            timeline: "2–6 weeks",
        },
        {
            title: "Managed Support",
            description: "24/7 platform monitoring, updates, and customer success for production environments.",
            timeline: "Ongoing",
        },
    ],
};

export const INDUSTRIES_CONTENT = {
    title: "Industry operating systems",
    subtitle: "Pre-built workflows, dashboards, and compliance frameworks for your sector.",
    industries: [
        { name: "Restaurants & Hospitality", description: "Multi-location ops, inventory, staff scheduling, and guest experience.", href: MARKETING_ROUTES.industries },
        { name: "Healthcare", description: "Patient workflows, compliance, staff management, and billing integration.", href: MARKETING_ROUTES.industries },
        { name: "Education", description: "Admissions, attendance, finance, and parent communication in one platform.", href: MARKETING_ROUTES.industries },
        { name: "Retail & Commerce", description: "Inventory, POS integration, loyalty, and omnichannel fulfillment.", href: MARKETING_ROUTES.industries },
        { name: "Professional Services", description: "CRM, projects, time tracking, billing, and client portals unified.", href: MARKETING_ROUTES.industries },
        { name: "Manufacturing", description: "Supply chain, quality, maintenance, and production planning automation.", href: MARKETING_ROUTES.industries },
    ],
};

export const SOLUTIONS_CONTENT = {
    title: "One platform. Every operation.",
    subtitle: "Arjun Automation OS unifies the modules your business actually runs on.",
    solutions: [
        { title: "CRM & Sales", description: "Pipeline, forecasting, client portals, and revenue intelligence." },
        { title: "Projects & Delivery", description: "Task management, milestones, resource planning, and client visibility." },
        { title: "Finance & Billing", description: "Invoicing, revenue recognition, expenses, and board-ready reporting." },
        { title: "AI Orchestration", description: "Configurable AI workers with approval gates and full audit trails." },
        { title: "Workflow Engine", description: "Visual automation designer with triggers, conditions, and integrations." },
        { title: "Governance & Compliance", description: "Audit logs, access controls, policy enforcement, and data residency." },
    ],
};

export const PORTFOLIO_CONTENT = {
    title: "Featured work",
    subtitle: "Real outcomes from enterprise automation deployments.",
    cta: { label: "View all portfolio", href: MARKETING_ROUTES.portfolio },
};

export const CASE_STUDIES_CONTENT = {
    title: "Case studies",
    subtitle: "Measurable impact across industries and scale.",
    studies: [
        {
            title: "70% reduction in manual processing",
            client: "Professional Services Firm",
            metric: "70%",
            description: "AI workflow automation across intake, routing, and reporting for a 400-person firm.",
            href: MARKETING_ROUTES.caseStudies,
        },
        {
            title: "35% increase in qualified pipeline",
            client: "SaaS Company",
            metric: "35%",
            description: "Unified CRM replacing spreadsheets with integrated sales, delivery, and finance.",
            href: MARKETING_ROUTES.caseStudies,
        },
        {
            title: "12 locations live in 10 weeks",
            client: "Restaurant Chain",
            metric: "10 wks",
            description: "Restaurant OS deployment with inventory, scheduling, and guest feedback automation.",
            href: MARKETING_ROUTES.caseStudies,
        },
    ],
};

export const AI_CAPABILITIES_CONTENT = {
    title: "AI workers that execute",
    subtitle: "Not chatbots — autonomous agents with roles, approvals, and audit trails.",
    capabilities: [
        { title: "Business Analyst Agent", description: "Requirements intake, gap analysis, and user story generation." },
        { title: "Solution Architect Agent", description: "Technical design, integration mapping, and architecture reviews." },
        { title: "Development Factory", description: "Code generation, review, and deployment pipeline automation." },
        { title: "QA Engineer Agent", description: "Test case generation, execution, and regression monitoring." },
        { title: "DevOps Agent", description: "Infrastructure provisioning, CI/CD, and incident response." },
        { title: "Customer Success Agent", description: "Onboarding, health monitoring, and proactive outreach." },
    ],
};

export const ENTERPRISE_PLATFORM_CONTENT = {
    title: "Built for enterprise scale",
    subtitle: "Multi-tenant architecture with the security and governance your IT team demands.",
    features: [
        "Row-level security and tenant isolation",
        "Full audit trail on every action",
        "SSO, SAML, and role-based access control",
        "API-first with webhook integrations",
        "Configurable data residency",
        "99.9% uptime SLA for managed clients",
    ],
};

export const CUSTOMER_JOURNEY_CONTENT = {
    title: "Your path to go-live",
    subtitle: "A proven 90-day framework from discovery to hypercare.",
    steps: [
        { phase: "Week 1–2", title: "Discovery & Design", description: "Current-state assessment, target architecture, and success metrics." },
        { phase: "Week 3–6", title: "Configuration & Integration", description: "Module setup, data migration, and third-party system connections." },
        { phase: "Week 7–10", title: "UAT & Training", description: "User acceptance testing, staff training, and workflow validation." },
        { phase: "Week 11–12", title: "Go-Live & Hypercare", description: "Production launch with dedicated support and performance monitoring." },
        { phase: "Ongoing", title: "Optimize & Scale", description: "Continuous improvement, new automations, and expansion to additional locations." },
    ],
};

export const FAQ_CONTENT = {
    title: "Frequently asked questions",
    items: [
        {
            question: "How long does implementation typically take?",
            answer: "Most clients go live in 90 days. Industry pack deployments can be faster (6–10 weeks), while complex multi-system integrations may extend to 12–16 weeks.",
        },
        {
            question: "Can Arjun Automation integrate with our existing tools?",
            answer: "Yes. Our integration platform supports REST APIs, webhooks, and pre-built connectors for common ERP, accounting, and communication tools.",
        },
        {
            question: "Is our data secure and isolated?",
            answer: "Every tenant runs in an isolated environment with row-level security, encrypted data at rest and in transit, and comprehensive audit logging.",
        },
        {
            question: "What AI capabilities are included?",
            answer: "AI workers for BA, Solution Architect, Development, QA, DevOps, and Customer Success — each with configurable approval workflows and full audit trails.",
        },
        {
            question: "Do you offer managed support after go-live?",
            answer: "Yes. Our managed support tier includes 24/7 monitoring, platform updates, a dedicated Customer Success Manager, and SLA-backed response times.",
        },
    ],
};

export const CTA_CONTENT = {
    title: "Ready to transform your operations?",
    subtitle: "Schedule a discovery call. Our team responds within one business day.",
    primaryCta: { label: "Schedule Discovery Call", href: MARKETING_ROUTES.contact },
    secondaryCta: { label: "View Case Studies", href: MARKETING_ROUTES.caseStudies },
};

export const NAV_ITEMS = [
    { label: "About", href: MARKETING_ROUTES.about },
    { label: "Services", href: MARKETING_ROUTES.services },
    { label: "Industries", href: MARKETING_ROUTES.industries },
    { label: "Solutions", href: MARKETING_ROUTES.solutions },
    { label: "Portfolio", href: MARKETING_ROUTES.portfolio },
    { label: "Case Studies", href: MARKETING_ROUTES.caseStudies },
    { label: "Blog", href: MARKETING_ROUTES.blog },
    { label: "Careers", href: MARKETING_ROUTES.careers },
    { label: "Contact", href: MARKETING_ROUTES.contact },
];
