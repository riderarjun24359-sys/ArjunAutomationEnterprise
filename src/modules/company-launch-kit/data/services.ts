import { AI_DELIVERY_SERVICE_LABEL } from "@/src/constants/ai-delivery-model";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

export interface ServiceItem {
    slug: string;
    title: string;
    tagline: string;
    description: string;
    problems: string[];
    solutions: string[];
    benefits: string[];
    process: { phase: string; description: string }[];
    technologies: string[];
    deliverables: string[];
    faqs: { question: string; answer: string }[];
    timeline: string;
}

export const SERVICE_ITEMS: ServiceItem[] = [
    {
        slug: "platform-implementation",
        title: "Platform Implementation",
        tagline: "Full Arjun Automation OS deployment, configuration, and integration.",
        description:
            "Deploy the complete Arjun Automation OS for your organization — tenant provisioning, core modules, enterprise identity, integrations, and go-live support.",
        problems: [
            "Tool sprawl across disconnected SaaS subscriptions",
            "Manual handoffs between departments via email and spreadsheets",
            "No audit trail for compliance and governance",
            "Engineering teams maintaining custom tools instead of product work",
            "AI bolt-ons that do not integrate with actual workflows",
        ],
        solutions: [
            "Unified operating system replacing fragmented point tools",
            "Configured workflows with approval gates and audit trails",
            "Enterprise identity with MFA, RBAC, and tenant isolation",
            "Integration with ERP, accounting, and communication systems",
            "AI-ready foundation for immediate worker activation post go-live",
        ],
        benefits: [
            "Single source of truth across sales, delivery, finance, and operations",
            "AI-accelerated delivery vs. 12–18 months for custom builds",
            "Enterprise security with RLS and audit logs from day one",
            "Reduced TCO — one platform vs. 10+ point solutions",
        ],
        process: [
            { phase: "Discover", description: "Workshops, process mapping, and module selection" },
            { phase: "Design", description: "Architecture, integration mapping, and security review" },
            { phase: "Build", description: "Configuration, workflow setup, and integration development" },
            { phase: "Validate", description: "UAT, training, feedback, and customer approval" },
            { phase: "Deploy", description: "Production cutover, monitoring, and 30-day hypercare" },
        ],
        technologies: ["Next.js", "TypeScript", "Supabase", "Enterprise APIs", "SSO/SAML", "Webhook Integrations"],
        deliverables: [
            "Provisioned tenant with enterprise identity",
            "Configured CRM, Projects, Tasks, Finance, HR modules",
            "Up to 3 external system integrations",
            "Data migration and admin/end-user training",
            "Go-live documentation and runbook",
        ],
        faqs: [
            {
                question: "How long does platform implementation take?",
                answer: "Timeline depends on scope and integrations. Most mid-market deployments follow our AI-accelerated delivery model with milestone-based billing after validation.",
            },
            {
                question: "Can we start with core modules only?",
                answer: "Yes. Essential tier covers CRM, Projects, Tasks, and Finance. Additional modules can be activated in phased rollouts.",
            },
        ],
        timeline: AI_DELIVERY_SERVICE_LABEL,
    },
    {
        slug: "industry-pack-deployment",
        title: "Industry Pack Deployment",
        tagline: "Restaurant, Hospital, School, or Retail OS — industry workflows out of the box.",
        description:
            "Activate industry-specific operating systems with pre-built workflows, dashboards, and compliance frameworks tailored to your sector.",
        problems: [
            "Generic ERPs that require heavy customization for industry workflows",
            "Separate systems for operations, finance, and customer experience",
            "Slow rollout across multiple locations or campuses",
            "Compliance gaps in regulated industries",
        ],
        solutions: [
            "Pre-built industry packs with sector-specific modules",
            "Multi-location configuration with central governance",
            "Industry compliance frameworks built into workflows",
            "Staff training and change management support",
        ],
        benefits: [
            "Faster time-to-value with pre-configured industry workflows",
            "Consistent operations across all locations",
            "Compliance-ready records and audit trails",
            "Scalable foundation for growth and acquisitions",
        ],
        process: [
            { phase: "Assess", description: "Industry requirements, location inventory, and compliance mapping" },
            { phase: "Configure", description: "Industry pack activation and location-specific setup" },
            { phase: "Train", description: "Role-based training for staff and administrators" },
            { phase: "Launch", description: "Phased go-live with hypercare support" },
            { phase: "Optimize", description: "Performance tuning and workflow refinement" },
        ],
        technologies: ["Restaurant OS", "Hospital OS", "School OS", "Retail OS", "Industry Framework", "Multi-Tenant RLS"],
        deliverables: [
            "Industry pack activation and configuration",
            "Location and campus setup",
            "Workflow and form customization",
            "Staff training program",
            "Compliance documentation",
        ],
        faqs: [
            {
                question: "Which industry packs are available?",
                answer: "Restaurant & Hospitality, Healthcare, Education, Retail & Commerce, Professional Services, and Manufacturing.",
            },
            {
                question: "Can we customize industry workflows?",
                answer: "Yes. Industry packs provide a proven foundation that we configure to your specific operating model.",
            },
        ],
        timeline: AI_DELIVERY_SERVICE_LABEL,
    },
    {
        slug: "ai-worker-integration",
        title: "AI Worker Integration",
        tagline: "Activate BA, Architect, Dev, QA, DevOps, and Customer Success AI agents.",
        description:
            "Deploy auditable AI workers that execute real workflows — requirements, architecture, development, testing, deployment, and customer success.",
        problems: [
            "AI copilots that suggest but do not execute",
            "No audit trail for AI-generated outputs",
            "Engineering teams overwhelmed by maintenance and documentation",
            "Inconsistent quality across delivery artifacts",
        ],
        solutions: [
            "Six specialized AI workers with defined roles and approval gates",
            "Full audit trail on every AI action and output",
            "Human-in-the-loop approval workflows",
            "Integration with CRM, projects, and delivery pipelines",
        ],
        benefits: [
            "40% faster delivery cycles with consistent documentation",
            "Reduced engineering maintenance burden",
            "Governed AI with enterprise security controls",
            "Measurable productivity gains from day one",
        ],
        process: [
            { phase: "Scope", description: "Identify AI worker roles and approval workflows" },
            { phase: "Configure", description: "Worker setup, prompts, and integration mapping" },
            { phase: "Pilot", description: "Controlled rollout with human oversight" },
            { phase: "Scale", description: "Production activation across delivery teams" },
            { phase: "Govern", description: "Ongoing monitoring, evaluation, and optimization" },
        ],
        technologies: ["AI Foundation", "Agent Orchestration", "Prompt Engine", "Audit Logs", "Approval Workflows"],
        deliverables: [
            "Configured AI workers for agreed roles",
            "Approval workflow setup",
            "Audit trail and governance configuration",
            "Team training on AI worker operations",
        ],
        faqs: [
            {
                question: "Are AI actions auditable?",
                answer: "Yes. Every AI worker action is logged with full audit trails, approval status, and rollback capability.",
            },
            {
                question: "Can humans override AI outputs?",
                answer: "Absolutely. All AI workers operate with human-in-the-loop approval gates configured to your governance requirements.",
            },
        ],
        timeline: AI_DELIVERY_SERVICE_LABEL,
    },
    {
        slug: "enterprise-consulting",
        title: "Enterprise Consulting",
        tagline: "Operating model design, automation strategy, and transformation roadmap.",
        description:
            "Strategic consulting for complex organizations — current-state assessment, target architecture, business case, and executive workshops.",
        problems: [
            "Unclear automation priorities across departments",
            "Legacy systems blocking digital transformation",
            "No shared vision between IT and business leaders",
            "Failed prior automation initiatives without measurable ROI",
        ],
        solutions: [
            "Current-state assessment with process and technology mapping",
            "Target architecture and integration blueprint",
            "Phased roadmap with business case and ROI modeling",
            "Executive workshops and stakeholder alignment",
        ],
        benefits: [
            "Clear prioritization of high-impact automation opportunities",
            "Shared vision across IT, operations, and leadership",
            "De-risked investment with validated business case",
            "Foundation for successful platform implementation",
        ],
        process: [
            { phase: "Assess", description: "Stakeholder interviews, process mapping, and technology inventory" },
            { phase: "Analyze", description: "Gap analysis, opportunity sizing, and risk assessment" },
            { phase: "Design", description: "Target operating model and architecture blueprint" },
            { phase: "Plan", description: "Roadmap, business case, and investment proposal" },
            { phase: "Align", description: "Executive workshops and board-ready presentation" },
        ],
        technologies: ["Process Framework", "Architecture Modeling", "ROI Analytics", "Governance Design"],
        deliverables: [
            "Current-state assessment report",
            "Target architecture document",
            "Transformation roadmap and business case",
            "Executive workshop materials",
        ],
        faqs: [
            {
                question: "Does consulting lead to implementation?",
                answer: "Consulting engagements can stand alone or flow directly into platform implementation with a validated scope and roadmap.",
            },
            {
                question: "Who should participate in workshops?",
                answer: "We recommend cross-functional participation — operations, IT, finance, and executive sponsors.",
            },
        ],
        timeline: AI_DELIVERY_SERVICE_LABEL,
    },
    {
        slug: "managed-support",
        title: "Managed Support",
        tagline: "24/7 platform monitoring, updates, and customer success.",
        description:
            "Ongoing managed support for production environments — monitoring, platform updates, dedicated CSM, and SLA-backed response.",
        problems: [
            "Internal teams lack capacity for platform operations",
            "Delayed response to production incidents",
            "Missed platform updates and security patches",
            "No proactive customer success or health monitoring",
        ],
        solutions: [
            "24/7 monitoring and alerting with defined SLAs",
            "Platform updates and security patch management",
            "Dedicated Customer Success Manager",
            "Proactive health scoring and renewal support",
        ],
        benefits: [
            "Continuous health monitoring with live status endpoints",
            "Reduced internal ops burden",
            "Proactive issue detection and resolution",
            "Continuous platform evolution without disruption",
        ],
        process: [
            { phase: "Onboard", description: "Environment review, runbook setup, and escalation paths" },
            { phase: "Monitor", description: "24/7 health monitoring and alerting" },
            { phase: "Maintain", description: "Scheduled updates and security patches" },
            { phase: "Support", description: "Incident response and user support" },
            { phase: "Review", description: "Monthly health reports and optimization recommendations" },
        ],
        technologies: ["Platform Operations", "Observability", "Incident Management", "Health Scoring", "SLA Tracking"],
        deliverables: [
            "Monitoring and alerting configuration",
            "Platform update schedule",
            "Dedicated CSM assignment",
            "Monthly health and performance reports",
        ],
        faqs: [
            {
                question: "What SLA tiers are available?",
                answer: "Standard (business hours), Professional (extended hours), and Enterprise (24/7 with dedicated response team).",
            },
            {
                question: "Can managed support be added after go-live?",
                answer: "Yes. Most clients transition to managed support after the 30-day hypercare period.",
            },
        ],
        timeline: "Ongoing subscription",
    },
];

export function getServiceItem(slug: string): ServiceItem | undefined {
    return SERVICE_ITEMS.find((item) => item.slug === slug);
}

export function getServiceHref(slug: string): string {
    return MARKETING_ROUTES.serviceItem(slug);
}
