export interface PortfolioItem {
    slug: string;
    title: string;
    tagline: string;
    category: string;
    overview: string;
    challenge: string;
    solution: string;
    features: string[];
    benefits: string[];
    screenshotSlots: { path: string; alt: string }[];
    results: string[];
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
    {
        slug: "ai-automation",
        title: "AI Workflow Automation",
        tagline: "Intelligent automation across every department",
        category: "AI & Automation",
        overview:
            "End-to-end AI workflow automation for mid-market enterprises — from intake routing and document processing to approval chains and executive reporting. Built on Arjun Automation OS with auditable AI workers.",
        challenge:
            "A 400-person professional services firm spent 30+ hours weekly on manual data entry, status updates, and report compilation across disconnected spreadsheets and email threads.",
        solution:
            "We deployed AI workers for requirements intake, workflow orchestration, and automated reporting — integrated with CRM, projects, and finance modules on a single tenant with full audit trails.",
        features: [
            "AI-powered intake classification and routing",
            "Visual workflow designer with approval gates",
            "Document generation and e-signature integration",
            "Real-time operational dashboards",
            "Audit logs on every automated action",
        ],
        benefits: [
            "70% reduction in manual processing time",
            "Single source of truth across departments",
            "Compliance-ready audit trails",
            "Scalable automation without custom code",
        ],
        screenshotSlots: [
            { path: "/launch-kit/screenshots/ai-automation/dashboard.png", alt: "AI automation operations dashboard" },
            { path: "/launch-kit/screenshots/ai-automation/workflow-designer.png", alt: "Visual workflow designer" },
            { path: "/launch-kit/screenshots/ai-automation/audit-log.png", alt: "Automation audit log view" },
        ],
        results: [
            "70% reduction in manual processing",
            "Go-live with AI-accelerated delivery and enterprise validation",
            "12 automated workflows in production",
            "Zero security incidents post-launch",
        ],
    },
    {
        slug: "crm",
        title: "Enterprise CRM Platform",
        tagline: "Unified client lifecycle from lead to renewal",
        category: "CRM",
        overview:
            "Full CRM implementation with pipeline management, client portals, revenue forecasting, and customer success integration — replacing a patchwork of spreadsheets and legacy tools.",
        challenge:
            "A growing SaaS company lost deals due to inconsistent follow-up, no visibility into pipeline health, and sales data siloed from delivery and finance teams.",
        solution:
            "Arjun Automation CRM with integrated projects, billing, and customer success modules — giving sales, delivery, and finance a shared client record with role-based access.",
        features: [
            "Pipeline and opportunity management",
            "Automated follow-up sequences",
            "Client portal with document sharing",
            "Revenue forecasting and reporting",
            "Customer health score integration",
        ],
        benefits: [
            "35% increase in qualified pipeline",
            "Unified client view across sales and delivery",
            "Faster quote-to-cash cycles",
            "Board-ready revenue reporting",
        ],
        screenshotSlots: [
            { path: "/launch-kit/screenshots/crm/pipeline.png", alt: "CRM pipeline dashboard" },
            { path: "/launch-kit/screenshots/crm/client-portal.png", alt: "Client portal interface" },
            { path: "/launch-kit/screenshots/crm/forecast.png", alt: "Revenue forecast view" },
        ],
        results: [
            "35% increase in qualified pipeline",
            "Quote-to-cash cycle reduced by 40%",
            "100% sales team adoption after rollout",
            "Integrated with finance in single tenant",
        ],
    },
    {
        slug: "erp",
        title: "ERP Integration Hub",
        tagline: "Connect operations without integration debt",
        category: "Integrations",
        overview:
            "Enterprise resource planning integration connecting inventory, procurement, finance, and HR into Arjun Automation OS — eliminating duplicate data entry and reconciliation overhead.",
        challenge:
            "A manufacturing distributor ran SAP for finance and inventory while teams used separate tools for projects, CRM, and approvals — creating daily reconciliation nightmares.",
        solution:
            "Integration Platform module with bidirectional sync to SAP, unified approval workflows, and executive dashboards pulling live data from both systems.",
        features: [
            "Bidirectional ERP data sync",
            "Unified approval and workflow engine",
            "Inventory and procurement visibility",
            "Financial reconciliation dashboards",
            "Webhook and API marketplace connectors",
        ],
        benefits: [
            "Eliminated duplicate data entry",
            "Real-time inventory and financial visibility",
            "Reduced reconciliation time by 80%",
            "Single pane for operations leadership",
        ],
        screenshotSlots: [
            { path: "/launch-kit/screenshots/erp/integration-map.png", alt: "ERP integration architecture map" },
            { path: "/launch-kit/screenshots/erp/inventory-dashboard.png", alt: "Inventory dashboard" },
            { path: "/launch-kit/screenshots/erp/reconciliation.png", alt: "Financial reconciliation view" },
        ],
        results: [
            "80% reduction in reconciliation time",
            "Live sync across 4 ERP modules",
            "AI-accelerated deployment with full validation",
            "Zero data loss during migration",
        ],
    },
    {
        slug: "school-management",
        title: "School Management System",
        tagline: "Complete school OS from enrollment to graduation",
        category: "Education",
        overview:
            "School OS deployment for a multi-campus education group — student lifecycle, academics, staff management, parent portals, and fee collection on one platform.",
        challenge:
            "A school chain with 12 campuses used five different systems for admissions, academics, fees, and parent communication — causing enrollment delays and parent dissatisfaction.",
        solution:
            "School OS industry pack with student registry, academic scheduling, fee management, parent/student portals, and campus-level analytics — deployed per campus with central governance.",
        features: [
            "Online admissions and enrollment",
            "Academic scheduling and grade management",
            "Fee collection and financial reporting",
            "Parent and student mobile portals",
            "Multi-campus analytics dashboard",
        ],
        benefits: [
            "Unified experience across 12 campuses",
            "60% faster enrollment processing",
            "Improved parent engagement scores",
            "Compliance-ready student records",
        ],
        screenshotSlots: [
            { path: "/launch-kit/screenshots/school-management/admissions.png", alt: "Online admissions portal" },
            { path: "/launch-kit/screenshots/school-management/academics.png", alt: "Academic scheduling dashboard" },
            { path: "/launch-kit/screenshots/school-management/parent-portal.png", alt: "Parent portal home screen" },
        ],
        results: [
            "12 campuses unified on single platform",
            "60% faster enrollment processing",
            "Parent satisfaction up 28 points NPS",
            "Single student record across all campuses",
        ],
    },
    {
        slug: "business-automation",
        title: "Business Process Automation",
        tagline: "Standardize operations across every location",
        category: "Automation",
        overview:
            "Cross-functional business process automation for a multi-location retail group — standardizing approvals, inventory requests, and regional reporting with configurable workflows.",
        challenge:
            "A 25-location retail group had inconsistent processes across regions — manual purchase approvals, delayed inventory transfers, and no standardized reporting for regional managers.",
        solution:
            "Business Process and Workflow Engine modules with location-specific configurations, automated approval chains, and executive intelligence dashboards for regional performance.",
        features: [
            "Configurable approval workflows",
            "Multi-location process templates",
            "Automated inventory transfer requests",
            "Regional performance dashboards",
            "Mobile-friendly task execution",
        ],
        benefits: [
            "Consistent processes across 25 locations",
            "50% faster approval cycles",
            "Real-time regional visibility",
            "Reduced operational variance",
        ],
        screenshotSlots: [
            { path: "/launch-kit/screenshots/business-automation/process-designer.png", alt: "Business process designer" },
            { path: "/launch-kit/screenshots/business-automation/approvals.png", alt: "Approval workflow queue" },
            { path: "/launch-kit/screenshots/business-automation/regional-dashboard.png", alt: "Regional performance dashboard" },
        ],
        results: [
            "50% faster approval cycles",
            "25 locations standardized with centralized governance",
            "Regional reporting automated daily",
            "Operational variance reduced by 45%",
        ],
    },
    {
        slug: "ai-agents",
        title: "AI Agent Workforce",
        tagline: "AI workers that execute, not just suggest",
        category: "AI Workers",
        overview:
            "Full AI worker activation — Business Analyst, Solution Architect, Development Factory, QA Engineer, DevOps, and Customer Success agents — integrated into the client's delivery pipeline with audit trails.",
        challenge:
            "An internal platform team spent 60% of engineering capacity maintaining bespoke internal tools instead of building product features — with no structured AI assistance in their delivery workflow.",
        solution:
            "Activated six AI workers within Arjun Automation OS — BA agents draft requirements, Architect agents design solutions, Dev Factory generates code scaffolds, QA runs test suites, all auditable and human-approved.",
        features: [
            "BA agent for requirements and discovery",
            "Solution Architect agent for design docs",
            "Dev Factory for code generation",
            "QA Engineer for automated testing",
            "DevOps agent for deployment orchestration",
            "Customer Success agent for health scoring",
        ],
        benefits: [
            "40% faster delivery cycles",
            "Consistent documentation quality",
            "Reduced engineering maintenance burden",
            "Full audit trail on AI actions",
        ],
        screenshotSlots: [
            { path: "/launch-kit/screenshots/ai-agents/worker-dashboard.png", alt: "AI worker orchestration dashboard" },
            { path: "/launch-kit/screenshots/ai-agents/ba-agent.png", alt: "Business Analyst AI worker interface" },
            { path: "/launch-kit/screenshots/ai-agents/audit-trail.png", alt: "AI action audit trail" },
        ],
        results: [
            "40% faster delivery cycles",
            "6 AI workers in production",
            "Engineering maintenance down 35%",
            "100% AI actions auditable",
        ],
    },
    {
        slug: "integrations",
        title: "Integration Platform",
        tagline: "Connect every system without middleware sprawl",
        category: "Integrations",
        overview:
            "Enterprise integration platform connecting payment gateways, accounting systems, POS, EMR, and third-party SaaS tools — with webhook management, API marketplace, and delivery analytics.",
        challenge:
            "A hospital network needed to connect EMR, pharmacy, lab, billing, and patient portal systems — but previous integration attempts created fragile middleware that broke with every vendor update.",
        solution:
            "Integration Platform with pre-built connectors, webhook orchestration, retry logic, and integration health monitoring — all managed within Arjun Automation OS governance framework.",
        features: [
            "Pre-built connectors for major systems",
            "Webhook management and retry logic",
            "Integration health monitoring",
            "API marketplace for extensions",
            "Delivery analytics and error alerting",
        ],
        benefits: [
            "Reliable integrations with automatic retry",
            "Single integration governance layer",
            "Reduced vendor lock-in risk",
            "Real-time integration health visibility",
        ],
        screenshotSlots: [
            { path: "/launch-kit/screenshots/integrations/connector-marketplace.png", alt: "Integration connector marketplace" },
            { path: "/launch-kit/screenshots/integrations/webhook-monitor.png", alt: "Webhook monitoring dashboard" },
            { path: "/launch-kit/screenshots/integrations/health-status.png", alt: "Integration health status view" },
        ],
        results: [
            "8 critical integrations live with bi-directional sync",
            "99.7% integration uptime post-launch",
            "Zero middleware maintenance overhead",
            "Integration errors resolved 3x faster",
        ],
    },
];

export function getPortfolioItem(slug: string): PortfolioItem | undefined {
    return PORTFOLIO_ITEMS.find((item) => item.slug === slug);
}
