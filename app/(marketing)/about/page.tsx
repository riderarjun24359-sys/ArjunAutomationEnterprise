import type { Metadata } from "next";
import Link from "next/link";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "About Arjun Automations",
    description:
        "Learn about Arjun Automations, a founder-led software and automation business helping small businesses across India with affordable websites, workflows and practical business tools.",
    path: MARKETING_ROUTES.about,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "About", path: PAGE.path },
];

const PRINCIPLES = [
    {
        title: "Understand the work before choosing technology",
        description:
            "We start with the current process, the people involved and the points where time or information gets lost. Then we decide whether software or automation is worthwhile.",
    },
    {
        title: "Keep the scope clear",
        description:
            "Features, exclusions, milestones and costs are agreed in writing before development. If a requirement changes, we explain its impact before proceeding.",
    },
    {
        title: "Build for the people using it",
        description:
            "A system should make everyday work easier for owners, staff and customers. We favour clear screens and practical workflows over complexity for its own sake.",
    },
    {
        title: "Be careful with data and integrations",
        description:
            "Access, data handling, backups and third-party services are considered as part of each project's design. The right safeguards depend on the information and services involved.",
    },
    {
        title: "Stay honest about outcomes",
        description:
            "We do not invent client results, testimonials or performance numbers. We explain what is ready, what still needs validation and what depends on external providers.",
    },
];

export default function AboutPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="Practical software, built around the way your business works."
                description="Arjun Automations is a founder-led software and automation business based in Telangana and serving businesses across India. Our aim is to make useful technology accessible to local shops, traders, clinics, schools, workshops and growing teams — including businesses in towns and villages."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />

                <div className="space-y-16">
                    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                                Who we are
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                                A small, hands-on studio — not a large agency pretending to be one.
                            </h2>
                            <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
                                <p>
                                    Arjun Automation helps organisations improve how they present their business online and how everyday work moves between people and tools. Our work includes custom business websites, workflow automation and tailored portals.
                                </p>
                                <p>
                                    We keep the engagement direct and practical: understand the problem, agree on a useful first version, build it, review it with you and support the agreed system after handover when needed.
                                </p>
                                <p>
                                    We are building our work one project at a time. We do not claim a long client list, published case studies or results that we cannot substantiate.
                                </p>
                            </div>
                        </div>

                        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                            <h2 className="text-lg font-semibold text-slate-900">At a glance</h2>
                            <dl className="mt-6 space-y-5">
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Based in</dt>
                                    <dd className="mt-1 font-medium text-slate-900">Balanagar, Secunderabad, Telangana</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Working model</dt>
                                    <dd className="mt-1 font-medium text-slate-900">Founder-led, direct collaboration</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Core work</dt>
                                    <dd className="mt-1 font-medium text-slate-900">Websites, workflow automation and business portals</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Engagement</dt>
                                    <dd className="mt-1 font-medium text-slate-900">Clearly scoped projects and optional monthly support</dd>
                                </div>
                            </dl>
                        </aside>
                    </section>

                    <section aria-labelledby="approach-heading" className="border-t border-slate-200 pt-12">
                        <div className="max-w-2xl">
                            <h2 id="approach-heading" className="text-2xl font-semibold text-slate-900">
                                How we approach a project
                            </h2>
                            <p className="mt-3 leading-7 text-slate-600">
                                The aim is not to add technology for its own sake. It is to solve a defined problem in a way your team can understand and maintain.
                            </p>
                        </div>
                        <ol className="mt-8 grid gap-5 md:grid-cols-2">
                            {[
                                ["Understand", "Discuss your current process, users, constraints and the problem worth solving."],
                                ["Define", "Agree on features, exclusions, responsibilities, timeline and an INR quotation."],
                                ["Build and review", "Develop the agreed solution and review it with you before launch."],
                                ["Handover and support", "Provide the agreed handover. Ongoing maintenance can be arranged separately."],
                            ].map(([title, description], index) => (
                                <li key={title} className="rounded-2xl border border-slate-200 p-6">
                                    <p className="text-sm font-semibold text-blue-700">0{index + 1}</p>
                                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section aria-labelledby="principles-heading" className="border-t border-slate-200 pt-12">
                        <div className="max-w-2xl">
                            <h2 id="principles-heading" className="text-2xl font-semibold text-slate-900">
                                What you can expect from us
                            </h2>
                        </div>
                        <div className="mt-8 grid gap-5 md:grid-cols-2">
                            {PRINCIPLES.map((principle) => (
                                <article key={principle.title} className="rounded-2xl bg-slate-50 p-6">
                                    <h3 className="font-semibold text-slate-900">{principle.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{principle.description}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl bg-slate-900 p-7 text-white sm:p-10">
                        <h2 className="text-2xl font-semibold">Have a process you want to improve?</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                            Share what your team is doing manually today. We will help assess whether a website, an automation or a custom portal is the right place to start.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href={MARKETING_ROUTES.contact}
                                className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                Talk about your project
                            </Link>
                            <Link
                                href={MARKETING_ROUTES.services}
                                className="inline-flex rounded-lg border border-slate-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Explore services
                            </Link>
                        </div>
                    </section>
                </div>
            </PremiumPageShell>
        </>
    );
}
