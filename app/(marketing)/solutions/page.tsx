import type { Metadata } from "next";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
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
    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-indigo-950">Solutions</h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        One platform. Every module. AI-native from the ground up.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
                    {solutions.map((solution) => (
                        <article key={solution.title} className="grid gap-8 lg:grid-cols-2 lg:items-start">
                            <div>
                                <h2 className="text-2xl font-semibold text-indigo-950">{solution.title}</h2>
                                <p className="mt-4 text-slate-600 leading-relaxed">{solution.description}</p>
                            </div>
                            <ul className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 space-y-3">
                                {solution.features.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-indigo-900">
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-700" aria-hidden="true" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section className="bg-slate-50 py-16">
                <div className="mx-auto max-w-xl px-6 lg:px-8">
                    <h2 className="text-2xl font-semibold text-indigo-950 text-center">Request a solution briefing</h2>
                    <p className="mt-2 text-center text-slate-600">Our team will map your requirements to the right modules and delivery approach.</p>
                    <div className="mt-8">
                        <LeadForm source="solutions-page" />
                    </div>
                </div>
            </section>

            <CtaSection />
        </>
    );
}
