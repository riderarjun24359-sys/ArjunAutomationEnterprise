import Link from "next/link";
import type { Metadata } from "next";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { JsonLd } from "@/src/modules/company-launch-kit/components/JsonLd";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { buildMetadata, buildOrganizationJsonLd, buildWebPageJsonLd } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Arjun Automation — Enterprise Automation. Without the Enterprise Wait.",
    description:
        "Arjun Automation OS unifies CRM, projects, finance, AI workers, and industry packs into one secure platform. Most clients go live in 90 days.",
    path: "/",
});

const pillars = [
    {
        title: "Unified Platform",
        description: "40+ integrated modules share a single data layer, authentication system, and audit framework.",
    },
    {
        title: "AI-Native Operations",
        description: "AI workers that execute — BA, Architect, Dev, QA, DevOps, and Customer Success agents with audit trails.",
    },
    {
        title: "Industry-Ready Speed",
        description: "Restaurant OS, Hospital OS, School OS, and Retail OS packs accelerate deployment by 60–70%.",
    },
    {
        title: "Enterprise Trust",
        description: "Row Level Security, tenant isolation, audit logs, and governance modules built in from day one.",
    },
];

export default function HomePage() {
    return (
        <>
            <JsonLd data={buildOrganizationJsonLd()} />
            <JsonLd
                data={buildWebPageJsonLd({
                    title: "Arjun Automation — Enterprise Automation. Without the Enterprise Wait.",
                    description: "Arjun Automation OS unifies CRM, projects, finance, AI workers, and industry packs into one secure platform.",
                    path: "/",
                })}
            />

            <section className="bg-gradient-to-b from-indigo-50 to-white py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-700">Arjun Automation OS</p>
                            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-indigo-950 sm:text-5xl lg:text-6xl">
                                Enterprise automation. Without the enterprise wait.
                            </h1>
                            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                                Arjun Automation is the enterprise operating system for companies that have outgrown spreadsheets and point tools.
                                CRM, projects, finance, AI workers, and industry-specific modules — one secure platform. Most clients go live in 90 days.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href={MARKETING_ROUTES.contact}
                                    className="rounded-lg bg-indigo-700 px-6 py-3 font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700/20"
                                >
                                    Schedule Discovery Call
                                </Link>
                                <Link
                                    href={MARKETING_ROUTES.solutions}
                                    className="rounded-lg border border-indigo-200 px-6 py-3 font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-700/20"
                                >
                                    Explore Solutions
                                </Link>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-indigo-200 bg-white p-8 shadow-lg">
                            <h2 className="text-lg font-semibold text-indigo-950">Start your automation journey</h2>
                            <p className="mt-2 text-sm text-slate-600">Tell us about your goals. Our team responds within one business day.</p>
                            <div className="mt-6">
                                <LeadForm source="home-hero" compact submitLabel="Request Consultation" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20" aria-labelledby="pillars-heading">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 id="pillars-heading" className="text-center text-3xl font-semibold text-indigo-950">
                        Why organizations choose Arjun Automation
                    </h2>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {pillars.map((pillar) => (
                            <div key={pillar.title} className="rounded-2xl border border-slate-200 p-6">
                                <h3 className="text-lg font-semibold text-indigo-950">{pillar.title}</h3>
                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-20" aria-labelledby="portfolio-heading">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 id="portfolio-heading" className="text-3xl font-semibold text-indigo-950">
                                Featured work
                            </h2>
                            <p className="mt-2 text-slate-600">Real outcomes from enterprise automation deployments.</p>
                        </div>
                        <Link href={MARKETING_ROUTES.portfolio} className="hidden text-sm font-medium text-indigo-700 hover:text-indigo-600 sm:block">
                            View all &rarr;
                        </Link>
                    </div>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {PORTFOLIO_ITEMS.slice(0, 3).map((item) => (
                            <Link
                                key={item.slug}
                                href={MARKETING_ROUTES.portfolioItem(item.slug)}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-700/20"
                            >
                                <span className="text-xs font-medium text-indigo-700">{item.category}</span>
                                <h3 className="mt-2 text-lg font-semibold text-indigo-950 group-hover:text-indigo-700">{item.title}</h3>
                                <p className="mt-2 text-sm text-slate-600">{item.tagline}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <CtaSection />
        </>
    );
}
