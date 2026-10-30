import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Solutions",
    description:
        "Unified platform, AI-native operations, industry-ready speed, and enterprise trust — four pillars of Arjun Automation OS solutions.",
    path: "/solutions",
});

const solutions = [
    {
        title: "Unified Business Platform",
        description: "Stop stitching tools together. CRM, projects, finance, HR, inventory, and 40+ modules on one tenant with shared authentication and audit trails.",
        features: ["Single sign-on across all modules", "Shared data layer with RLS", "Cross-module reporting", "Unified client records"],
    },
    {
        title: "AI Worker Workforce",
        description: "Deploy AI workers that execute with human approval — not chatbots that suggest. BA, Architect, Dev, QA, DevOps, and CS agents included.",
        features: ["Requirements drafting", "Architecture design", "Code generation", "Automated testing", "Deployment orchestration"],
    },
    {
        title: "Industry Operating Systems",
        description: "Go live with AI-accelerated delivery using pre-built Restaurant OS, Hospital OS, School OS, and Retail OS packs.",
        features: ["Industry-specific workflows", "Pre-configured dashboards", "Compliance-ready forms", "Multi-location support"],
    },
    {
        title: "Enterprise Governance",
        description: "Security and governance built in — tenant isolation, audit logs, compliance modules, and enterprise identity with MFA.",
        features: ["Row Level Security on every table", "Full audit trail", "Compliance reporting", "Enterprise identity and MFA"],
    },
];

export default function SolutionsPage() {
    const breadcrumbs = [
        { name: "Home", path: MARKETING_ROUTES.home },
        { name: "Solutions", path: "/solutions" },
    ];

    return (
        <>
            <MarketingStructuredData
                title="Solutions"
                description="Unified platform, AI-native operations, industry-ready speed, and enterprise trust — four pillars of Arjun Automation OS solutions."
                path="/solutions"
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="Solutions"
                description="One platform. Every module. AI-native from the ground up."
            >
                <div className="space-y-16">
                    {solutions.map((solution) => (
                        <article key={solution.title} className="grid gap-8 lg:grid-cols-2 lg:items-start">
                            <div>
                                <h2 className="text-2xl font-semibold text-[var(--premium-fg)]">{solution.title}</h2>
                                <p className="mt-4 max-w-xl text-[var(--premium-fg-muted)] leading-relaxed">
                                    {solution.description}
                                </p>
                            </div>
                            <ul className="rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] p-6 space-y-3">
                                {solution.features.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-[var(--premium-fg-muted)]">
                                        <span
                                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--dos-brand-primary)]"
                                            aria-hidden="true"
                                        />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}

                    <section aria-labelledby="briefing-heading" className="premium-glass rounded-2xl p-8">
                        <h2 id="briefing-heading" className="text-2xl font-semibold text-[var(--premium-fg)] text-center">
                            Request a solution briefing
                        </h2>
                        <p className="mt-2 text-center text-[var(--premium-fg-muted)]">
                            Our team will map your requirements to the right modules and delivery approach.
                        </p>
                        <div className="mt-8">
                            <LeadForm source="solutions-page" />
                        </div>
                    </section>
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
