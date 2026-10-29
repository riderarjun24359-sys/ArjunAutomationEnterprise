import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    ClipboardList,
    Factory,
    GraduationCap,
    HeartPulse,
    Layers,
    LineChart,
    Plug,
    ScanSearch,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Stethoscope,
    Workflow,
} from "lucide-react";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { FaqAccordionStatic } from "@/src/modules/company-launch-kit/components/FaqAccordionStatic";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { AI_DELIVERY_JOURNEY_STEPS } from "@/src/constants/ai-delivery-model";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Arjun Automation — AI Automation for Business Operations",
    description:
        "AI automation platform for growing organizations. Connect the tools you already run, automate the workflows between them, and ship solutions with expert review before go-live.",
    path: "/",
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const solutions = [
    {
        icon: LineChart,
        title: "CRM & Sales",
        body: "Pipeline, follow-ups, and client records in one place — no more retyping the same enquiry into three tools.",
        href: MARKETING_ROUTES.solutions,
    },
    {
        icon: ClipboardList,
        title: "Projects & Delivery",
        body: "Tasks, milestones, and client visibility connected to the systems that actually deliver the work.",
        href: MARKETING_ROUTES.solutions,
    },
    {
        icon: Layers,
        title: "Finance & Billing",
        body: "Invoicing, expenses, and reporting fed by live operational data instead of month-end spreadsheets.",
        href: MARKETING_ROUTES.solutions,
    },
    {
        icon: Workflow,
        title: "Workflow Automation",
        body: "Triggers, conditions, and approvals that move work between departments without anyone chasing it.",
        href: MARKETING_ROUTES.solutions,
    },
    {
        icon: Sparkles,
        title: "AI Agents",
        body: "AI workers for analysis, development, QA, and support — with approval gates and full audit trails.",
        href: MARKETING_ROUTES.solutions,
    },
    {
        icon: ShieldCheck,
        title: "Governance & Compliance",
        body: "Role-based access, tenant isolation, and audit logs built into the platform from day one.",
        href: MARKETING_ROUTES.solutions,
    },
];

const services = [
    {
        title: "Platform Implementation",
        body: "Deploy Arjun Automation OS and integrate it with the systems you already run — configured around your actual workflows.",
    },
    {
        title: "Industry Packs",
        body: "Sector-specific workflows and dashboards for restaurants, healthcare, education, retail, and professional services.",
    },
    {
        title: "AI Worker Integration",
        body: "Activate AI agents where they remove real work — with human approval gates wherever judgement matters.",
    },
    {
        title: "Consulting & Support",
        body: "Automation strategy, operating-model design, and ongoing platform support after go-live.",
    },
];

const industries = [
    { icon: Stethoscope, name: "Healthcare", body: "Patient workflows, compliance, and billing integration." },
    { icon: Factory, name: "Manufacturing", body: "Supply chain, quality, and production planning automation." },
    { icon: ShoppingBag, name: "Retail & Commerce", body: "Inventory, POS integration, and omnichannel fulfilment." },
    { icon: Building2, name: "Professional Services", body: "CRM, projects, time tracking, and client portals." },
    { icon: HeartPulse, name: "Restaurants & Hospitality", body: "Multi-location ops, inventory, and staff scheduling." },
    { icon: GraduationCap, name: "Education", body: "Admissions, attendance, finance, and parent communication." },
];

const platformFacts = [
    { icon: ShieldCheck, label: "Row-level security & tenant isolation" },
    { icon: ClipboardList, label: "Audit trails across every module" },
    { icon: Plug, label: "API-first with webhook integrations" },
    { icon: ScanSearch, label: "Health, readiness & liveness endpoints" },
];

const primaryButton =
    "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--dos-brand-primary)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--premium-accent-glow)] transition hover:-translate-y-0.5 hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2 sm:w-auto";

const secondaryButton =
    "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--dos-border-strong)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--premium-fg)] transition hover:border-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2 sm:w-auto";

/**
 * Illustrative product view shown in the hero. This is a static illustration
 * of how the workflow engine routes work — it deliberately shows no metrics,
 * counters, or client data, because none can be published honestly.
 */
function WorkflowConsolePreview() {
    const rows = [
        { trigger: "New enquiry received", action: "CRM record created · owner assigned", status: "Automated" },
        { trigger: "Invoice past due date", action: "Reminder sent · account team notified", status: "Automated" },
        { trigger: "Refund above approval limit", action: "Routed to finance manager", status: "Approval" },
        { trigger: "Weekly operations summary", action: "Generated · delivered to stakeholders", status: "Automated" },
    ];

    return (
        <figure className="premium-glass relative rounded-2xl border border-[var(--premium-border)] p-2 shadow-[var(--premium-shadow)]">
            <figcaption className="sr-only">
                Illustrative view of the Arjun Automation workflow console. Not a screenshot of customer data.
            </figcaption>
            <div className="flex items-center gap-2 border-b border-[var(--premium-border)] px-3 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-slate-300)]" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-slate-300)]" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-slate-300)]" aria-hidden="true" />
                <p className="ml-2 truncate text-xs font-medium text-[var(--premium-fg-muted)]">
                    Workflow runs · Operations
                </p>
            </div>
            <ul className="divide-y divide-[var(--premium-border-subtle)]">
                {rows.map((row) => (
                    <li key={row.trigger} className="flex items-start gap-3 px-3 py-3.5">
                        <CheckCircle2
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                                row.status === "Automated" ? "text-orange-500" : "text-orange-500/60"
                            }`}
                            aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[var(--premium-fg)]">{row.trigger}</p>
                            <p className="mt-0.5 truncate text-xs text-[var(--premium-fg-muted)]">{row.action}</p>
                        </div>
                        <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                row.status === "Automated"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-[var(--premium-bg-tertiary)] text-[var(--premium-fg-muted)]"
                            }`}
                        >
                            {row.status}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="grid grid-cols-3 gap-2 px-3 pb-3 pt-2">
                {["Intake", "Approval", "Delivery"].map((stage) => (
                    <div key={stage} className="rounded-lg border border-[var(--premium-border-subtle)] bg-[var(--premium-bg-secondary)] px-3 py-2.5">
                        <p className="text-[11px] font-medium text-[var(--premium-fg-muted)]">{stage}</p>
                        <div className="mt-2 flex gap-1" aria-hidden="true">
                            <span className="h-1.5 flex-1 rounded-full bg-orange-500/70" />
                            <span className="h-1.5 flex-1 rounded-full bg-orange-500/40" />
                            <span className="h-1.5 flex-1 rounded-full bg-[var(--color-slate-200)]" />
                        </div>
                    </div>
                ))}
            </div>
        </figure>
    );
}

/**
 * Enterprise AI-automation homepage.
 *
 * Every CTA points at a real public destination, the trust section only
 * states capabilities that exist in this codebase (see
 * ENTERPRISE_PLATFORM_CONTENT), and no metrics, client logos, or outcomes
 * are published that cannot be verified.
 */
export default function HomePage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={[{ name: "Home", path: PAGE.path }]}
            />

            {/* Layout already renders <main id="main-content"> — keep this a plain container. */}
            <div>
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-[var(--premium-border)]">
                    <div className="premium-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
                    <div className="premium-grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
                    <div className="premium-container relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
                        <div>
                            <p className="premium-eyebrow hero-fade-up">AI Automation Platform</p>
                            <h1 className="hero-fade-up hero-delay-1 mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                                Automate the work that keeps your business&nbsp;running.
                            </h1>
                            <p className="hero-fade-up hero-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-[var(--premium-fg-muted)]">
                                Missed enquiries, retyped data, tasks nobody chases. Arjun Automation connects the
                                systems you already run into one workflow — so the work gets done without anyone
                                remembering to do it.
                            </p>
                            <div className="hero-fade-up hero-delay-3 mt-9 flex flex-col gap-4 sm:flex-row">
                                <Link href={MARKETING_ROUTES.contact} className={primaryButton}>
                                    Book a Demo
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                <Link href={MARKETING_ROUTES.solutions} className={secondaryButton}>
                                    Explore Solutions
                                </Link>
                            </div>
                            <dl className="hero-fade-up hero-delay-4 mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                                {platformFacts.map((fact) => (
                                    <div key={fact.label} className="flex items-center gap-2.5">
                                        <fact.icon className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
                                        <dd className="text-sm text-[var(--premium-fg-muted)]">{fact.label}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div className="hero-fade-up hero-delay-2">
                            <WorkflowConsolePreview />
                        </div>
                    </div>
                </section>

                {/* Solutions overview */}
                <section className="premium-section border-b border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]" aria-labelledby="solutions-heading">
                    <div className="premium-container">
                        <p className="premium-eyebrow">One platform</p>
                        <h2 id="solutions-heading" className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                            Every operation, connected on one system
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg text-[var(--premium-fg-muted)]">
                            CRM, delivery, finance, and AI orchestration share a single data layer, so information
                            enters once and flows everywhere it is needed.
                        </p>
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {solutions.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="premium-card group block p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                                >
                                    <span className="premium-card-icon" aria-hidden="true">
                                        <item.icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--premium-fg-muted)]">{item.body}</p>
                                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-orange-600">
                                        Explore
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="premium-section border-b border-[var(--premium-border)]" aria-labelledby="services-heading">
                    <div className="premium-container">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="premium-eyebrow">How we help</p>
                                <h2 id="services-heading" className="mt-4 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                                    Delivery built for outcomes, not hours
                                </h2>
                            </div>
                            <Link
                                href={MARKETING_ROUTES.services}
                                className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-orange-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                            >
                                All services
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {services.map((item) => (
                                <div key={item.title} className="premium-card p-6">
                                    <h3 className="text-base font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--premium-fg-muted)]">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Industries */}
                <section className="premium-section border-b border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]" aria-labelledby="industries-heading">
                    <div className="premium-container">
                        <p className="premium-eyebrow">Industries we build for</p>
                        <h2 id="industries-heading" className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                            Workflows shaped around how your sector actually runs
                        </h2>
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {industries.map((item) => (
                                <Link
                                    key={item.name}
                                    href={MARKETING_ROUTES.industries}
                                    className="premium-card group flex items-start gap-4 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                                >
                                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" />
                                    <div>
                                        <h3 className="text-base font-semibold group-hover:text-orange-600">{item.name}</h3>
                                        <p className="mt-1 text-sm leading-relaxed text-[var(--premium-fg-muted)]">{item.body}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <p className="mt-8 text-sm text-[var(--premium-fg-muted)]">
                            Running a school or trust?{" "}
                            <Link href="/school-erp" className="font-medium text-orange-600 hover:underline">
                                See the School ERP pack
                            </Link>{" "}
                            for attendance, fees, and parent communication.
                        </p>
                    </div>
                </section>

                {/* Delivery process */}
                <section className="premium-section border-b border-[var(--premium-border)]" aria-labelledby="process-heading">
                    <div className="premium-container">
                        <p className="premium-eyebrow">How delivery works</p>
                        <h2 id="process-heading" className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                            AI-first delivery, expert-gated before go-live
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg text-[var(--premium-fg-muted)]">
                            Analysis is fast, the first working version follows quickly, and production deployment
                            happens only after review and validation.
                        </p>
                        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                            {AI_DELIVERY_JOURNEY_STEPS.map((step) => (
                                <li key={step.phase} className="premium-card p-6">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">{step.phase}</p>
                                    <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--premium-fg-muted)]">{step.description}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* FAQ */}
                <section className="premium-section border-b border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]" aria-label="Frequently asked questions">
                    <div className="premium-container max-w-3xl">
                        <FaqAccordionStatic />
                    </div>
                </section>

                {/* Final CTA */}
                <CtaSection
                    title="See your operations running on one platform"
                    description="Book a demo and we will walk through how Arjun Automation maps to your actual workflows — no slideware, just the system."
                    primaryLabel="Book a Demo"
                    primaryHref={MARKETING_ROUTES.contact}
                    secondaryLabel="See pricing"
                    secondaryHref={MARKETING_ROUTES.pricing}
                />
            </div>
        </>
    );
}
