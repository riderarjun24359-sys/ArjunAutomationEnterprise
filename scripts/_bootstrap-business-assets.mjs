/**
 * Bootstrap V5 Business Assets OS
 * Run: node scripts/_bootstrap-business-assets.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const root = process.cwd();
const mod = join(root, "src", "modules", "business-assets");
const brandRoot = join(root, "src", "modules", "brand-os");

function write(rel, content) {
    const full = join(root, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
    console.log("wrote", rel);
}

function readBrand(rel) {
    const p = join(brandRoot, rel);
    return existsSync(p) ? readFileSync(p, "utf8") : "";
}

// ─── types/index.ts ───────────────────────────────────────────────────────
write("src/modules/business-assets/types/index.ts", `export type BusinessDocumentType =
    | "company-profile"
    | "service-catalog"
    | "proposal"
    | "quotation"
    | "invoice"
    | "sow"
    | "nda"
    | "client-agreement"
    | "maintenance-agreement";

export type DocumentCategory = "profile" | "sales" | "legal" | "finance" | "catalog";

export interface CompanyProfileSection {
    id: string;
    title: string;
    content: string;
}

export interface CompanyProfile {
    sections: CompanyProfileSection[];
    updatedAt: string;
}

export interface ServiceCatalogItem {
    id: string;
    name: string;
    slug: string;
    overview: string;
    benefits: string[];
    deliverables: string[];
    timeline: string;
    pricingPlaceholder: string;
    industries: string[];
    technology: string[];
    faq: { question: string; answer: string }[];
}

export interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
}

export interface ClientInfo {
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
}

export interface ProposalFormData {
    templateId: string;
    client: ClientInfo;
    reference: string;
    validUntil: string;
    executiveSummary: string;
    scope: string;
    deliverables: string[];
    timeline: string;
    commercials: string;
    terms: string;
    signatureDataUrl?: string;
}

export interface QuotationFormData {
    reference: string;
    client: ClientInfo;
    currency: string;
    validUntil: string;
    lineItems: LineItem[];
    discountPercent: number;
    taxPercent: number;
    notes: string;
    approvalStatus: "draft" | "pending" | "approved" | "rejected";
    signatureDataUrl?: string;
}

export interface InvoiceFormData {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    client: ClientInfo;
    gstin: string;
    lineItems: LineItem[];
    cgstPercent: number;
    sgstPercent: number;
    igstPercent: number;
    paymentTerms: string;
    status: "draft" | "sent" | "paid";
    signatureDataUrl?: string;
}

export interface SowMilestone {
    id: string;
    name: string;
    week: string;
    deliverable: string;
    acceptanceCriteria: string;
}

export interface SowFormData {
    reference: string;
    client: ClientInfo;
    projectTitle: string;
    scope: string;
    milestones: SowMilestone[];
    terms: string;
    acceptanceTerms: string;
    signatureDataUrl?: string;
}

export interface LegalDocumentFormData {
    reference: string;
    counterparty: string;
    effectiveDate: string;
    content: string;
    signatureDataUrl?: string;
}

export interface MaintenanceAgreementFormData extends LegalDocumentFormData {
    slaTier: string;
    responseTime: string;
    renewalTerms: string;
    escalationTiers: string;
}

export interface StoredDocument {
    id: string;
    type: BusinessDocumentType;
    title: string;
    category: DocumentCategory;
    content: string;
    html?: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    versions: DocumentVersion[];
}

export interface DocumentVersion {
    version: number;
    content: string;
    savedAt: string;
}

export interface BusinessAssetsState {
    companyProfile: CompanyProfile;
    servicesCatalog: ServiceCatalogItem[];
    proposal: ProposalFormData;
    quotation: QuotationFormData;
    invoice: InvoiceFormData;
    sow: SowFormData;
    nda: LegalDocumentFormData;
    clientAgreement: LegalDocumentFormData;
    maintenanceAgreement: MaintenanceAgreementFormData;
    library: StoredDocument[];
}
`);

// ─── constants/index.ts ───────────────────────────────────────────────────
write("src/modules/business-assets/constants/index.ts", `import type { BusinessDocumentType, DocumentCategory } from "../types";

export const BUSINESS_ASSETS_TABS = {
    companyProfile: "company-profile",
    serviceCatalog: "service-catalog",
    proposal: "proposal",
    quotation: "quotation",
    invoice: "invoice",
    sow: "sow",
    nda: "nda",
    clientAgreement: "client-agreement",
    maintenanceAgreement: "maintenance-agreement",
    documentLibrary: "document-library",
} as const;

export const BUSINESS_ASSETS_TAB_LIST = [
    { id: BUSINESS_ASSETS_TABS.companyProfile, label: "Company Profile" },
    { id: BUSINESS_ASSETS_TABS.serviceCatalog, label: "Service Catalog" },
    { id: BUSINESS_ASSETS_TABS.proposal, label: "Proposal Generator" },
    { id: BUSINESS_ASSETS_TABS.quotation, label: "Quotation Generator" },
    { id: BUSINESS_ASSETS_TABS.invoice, label: "Invoice Generator" },
    { id: BUSINESS_ASSETS_TABS.sow, label: "SOW Generator" },
    { id: BUSINESS_ASSETS_TABS.nda, label: "NDA Generator" },
    { id: BUSINESS_ASSETS_TABS.clientAgreement, label: "Client Agreement" },
    { id: BUSINESS_ASSETS_TABS.maintenanceAgreement, label: "Maintenance Agreement" },
    { id: BUSINESS_ASSETS_TABS.documentLibrary, label: "Document Library" },
] as const;

export const BUSINESS_ASSETS_THEME = {
    accent: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/60 dark:border-emerald-800/60",
    surface: "bg-emerald-50/50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
} as const;

export const COMPANY_PROFILE_SECTION_IDS = [
    "company-overview",
    "mission",
    "vision",
    "core-values",
    "founder-message",
    "why-us",
    "industries",
    "services",
    "technology-stack",
    "methodology",
    "delivery-process",
    "support-model",
    "contact-information",
] as const;

export const DOCUMENT_TYPE_CATEGORIES: Record<BusinessDocumentType, DocumentCategory> = {
    "company-profile": "profile",
    "service-catalog": "catalog",
    proposal: "sales",
    quotation: "sales",
    invoice: "finance",
    sow: "sales",
    nda: "legal",
    "client-agreement": "legal",
    "maintenance-agreement": "legal",
};

export const STORAGE_KEY = "arjun-business-assets-v1";
`);

// ─── data/company-profile.ts ──────────────────────────────────────────────
write("src/modules/business-assets/data/company-profile.ts", `import type { CompanyProfileSection } from "../types";

export const DEFAULT_COMPANY_PROFILE_SECTIONS: CompanyProfileSection[] = [
    {
        id: "company-overview",
        title: "Company Overview",
        content: \`Arjun Automation is an enterprise automation company headquartered in India, serving mid-market and enterprise clients globally. We build and operate **Arjun Automation OS** — a unified business operating system that combines CRM, project management, finance, HR, inventory, AI workers, industry-specific modules, and enterprise governance into one secure, composable platform.

Founded by operators who lived through painful digital transformation programs, we exist to eliminate the false choice between speed and enterprise rigor. Our clients launch new operations in weeks, not years — with the security, auditability, and scalability their boards demand.

**Company Name:** Arjun Automation
**Product:** Arjun Automation OS (Enterprise)
**Founded:** 2024
**Headquarters:** India (Global Delivery)\`,
    },
    {
        id: "mission",
        title: "Mission",
        content: \`To democratize enterprise automation by delivering an integrated operating system that empowers every organization to run like a world-class enterprise — with AI-native workflows, industry-ready foundations, and measurable outcomes from day one.\`,
    },
    {
        id: "vision",
        title: "Vision",
        content: \`A world where every organization — from a 10-location restaurant group to a regional hospital network — operates on intelligent automation with enterprise-grade security, without enterprise-grade timelines or budgets.\`,
    },
    {
        id: "core-values",
        title: "Core Values",
        content: \`1. **Outcome Over Output** — We measure success by client results, not deliverable counts.
2. **Platform Thinking** — Build once, configure many; avoid bespoke dead ends.
3. **Security First** — Tenant isolation, audit trails, and governance are non-negotiable.
4. **Radical Clarity** — Plain language, transparent pricing, honest timelines.
5. **Continuous Evolution** — Ship, learn, iterate; our platform grows with our clients.
6. **Partnership Mindset** — We succeed when our clients succeed long after go-live.\`,
    },
    {
        id: "founder-message",
        title: "Founder Message",
        content: \`When we started Arjun Automation, we had one question: why does every company have to choose between moving fast and operating safely?

We watched teams stitch together a dozen SaaS tools, hire armies of integrators, and still lack a single source of truth. We watched AI demos impress executives but fail in production because they weren't wired into real workflows.

Arjun Automation OS is our answer — one platform, every module, AI-native from the ground up. We built it for operators who need enterprise rigor without enterprise timelines. Whether you're launching a restaurant group, a hospital network, or a professional services firm, we're here to help you launch in weeks and scale with confidence.

— The Arjun Automation Founding Team\`,
    },
    {
        id: "why-us",
        title: "Why Arjun Automation",
        content: \`### 1. One Platform, Not a Patchwork
Forty-plus integrated modules share a single data layer, authentication system, and audit framework. No integration middleware to maintain.

### 2. AI That Executes
Our AI workers don't just chat — they draft requirements, generate code, run tests, deploy releases, and manage customer health scores with full audit trails.

### 3. Industry Depth
Pre-built Restaurant OS, Hospital OS, School OS, and Retail OS packs include workflows, forms, documents, and dashboards specific to each vertical.

### 4. Security by Architecture
Row Level Security on every table, tenant isolation, enterprise identity with MFA, governance and compliance modules — not optional add-ons.

### 5. Proven Delivery Methodology
Structured discovery → configuration → UAT → go-live → hypercare. Average enterprise go-live: **90 days**.

### 6. Transparent Partnership
Fixed-scope proposals, milestone-based billing, dedicated customer success manager, and SLA-backed managed support.\`,
    },
    {
        id: "industries",
        title: "Industries",
        content: \`- **Restaurants & Hospitality** — Multi-location operations, kitchen workflows, guest experience
- **Healthcare** — Patient management, clinical operations, pharmacy, laboratory
- **Education** — Student lifecycle, academics, staff, parent portals
- **Retail** — Product catalog, POS, inventory, customer loyalty
- **Professional Services** — CRM, project delivery, billing, client portals
- **Technology & SaaS** — Internal operations, customer success, launch readiness

Each industry benefits from pre-built **Industry OS packs** that accelerate deployment by 60–70% compared to greenfield configuration.\`,
    },
    {
        id: "services",
        title: "Services",
        content: \`| Service | Summary |
|---------|---------|
| **Platform Implementation** | Full Arjun Automation OS deployment, configuration, and integration |
| **Industry Pack Deployment** | Restaurant, Hospital, School, or Retail OS go-live |
| **AI Worker Integration** | BA, Architect, Dev, QA, DevOps, and CS agent activation |
| **Enterprise Consulting** | Operating model design, automation strategy, transformation roadmap |
| **Managed Support** | 24/7 platform monitoring, updates, and customer success |\`,
    },
    {
        id: "technology-stack",
        title: "Technology Stack",
        content: \`**Platform Core**
- Next.js 16+ with React 19 — modern, performant web application framework
- Supabase — PostgreSQL with Row Level Security, auth, and real-time capabilities
- TypeScript — end-to-end type safety across frontend and backend

**AI & Automation**
- AI Workers — BA, Solution Architect, Dev Factory, QA, DevOps, Customer Success
- Workflow Engine — event-driven automation with approval gates
- Document Engine — template-based generation with digital signatures

**Enterprise Modules**
- CRM, Projects, Finance, HR, Inventory, Documents, Analytics
- Industry OS: Restaurant, Hospital, School, Retail
- Governance: Audit, Compliance, Risk, Data Governance

**Integration**
- REST API, webhooks, payment connectors, accounting integrations
- SSO/MFA via Enterprise Identity module\`,
    },
    {
        id: "methodology",
        title: "Methodology",
        content: \`Our delivery methodology follows five structured phases designed for predictable outcomes:

**Discover** — Stakeholder workshops, process mapping, module selection, success criteria
**Design** — Solution architecture, integration map, data migration plan, UAT scenarios
**Configure & Build** — Tenant provisioning, module configuration, AI worker activation, integrations
**Validate** — User acceptance testing, security validation, training delivery, readiness checklist
**Launch & Hypercare** — Production cutover, 30-day hypercare, transition to managed support\`,
    },
    {
        id: "delivery-process",
        title: "Delivery Process",
        content: \`### Phase 1: Discover (Week 1–2)
- Stakeholder workshops and discovery questionnaire
- Current-state process mapping
- Module and industry pack selection
- Success criteria definition

### Phase 2: Design (Week 3–4)
- Solution architecture and integration map
- Data migration plan
- UAT test scenarios
- Training plan

### Phase 3: Configure & Build (Week 5–8)
- Platform provisioning and tenant setup
- Module configuration and workflow design
- AI worker activation
- Integration with existing systems (ERP, POS, etc.)

### Phase 4: Validate (Week 9–10)
- User acceptance testing
- Security and performance validation
- Training delivery
- Go-live readiness checklist

### Phase 5: Launch & Hypercare (Week 11–12+)
- Production cutover
- 30-day hypercare with daily standups
- Transition to managed support
- Success metrics review at Day 30, 60, 90\`,
    },
    {
        id: "support-model",
        title: "Support Model",
        content: \`**Managed Support Tiers**

| Tier | Response Time | Coverage | Includes |
|------|---------------|----------|----------|
| Standard | 8 business hours | Business hours | Email support, monthly health report |
| Premium | 4 hours | 24/7 P1 | Dedicated CSM, quarterly QBR, 99.9% SLA |
| Enterprise | 1 hour | 24/7 all severities | Priority escalation, custom SLA, on-site option |

**Hypercare (Post Go-Live)**
- 30-day daily standups with delivery team
- Dedicated Slack/Teams channel
- Rapid issue triage and resolution
- Adoption tracking and training reinforcement

**Customer Success**
- Dedicated Customer Success Manager for Premium/Enterprise
- Quarterly Business Reviews with adoption metrics
- Feature release guidance and upgrade planning\`,
    },
    {
        id: "contact-information",
        title: "Contact Information",
        content: \`**Sales & Partnerships**
Email: sales@arjunautomation.com
Web: www.arjunautomation.com

**Customer Success**
Email: success@arjunautomation.com

**Support (Managed Clients)**
Email: support@arjunautomation.com
Portal: Available via Client Portal module

**Office Hours**
Monday – Friday, 9:00 AM – 6:00 PM IST
Emergency support: 24/7 for managed support clients\`,
    },
];

export function buildDefaultCompanyProfile() {
    return {
        sections: DEFAULT_COMPANY_PROFILE_SECTIONS,
        updatedAt: new Date().toISOString(),
    };
}
`);

// ─── data/services-catalog.ts ─────────────────────────────────────────────
write("src/modules/business-assets/data/services-catalog.ts", `import type { ServiceCatalogItem } from "../types";

export const DEFAULT_SERVICES_CATALOG: ServiceCatalogItem[] = [
    {
        id: "platform-implementation",
        name: "Platform Implementation",
        slug: "platform-implementation",
        overview: "Full Arjun Automation OS deployment, configuration, and integration. We provision your tenant, configure core modules (CRM, Projects, Finance, HR, Tasks, Documents), set up enterprise identity and governance, integrate with your existing systems, and train your team for go-live.",
        benefits: [
            "Single source of truth across sales, delivery, finance, and operations",
            "90-day average go-live vs. 12–18 months for custom builds",
            "Enterprise security with RLS, audit logs, and tenant isolation from day one",
            "AI-ready foundation — activate AI workers immediately after go-live",
            "Reduced TCO — one platform subscription vs. 10+ point solutions",
        ],
        deliverables: [
            "Provisioned Arjun Automation OS tenant with enterprise identity (MFA, RBAC)",
            "Configured core modules: CRM, Projects, Tasks, Finance, HR, Inventory, Documents",
            "Custom workflow and form configurations per agreed scope",
            "Integration with up to 3 external systems (ERP, accounting, communication)",
            "Data migration from legacy systems (up to agreed record volumes)",
            "Admin and end-user training (virtual, up to 40 hours)",
            "UAT support and go-live cutover",
            "30-day hypercare post-launch",
            "Go-live documentation and runbook",
        ],
        timeline: "8–12 weeks: Discover (2w) → Design (2w) → Configure (4w) → Validate (2w) → Launch (2w)",
        pricingPlaceholder: "Essential $45K–$75K | Professional $75K–$120K | Enterprise $120K–$200K. 40% signing, 30% UAT, 30% go-live.",
        industries: ["Professional Services", "Technology & SaaS", "Multi-location Operations", "Growth-stage Companies"],
        technology: ["Arjun Automation OS", "Enterprise Identity", "CRM", "Projects", "Finance", "AI Workers", "REST API Integrations"],
        faq: [
            { question: "How long does implementation take?", answer: "Most implementations complete in 8–12 weeks depending on module count and integration complexity." },
            { question: "Do you migrate our existing data?", answer: "Yes — data migration is included in Professional and Enterprise tiers up to agreed record volumes." },
            { question: "What training is included?", answer: "Up to 40 hours of virtual admin and end-user training, plus go-live documentation and runbooks." },
        ],
    },
    {
        id: "industry-pack-deployment",
        name: "Industry Pack Deployment",
        slug: "industry-pack-deployment",
        overview: "Pre-configured industry operating systems — Restaurant OS, Hospital OS, School OS, or Retail OS — deployed on Arjun Automation OS with industry-specific workflows, forms, documents, dashboards, and role configurations.",
        benefits: [
            "60–70% faster deployment vs. greenfield configuration",
            "Proven workflows validated across multiple deployments",
            "Multi-location consistency with centralized governance",
            "Industry compliance templates built in",
            "Faster time-to-revenue for new locations or facilities",
        ],
        deliverables: [
            "Selected Industry OS pack deployed and configured",
            "Multi-location / multi-facility hierarchy setup",
            "Industry workflows, forms, and document templates activated",
            "Role-based access for industry-specific personas",
            "Industry dashboards and KPI configuration",
            "Integration with industry-specific systems (POS, EMR, LMS, etc.)",
            "Staff training for industry workflows",
            "Go-live support and 30-day hypercare",
        ],
        timeline: "6–10 weeks: Pack selection (1w) → Configuration (3–4w) → Customization (2w) → UAT & Launch (2–3w)",
        pricingPlaceholder: "Restaurant OS $35K–$65K | Hospital OS $55K–$95K | School OS $40K–$70K | Retail OS $35K–$60K per deployment.",
        industries: ["Restaurants & Hospitality", "Healthcare", "Education", "Retail"],
        technology: ["Restaurant OS", "Hospital OS", "School OS", "Retail OS", "Arjun Automation OS Core", "Industry Analytics"],
        faq: [
            { question: "Can we customize the industry pack?", answer: "Yes — we customize locations, branding, and operational requirements while preserving the proven foundation." },
            { question: "Which industry packs are available?", answer: "Restaurant OS, Hospital OS, School OS, and Retail OS — each with validated workflows and dashboards." },
            { question: "Do we need Platform Implementation first?", answer: "Industry packs deploy on Arjun Automation OS. Platform Implementation can be bundled or done separately." },
        ],
    },
    {
        id: "ai-worker-integration",
        name: "AI Worker Integration",
        slug: "ai-worker-integration",
        overview: "Deploy AI workers across business analysis, architecture, development, QA, DevOps, and customer success — with structured workflows, audit trails, and human approval gates integrated into your delivery pipelines.",
        benefits: [
            "3–5x delivery throughput for BA and architect capacity",
            "Governed AI outputs with full audit trails",
            "Consistent quality across all AI-generated deliverables",
            "Unified AI context from organizational knowledge base",
            "Proactive customer success with automated health scoring",
        ],
        deliverables: [
            "AI worker activation for selected roles (BA, Architect, Dev, QA, DevOps, CS)",
            "Workflow integration in project and delivery pipelines",
            "Knowledge base configuration feeding AI context",
            "Approval gates and human-in-the-loop rules per worker type",
            "AI output templates aligned with org standards",
            "Performance dashboards for AI worker utilization",
            "Team training on AI worker collaboration",
            "30-day optimization period post-activation",
        ],
        timeline: "4–8 weeks: Assessment (1w) → Configuration (2–3w) → Integration (2w) → Training & Optimization (1–2w)",
        pricingPlaceholder: "Starter (2 workers) $25K–$40K | Professional (4 workers) $45K–$70K | Enterprise (all 6) $70K–$110K.",
        industries: ["Technology & SaaS", "Professional Services", "System Integrators", "Enterprise IT"],
        technology: ["AI Workers (BA, Architect, Dev, QA, DevOps, CS)", "Knowledge Engine", "Workflow Engine", "Audit & Governance"],
        faq: [
            { question: "Which AI workers are available?", answer: "Business Analyst, Solution Architect, Development Factory, QA Engineer, DevOps & Deployment, and Customer Success." },
            { question: "Are AI outputs reviewed by humans?", answer: "Yes — configurable approval gates ensure human-in-the-loop review for all critical outputs." },
            { question: "Can we use our own knowledge base?", answer: "Yes — we configure your org policies, templates, and standards as AI context." },
        ],
    },
    {
        id: "enterprise-consulting",
        name: "Enterprise Consulting",
        slug: "enterprise-consulting",
        overview: "Strategic advisory for digital transformation, operating model design, and automation roadmap — helping organizations assess current state, design target models, and prepare for transformation before or independent of platform deployment.",
        benefits: [
            "Clear transformation roadmap with prioritized initiatives",
            "Data-driven build vs. platform recommendation with TCO analysis",
            "Enterprise-wide automation coherence vs. siloed projects",
            "ROI framework for measuring automation investment returns",
            "Organizational readiness plan alongside technology selection",
        ],
        deliverables: [
            "Current-state assessment report (processes, systems, pain points)",
            "Target operating model design document",
            "Automation opportunity map with prioritized initiatives",
            "Build vs. platform recommendation with TCO analysis",
            "Transformation roadmap with phased milestones",
            "Change management and readiness plan",
            "Executive presentation for leadership alignment",
            "Optional: proof-of-concept scope definition",
        ],
        timeline: "3–6 weeks: Discovery (1–2w) → Analysis (1–2w) → Design & Roadmap (1–2w) → Presentation (1w)",
        pricingPlaceholder: "Assessment $15K–$25K | Operating Model Design $25K–$45K | Full Transformation Roadmap $45K–$75K.",
        industries: ["All Industries", "Mid-market (100–2000 employees)", "Growth-stage Companies", "Enterprise IT"],
        technology: ["Process Mapping", "TCO Modeling", "Automation Opportunity Framework", "Change Management Toolkit"],
        faq: [
            { question: "Do we need to commit to platform deployment?", answer: "No — consulting can be standalone or precede a platform engagement." },
            { question: "Who delivers the consulting?", answer: "Experienced operators and architects with enterprise transformation backgrounds." },
            { question: "What deliverables do we receive?", answer: "Assessment report, operating model design, automation map, TCO analysis, roadmap, and executive presentation." },
        ],
    },
    {
        id: "managed-support",
        name: "Managed Support",
        slug: "managed-support",
        overview: "Ongoing platform operations, 24/7 monitoring, security patching, performance optimization, user support escalation, and quarterly business reviews — keeping your Arjun Automation OS deployment healthy, secure, and evolving after go-live.",
        benefits: [
            "99.9% uptime SLA (Premium and Enterprise tiers)",
            "Dedicated Customer Success Manager",
            "Proactive monitoring vs. reactive firefighting",
            "Security patches applied within SLA windows",
            "Quarterly business reviews with adoption metrics",
        ],
        deliverables: [
            "24/7 platform health monitoring and alerting",
            "Dedicated Customer Success Manager (CSM)",
            "Tiered support desk with SLA-backed response times",
            "Monthly platform health report",
            "Quarterly business review (QBR) with adoption metrics",
            "Security patch and platform update management",
            "User provisioning and access management support",
            "Backup verification and disaster recovery testing (quarterly)",
            "Feature release notes and upgrade guidance",
            "Priority escalation channel for P1 incidents",
        ],
        timeline: "Ongoing monthly subscription — onboarding within 1 week of contract signing",
        pricingPlaceholder: "Standard $2K–$4K/mo | Premium $5K–$10K/mo | Enterprise $10K–$20K/mo (based on user count and SLA tier).",
        industries: ["All Industries with active Arjun Automation OS deployment"],
        technology: ["Platform Monitoring", "Alerting & Incident Management", "Backup & DR", "Security Patching", "Analytics & Reporting"],
        faq: [
            { question: "What SLA tiers are available?", answer: "Standard (8 business hours), Premium (4 hours, 24/7 P1), and Enterprise (1 hour, 24/7 all severities)." },
            { question: "Is hypercare included?", answer: "Hypercare is included with implementation engagements. Managed Support begins after hypercare transition." },
            { question: "Can we upgrade tiers?", answer: "Yes — tier upgrades take effect at the next billing cycle with immediate SLA adjustment." },
        ],
    },
];
`);
