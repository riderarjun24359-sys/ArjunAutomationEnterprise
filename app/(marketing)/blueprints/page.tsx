import type { Metadata } from "next";
import Link from "next/link";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Project Blueprints",
    description:
        "Explore illustrative project blueprints from Arjun Automation: business websites, WhatsApp lead workflows, school portals and clinic follow-up systems. These are example concepts, not claimed customer deployments.",
    path: "/blueprints",
};

export const metadata: Metadata = buildMetadata({
    title: "Project Blueprints for Websites, Automation & Portals in Hyderabad",
    description: PAGE.description,
    path: PAGE.path,
    keywords: [
        "business website project examples Hyderabad",
        "WhatsApp automation workflow blueprint",
        "school management portal blueprint",
        "clinic follow-up automation design",
        "custom software planning Secunderabad",
    ],
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Blueprints", path: PAGE.path },
];

const blueprints = [
    {
        number: "01",
        category: "Business website",
        title: "A website that turns visits into enquiries",
        summary:
            "A focused company website that explains services clearly and gives prospective customers a simple way to call, message or submit an enquiry.",
        flow: ["Visitor opens the website", "Reviews services and key information", "Submits an enquiry or starts a WhatsApp chat", "The business receives the enquiry"],
        includes: ["Responsive page design", "Service and contact pages", "Enquiry form with validation", "Click-to-call and WhatsApp links", "SEO foundations"],
        boundary: "Content, page count, form routing and any booking or payment features are agreed before development.",
        href: "/services#websites",
        link: "Explore website development",
    },
    {
        number: "02",
        category: "AI & workflow automation",
        title: "A lead follow-up workflow for a small team",
        summary:
            "A practical workflow for capturing incoming enquiries, assigning an owner and helping the team follow up without repeatedly copying details between tools.",
        flow: ["Enquiry arrives from an agreed channel", "Required details are captured", "Lead is assigned or routed", "Team receives an alert", "Follow-up status is recorded"],
        includes: ["Form or supported channel integration", "Lead field mapping", "WhatsApp or email acknowledgement where approved", "CRM or spreadsheet sync", "Exception and human hand-off path"],
        boundary: "WhatsApp Business access, provider approval, API availability and third-party usage charges affect what can be connected.",
        href: "/services#automations",
        link: "Explore workflow automation",
    },
    {
        number: "03",
        category: "Education portal",
        title: "A school administration portal",
        summary:
            "A role-based portal concept that brings selected student administration tasks into one place for school staff and students.",
        flow: ["Administrator creates student and staff accounts", "Staff maintain agreed student records", "Fees and attendance are recorded", "Students submit requests", "Authorised staff review and update request status"],
        includes: ["Admin, staff and student roles", "Student records", "Fee status and attendance modules", "Leave or certificate request workflow", "Basic operational reports"],
        boundary: "The first release is scoped around the school's actual processes. Parent access, online payments, examinations, transport and mobile apps are separate modules unless included in the agreement.",
        href: "/services#portals",
        link: "Explore portals and School ERP",
    },
    {
        number: "04",
        category: "Clinic workflow",
        title: "A clinic appointment and follow-up system",
        summary:
            "A workflow concept for handling appointment enquiries and routine reminders while keeping clinical decisions with authorised healthcare staff.",
        flow: ["Patient requests an appointment", "Reception confirms or updates the booking", "System sends approved reminders", "Staff record the visit and next follow-up date", "Unanswered or clinical questions are escalated to staff"],
        includes: ["Appointment request and status tracking", "Approved reminder templates", "Staff hand-off queue", "Patient visit and follow-up records", "Role-based access planning"],
        boundary: "Clinical advice is not automated. Patient data handling, consent, access permissions, retention and applicable compliance requirements must be reviewed before deployment.",
        href: "/services#automations",
        link: "Discuss a clinic workflow",
    },
];

function FlowSteps({ steps }: { steps: string[] }) {
    return (
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800">{index + 1}</span>
                    {step}
                </li>
            ))}
        </ol>
    );
}

export default function BlueprintsPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <main className="bg-white text-slate-900">
                <section className="border-b border-slate-200 bg-slate-50">
                    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
                        <MarketingBreadcrumbs items={breadcrumbs} />
                        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">How a project can work</p>
                        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                            See the workflow before we build it.
                        </h1>
                        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                            These blueprints show the kind of systems we can plan and build, the steps involved and where
                            human review matters. They are illustrative project concepts — not customer case studies,
                            completed deployments or performance claims.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link href={MARKETING_ROUTES.contact} className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                                Discuss a project
                            </Link>
                            <Link href={MARKETING_ROUTES.services} className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400">
                                View services
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl space-y-7 px-5 py-14 sm:px-8 sm:py-20">
                    {blueprints.map((item) => (
                        <article key={item.number} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
                                <div className="bg-slate-50 p-7 sm:p-9">
                                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-700">{item.number} · {item.category}</p>
                                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{item.title}</h2>
                                    <p className="mt-4 leading-7 text-slate-600">{item.summary}</p>
                                    <p className="mt-6 text-sm font-semibold text-slate-900">Scope boundary</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.boundary}</p>
                                    <Link href={item.href} className="mt-7 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800">
                                        {item.link}<span className="ml-2" aria-hidden="true">→</span>
                                    </Link>
                                </div>
                                <div className="p-7 sm:p-9">
                                    <h3 className="text-base font-semibold text-slate-950">Illustrative workflow</h3>
                                    <FlowSteps steps={item.flow} />
                                    <h3 className="mt-8 text-base font-semibold text-slate-950">Possible first-release scope</h3>
                                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {item.includes.map((feature) => (
                                            <li key={feature} className="flex gap-3 text-sm leading-6 text-slate-600">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="border-t border-slate-200 bg-slate-50">
                    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
                        <div className="max-w-3xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Your process is the starting point</p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">A blueprint is not a fixed product package.</h2>
                            <p className="mt-4 leading-7 text-slate-600">
                                We first understand your current tools, users, data and approval steps. Then we agree on a
                                first release, what is out of scope, delivery milestones and any ongoing provider costs.
                            </p>
                            <Link href={MARKETING_ROUTES.contact} className="mt-7 inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                                Plan your project
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
