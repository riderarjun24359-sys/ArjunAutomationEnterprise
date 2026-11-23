import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PROJECT_PRICING, MANAGED_SUPPORT_PRICING } from "@/src/modules/company-launch-kit/data/pricing";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Custom Websites, AI Automation & Business Portals in Hyderabad",
    description:
        "Arjun Automation builds custom business websites, practical AI and workflow automations, internal portals and managed support for businesses in Hyderabad and Secunderabad.",
    path: MARKETING_ROUTES.services,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    keywords: [
        "website development Hyderabad",
        "business automation Hyderabad",
        "AI workflow automation Secunderabad",
        "custom CRM and portals",
        "school ERP development",
    ],
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Services", path: PAGE.path },
];

const services = [
    {
        id: "websites",
        number: "01",
        eyebrow: "Web design & development",
        title: "Custom Business Websites",
        intro: "A clear, fast website that explains what your business does and makes it easy for the right people to contact you.",
        deliverables: [
            "Custom page layouts for your services, about, contact and key business information",
            "Responsive layouts for mobile, tablet and desktop",
            "Enquiry forms, click-to-call and WhatsApp contact links",
            "Page titles, descriptions, sitemap and essential technical SEO setup",
            "Content structure and launch support",
        ],
        examples: "Company websites, professional service websites, clinic websites and local business websites.",
        technology: "The stack is selected for the project. Where appropriate, we use Next.js, React, TypeScript and a content system that your team can maintain.",
        timeline: "Typically 1–2 weeks after content, assets and scope are approved.",
        price: PROJECT_PRICING[0].price,
        note: "Starting price for a focused 5–7 page website. Extra pages, copywriting, booking systems, advanced integrations and paid third-party services are scoped separately.",
    },
    {
        id: "automations",
        number: "02",
        eyebrow: "AI & workflow integration",
        title: "AI & Workflow Automations",
        intro: "Reduce repetitive follow-up and manual data entry by connecting the tools your team already uses.",
        deliverables: [
            "Lead capture and routing from agreed website forms or channels",
            "WhatsApp or email acknowledgement and follow-up workflows",
            "Lead qualification and staff notifications",
            "Automatic quotation or invoice reminder flows where the source data is available",
            "Google Sheets or CRM synchronisation and basic activity reporting",
        ],
        examples: "WhatsApp lead qualification, enquiry-to-CRM workflows, quotation follow-ups, invoice reminders and team alerts.",
        technology: "We choose integrations based on available APIs and your existing accounts. AI is used where it adds value; a human hand-off is included for exceptions and sensitive decisions.",
        timeline: "Typically 1–2 weeks for one or two agreed workflows.",
        price: PROJECT_PRICING[1].price,
        note: "Starting price for a defined automation sprint. WhatsApp provider charges, AI usage, API subscriptions and complex legacy integrations are not included unless stated in the proposal.",
    },
    {
        id: "portals",
        number: "03",
        eyebrow: "Custom software",
        title: "Custom Portals, CRM & School ERP",
        intro: "Purpose-built portals and dashboards for teams that have outgrown spreadsheets or disconnected tools.",
        deliverables: [
            "Role-based login and permissions for agreed user types",
            "Custom dashboards, records, search and status tracking",
            "Client, vendor or staff self-service workflows",
            "School workflows such as student records, fee tracking and attendance, based on agreed scope",
            "Data import, training and deployment planning where included in the statement of work",
        ],
        examples: "Client and vendor portals, internal operations dashboards, lightweight CRM systems and school administration portals.",
        technology: "We select the application framework, database and hosting to fit the scope. Access controls, backups and data handling are designed and reviewed for the actual project rather than assumed from a template.",
        timeline: "Typically 4–6 weeks for a focused first release. Larger ERP projects are phased after discovery.",
        price: PROJECT_PRICING[2].price,
        note: "Starting price for a defined first release. Complex permissions, large data migration, payment integrations, multiple campuses and specialised modules require a separate estimate.",
    },
];

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
    return (
        <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
        </div>
    );
}

function ContactLink({ children = "Discuss your project" }: { children?: ReactNode }) {
    return (
        <Link
            href={MARKETING_ROUTES.contact}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
            {children}
        </Link>
    );
}

export default function ServicesPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <div className="bg-white text-slate-900">
                <section className="border-b border-slate-200 bg-slate-50">
                    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
                        <MarketingBreadcrumbs items={breadcrumbs} />
                        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
                            What we build
                        </p>
                        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                            Practical digital systems for the way your business works.
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                            From a professional website to connected workflows and custom portals, we scope the work with you,
                            build a working version and help you launch it.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <ContactLink />
                            <Link href={MARKETING_ROUTES.pricing} className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400">
                                View starting prices
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">Based in Balanagar, Secunderabad · Working with businesses across Hyderabad and India.</p>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl space-y-10 px-5 py-14 sm:px-8 sm:py-20">
                    {services.map((service) => (
                        <article
                            id={service.id}
                            key={service.id}
                            className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white"
                        >
                            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                                <div className="bg-slate-50 p-7 sm:p-10">
                                    <p className="text-sm font-semibold tracking-[0.14em] text-blue-700">{service.number} / {service.eyebrow}</p>
                                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{service.title}</h2>
                                    <p className="mt-4 leading-7 text-slate-600">{service.intro}</p>
                                    <div className="mt-8 border-t border-slate-200 pt-6">
                                        <p className="text-sm text-slate-500">Starting project price</p>
                                        <p className="mt-1 text-3xl font-semibold text-slate-950">{service.price}</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-500">{service.note}</p>
                                        <p className="mt-5 text-sm font-medium text-slate-700">Typical delivery: {service.timeline}</p>
                                        <div className="mt-6"><ContactLink /></div>
                                    </div>
                                </div>
                                <div className="p-7 sm:p-10">
                                    <h3 className="text-base font-semibold text-slate-950">What the project can include</h3>
                                    <ul className="mt-4 space-y-3">
                                        {service.deliverables.map((item) => (
                                            <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-8 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2">
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">Typical use cases</h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-600">{service.examples}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">Technology approach</h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-600">{service.technology}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                <section id="support" className="scroll-mt-28 border-y border-slate-200 bg-slate-50">
                    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
                        <SectionTitle
                            eyebrow="After launch"
                            title="Managed Support & Maintenance"
                            description="Keep your website or automation maintained after handover. Support is offered as a monthly service with a clear scope and response target."
                        />
                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            {MANAGED_SUPPORT_PRICING.map((plan) => (
                                <article key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-7">
                                    <h3 className="text-xl font-semibold text-slate-950">{plan.name}</h3>
                                    <p className="mt-3 text-3xl font-semibold text-slate-950">{plan.price}<span className="ml-1 text-base font-normal text-slate-500">{plan.period}</span></p>
                                    <ul className="mt-5 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex gap-3 text-sm leading-6 text-slate-600">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                        <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-500">
                            The 1-business-day response target applies to eligible support requests during the agreed support window;
                            it is not a guaranteed resolution time or 24/7 emergency service. Hosting, provider and usage charges are
                            quoted separately unless listed in your agreement.
                        </p>
                        <div className="mt-8"><ContactLink>Discuss support options</ContactLink></div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
                    <div className="rounded-2xl bg-slate-950 px-7 py-10 text-white sm:px-10 sm:py-12">
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">Start with the problem</p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight">Not sure which service is right?</h2>
                        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                            Tell us what takes too much time, where enquiries get missed or which process your team wants to improve.
                            We will discuss the scope before recommending a build.
                        </p>
                        <div className="mt-7"><ContactLink>Request a free 20-minute call</ContactLink></div>
                    </div>
                </section>
            </div>
        </>
    );
}
