import type { CompanyProfileSection } from "../types";

export const DEFAULT_COMPANY_PROFILE_SECTIONS: CompanyProfileSection[] = [
    {
        id: "company-overview",
        title: "Company Overview",
        content: `Arjun Automation is an enterprise automation company headquartered in India, serving mid-market and enterprise clients globally. We build and operate **Arjun Automation OS** — a unified business operating system that combines CRM, project management, finance, HR, inventory, AI workers, industry-specific modules, and enterprise governance into one secure, composable platform.

Founded by operators who lived through painful digital transformation programs, we exist to eliminate the false choice between speed and enterprise rigor. Our clients launch new operations in weeks, not years — with the security, auditability, and scalability their boards demand.

**Company Name:** Arjun Automation
**Product:** Arjun Automation OS (Enterprise)
**Founded:** 2024
**Headquarters:** India (Global Delivery)`,
    },
    {
        id: "mission",
        title: "Mission",
        content: `To democratize enterprise automation by delivering an integrated operating system that empowers every organization to run like a world-class enterprise — with AI-native workflows, industry-ready foundations, and measurable outcomes from day one.`,
    },
    {
        id: "vision",
        title: "Vision",
        content: `A world where every organization — from a 10-location restaurant group to a regional hospital network — operates on intelligent automation with enterprise-grade security, without enterprise-grade timelines or budgets.`,
    },
    {
        id: "core-values",
        title: "Core Values",
        content: `1. **Outcome Over Output** — We measure success by client results, not deliverable counts.
2. **Platform Thinking** — Build once, configure many; avoid bespoke dead ends.
3. **Security First** — Tenant isolation, audit trails, and governance are non-negotiable.
4. **Radical Clarity** — Plain language, transparent pricing, honest timelines.
5. **Continuous Evolution** — Ship, learn, iterate; our platform grows with our clients.
6. **Partnership Mindset** — We succeed when our clients succeed long after go-live.`,
    },
    {
        id: "founder-message",
        title: "Founder Message",
        content: `When we started Arjun Automation, we had one question: why does every company have to choose between moving fast and operating safely?

We watched teams stitch together a dozen SaaS tools, hire armies of integrators, and still lack a single source of truth. We watched AI demos impress executives but fail in production because they weren't wired into real workflows.

Arjun Automation OS is our answer — one platform, every module, AI-native from the ground up. We built it for operators who need enterprise rigor without enterprise timelines. Whether you're launching a restaurant group, a hospital network, or a professional services firm, we're here to help you launch in weeks and scale with confidence.

— The Arjun Automation Founding Team`,
    },
    {
        id: "why-us",
        title: "Why Arjun Automation",
        content: `### 1. One Platform, Not a Patchwork
Forty-plus integrated modules share a single data layer, authentication system, and audit framework. No integration middleware to maintain.

### 2. AI That Executes
Our AI workers don't just chat — they draft requirements, generate code, run tests, deploy releases, and manage customer health scores with full audit trails.

### 3. Industry Depth
Pre-built Restaurant OS, Hospital OS, School OS, and Retail OS packs include workflows, forms, documents, and dashboards specific to each vertical.

### 4. Security by Architecture
Row Level Security on every table, tenant isolation, enterprise identity with MFA, governance and compliance modules — not optional add-ons.

### 5. AI-First Delivery
Every engagement follows: AI Requirement Analysis → AI Solution Generation → Expert Engineering Review → Customer Validation → Secure Production Deployment. Customers receive AI-accelerated delivery without compromising enterprise quality, security, or reliability.

### 6. Transparent Partnership
Fixed-scope proposals, milestone-based billing, dedicated customer success manager, and SLA-backed managed support.`,
    },
    {
        id: "industries",
        title: "Industries",
        content: `- **Restaurants & Hospitality** — Multi-location operations, kitchen workflows, guest experience
- **Healthcare** — Patient management, clinical operations, pharmacy, laboratory
- **Education** — Student lifecycle, academics, staff, parent portals
- **Retail** — Product catalog, POS, inventory, customer loyalty
- **Professional Services** — CRM, project delivery, billing, client portals
- **Technology & SaaS** — Internal operations, customer success, launch readiness

Each industry benefits from pre-built **Industry OS packs** that accelerate deployment by 60–70% compared to greenfield configuration.`,
    },
    {
        id: "services",
        title: "Services",
        content: `| Service | Summary |
|---------|---------|
| **Platform Implementation** | Full Arjun Automation OS deployment, configuration, and integration |
| **Industry Pack Deployment** | Restaurant, Hospital, School, or Retail OS go-live |
| **AI Worker Integration** | BA, Architect, Dev, QA, DevOps, and CS agent activation |
| **Enterprise Consulting** | Operating model design, automation strategy, transformation roadmap |
| **Managed Support** | 24/7 platform monitoring, updates, and customer success |`,
    },
    {
        id: "technology-stack",
        title: "Technology Stack",
        content: `**Platform Core**
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
- SSO/MFA via Enterprise Identity module`,
    },
    {
        id: "methodology",
        title: "Methodology",
        content: `Every engagement follows the AI-First Delivery Policy:

1. **AI Requirement Analysis** — Understand requirements, systems, integrations, and success criteria
2. **AI Solution Generation** — First complete working solution generated on our internal AI platform (hours instead of weeks)
3. **Expert Engineering Review** — Architecture, security, business, and UX validation
4. **Customer Validation** — Feedback, minor revisions, and approval
5. **Secure Production Deployment** — Deployment, testing, monitoring, and documentation

Customers receive AI-accelerated delivery without compromising enterprise quality, security, or reliability. Delivery roadmap is finalized after technical discovery and integration assessment.`,
    },
    {
        id: "delivery-process",
        title: "Delivery Process",
        content: `### Step 1: AI Requirement Analysis
- Stakeholder workshops and requirement capture
- Current-state process mapping
- Module and industry pack selection
- Success criteria definition

### Step 2: AI Solution Generation
- First working solution generated on internal AI platform
- Integration scoping and data migration planning
- Workflow and module configuration draft

### Step 3: Expert Engineering Review
- Solution architecture and security validation
- Business and UX review gates
- Readiness checklist before customer presentation

### Step 4: Customer Validation
- User acceptance testing
- Training delivery
- Feedback, revisions, and formal approval

### Step 5: Secure Production Deployment
- Production cutover with monitoring
- Dedicated hypercare support period
- Transition to managed support
- Success metrics review post-launch`,
    },
    {
        id: "support-model",
        title: "Support Model",
        content: `**Managed Support Tiers**

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
- Feature release guidance and upgrade planning`,
    },
    {
        id: "contact-information",
        title: "Contact Information",
        content: `**Sales & Partnerships**
Email: sales@arjunautomations.com
Web: www.arjunautomations.com

**Customer Success**
Email: success@arjunautomations.com

**Support (Managed Clients)**
Email: support@arjunautomations.com
Portal: Available via Client Portal module

**Office Hours**
Monday – Friday, 9:00 AM – 6:00 PM IST
Emergency support: 24/7 for managed support clients`,
    },
];

export function buildDefaultCompanyProfile() {
    return {
        sections: DEFAULT_COMPANY_PROFILE_SECTIONS,
        updatedAt: new Date().toISOString(),
    };
}

