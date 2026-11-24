import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    BellRing,
    Check,
    Factory,
    GraduationCap,
    HeartPulse,
    MessageCircle,
    ShoppingBasket,
    Workflow,
    Globe,
    PanelsTopLeft,
    Sparkles,
} from "lucide-react";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { buildFaqJsonLd, buildMetadata } from "@/src/lib/seo";
import { PROJECT_PRICING } from "@/src/modules/company-launch-kit/data/pricing";
import { ParticleField } from "@/src/modules/company-launch-kit/components/premium/ui/ParticleField";

const PAGE = {
    title: "Affordable Websites, Automation & Business Software Across India",
    description:
        "Arjun Automations builds affordable websites, WhatsApp automations and simple business software for shops, traders, clinics, schools, workshops and growing businesses across India.",
    path: "/",
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    keywords: [
        "affordable website development India",
        "small business automation India",
        "village business website development",
        "WhatsApp automation for small business",
        "AI automation Hyderabad",
        "workflow automation Secunderabad",
        "custom software development Hyderabad",
        "business website development Telangana",
        "CRM and ERP development India",
    ],
});

const FAQS = [
    {
        question: "How long does a project take?",
        answer:
            "A small business website usually takes 1–2 weeks. A focused automation usually takes 1–2 weeks. A business management system usually takes 3–6 weeks depending on the agreed features.",
    },
    {
        question: "Can we validate the approach before the full build?",
        answer:
            "Where it helps reduce uncertainty, we can scope a small prototype using representative data. Its deliverables, price and limits are agreed in writing; it is not automatically included in every project. The production proposal separately defines integrations, data migration, security work, testing, training and go-live.",
    },
    {
        question: "Can you integrate with tools we already use, such as WhatsApp, Tally, Zoho or Google Workspace?",
        answer:
            "Yes, where the required product plan and access permissions provide a supported integration path. We typically use REST APIs, webhooks and custom connectors. We check API availability, provider charges and technical limits during discovery before confirming the scope.",
    },
    {
        question: "How is our business data kept secure?",
        answer:
            "The security design is agreed for each project and may include encryption in transit and at rest, role-based access control and tenant or database separation where required. We document what is implemented for your project rather than making blanket security claims.",
    },
    {
        question: "Do you provide support after launch?",
        answer:
            "Yes. A 30-day bug-fix warranty for issues within the agreed project scope is included after go-live. Ongoing hosting, monitoring, API maintenance and enhancements are available through optional monthly Managed Support plans.",
    },
];

const SERVICES = [
    {
        id: "websites",
        icon: Globe,
        title: "Custom Business Websites",
        description:
            "Fast, mobile-first, SEO-ready websites engineered to explain your services and turn visits into qualified enquiries.",
        href: "/services#websites",
        link: "Explore website development",
    },
    {
        id: "automations",
        icon: Workflow,
        title: "AI & Workflow Automations",
        description:
            "Connect WhatsApp, email, forms, spreadsheets and billing tools so follow-ups, approvals and routine reporting happen without repeated manual effort.",
        href: "/services#automations",
        link: "Explore workflow automation",
    },
    {
        id: "portals",
        icon: PanelsTopLeft,
        title: "Custom Portals & Internal Tools",
        description:
            "Replace scattered spreadsheets with a secure web app for customers, projects, attendance, billing or day-to-day team operations.",
        href: "/services#portals",
        link: "Explore portals and business tools",
    },
];

const INDUSTRIES = [
    {
        icon: Factory,
        title: "Manufacturing",
        example: "B2B enquiry-to-quotation tracking and dispatch status alerts.",
    },
    {
        icon: HeartPulse,
        title: "Healthcare Clinics",
        example: "WhatsApp appointment reminders and patient follow-up scheduling.",
    },
    {
        icon: ShoppingBasket,
        title: "Retail",
        example: "Daily sales and inventory updates across multiple branches.",
    },
    {
        icon: GraduationCap,
        title: "Schools & Trusts",
        example: "Fee reminders, attendance records and parent updates.",
    },
];

const STEPS = [
    {
        number: "01",
        title: "Free Discovery Call",
        duration: "20–30 minutes",
        description:
            "We map your manual bottlenecks and check whether automation is worth building. If a simpler process change is better, we will say so.",
    },
    {
        number: "02",
        title: "Validate the Approach",
        duration: "Prototype if useful",
        description:
            "We agree a small proof-of-concept so you can see the proposed workflow using representative data before deciding on the full production scope.",
    },
    {
        number: "03",
        title: "Production Go-Live & Support",
        duration: "Scoped delivery",
        description:
            "Once approved, we complete the agreed integrations, testing, security work, team handover and launch. Optional monthly support is available.",
    },
];

const WHATSAPP_URL =
    "https://wa.me/917337027357?text=Hi%2C%20I%20found%20Arjun%20Automation%20online.%20I'd%20like%20to%20discuss%20automating%20operations%20for%20my%20business.";

function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
            {description ? <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p> : null}
        </div>
    );
}

function WorkflowDiagram() {
    const stages = [
        { number: "01", title: "Website / WhatsApp", subtitle: "Enquiry arrives", icon: MessageCircle },
        { number: "02", title: "AI qualification", subtitle: "Sort and route", icon: Sparkles },
        { number: "03", title: "CRM / Google Sheets", subtitle: "Record is updated", icon: PanelsTopLeft },
        { number: "04", title: "Team alert + follow-up", subtitle: "Next action is clear", icon: BellRing },
    ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Example workflow</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950">From incoming enquiry to team action</h2>
                </div>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Illustrative process
                </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
                {stages.map((stage, index) => (
                    <div key={stage.number} className="contents">
                        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold tabular-nums text-slate-400">{stage.number}</span>
                                <stage.icon aria-hidden="true" className="h-5 w-5 text-blue-700" />
                            </div>
                            <p className="mt-4 text-sm font-semibold leading-snug text-slate-900">{stage.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{stage.subtitle}</p>
                        </div>
                        {index < stages.length - 1 ? (
                            <ArrowRight aria-hidden="true" className="mx-auto hidden h-5 w-5 text-blue-600 md:block" />
                        ) : null}
                        {index < stages.length - 1 ? (
                            <div className="flex justify-center md:hidden">
                                <ArrowRight aria-hidden="true" className="h-4 w-4 rotate-90 text-blue-600" />
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Possible connections:</span>
                <span>Website forms</span><span aria-hidden="true">·</span>
                <span>WhatsApp Business API</span><span aria-hidden="true">·</span>
                <span>CRM</span><span aria-hidden="true">·</span>
                <span>Google Sheets</span>
            </div>
        </div>
    );
}

export default function HomePage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={[{ name: "Home", path: PAGE.path }]}
                extra={[buildFaqJsonLd(FAQS)]}
            />

            {/* 1. Hero */}
            <section className="relative isolate overflow-hidden border-b border-slate-800 bg-[#071426] text-white">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_22%,rgba(59,130,246,0.28),transparent_42%),radial-gradient(ellipse_at_8%_92%,rgba(14,165,233,0.14),transparent_38%),linear-gradient(135deg,#071426_0%,#0b1d36_55%,#101c3b_100%)]" />
                <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-28">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-100 shadow-sm shadow-blue-950/20 sm:text-sm">
                            Hyderabad &amp; Secunderabad · AI Automation &amp; Custom Software Studio
                        </p>
                        <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-5xl lg:text-[4.15rem]">
                            Stop losing work in the gaps between your tools.
                        </h1>
                        <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                            Whether you run a shop in a village, a trading business in a town, a clinic, a school or a growing company, we make practical technology affordable. Get a professional website, WhatsApp follow-ups or simple software to manage everyday work — with clear pricing in Indian rupees.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                                Request a Free 20-Min Call <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                            </Link>
                            <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                                See Pricing
                            </Link>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/15 pt-7">
                            {["Small-business friendly pricing", "Clear INR quotations", "Direct founder support", "Serving businesses across India"].map((item) => (
                                <span key={item} className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm">
                                    <Check aria-hidden="true" className="h-4 w-4 text-cyan-300" />{item}
                                </span>
                            ))}
                        </div>
                    </div>
                    <WorkflowDiagram />
                </div>
            </section>

            {/* 2. What We Build */}
            <section className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
                    <SectionHeading
                        eyebrow="What we build"
                        title="Practical software for the work your business does every day."
                        description="Choose a focused service or combine them into one connected solution. We scope the work around your actual process."
                    />
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {SERVICES.map((service) => (
                            <article key={service.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md sm:p-7">
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
                                    <service.icon aria-hidden="true" className="h-5 w-5" />
                                </span>
                                <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-950">{service.title}</h3>
                                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{service.description}</p>
                                <Link href={service.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                                    {service.link}<ArrowRight aria-hidden="true" className="h-4 w-4" />
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. How We Work */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
                    <SectionHeading
                        eyebrow="How we work"
                        title="Understand the process before you invest in the build."
                        description="A straightforward path from the first conversation to a supported production release."
                    />
                    <ol className="mt-10 grid gap-5 md:grid-cols-3">
                        {STEPS.map((step) => (
                            <li key={step.number} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold tracking-tight text-blue-700">{step.number}</span>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{step.duration}</span>
                                </div>
                                <h3 className="mt-6 text-lg font-bold text-slate-950">{step.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* 4. Industries We Serve */}
            <section className="bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
                    <SectionHeading
                        eyebrow="Industries we serve"
                        title="Built for operations-heavy Indian businesses."
                        description="From a neighbourhood shop to a growing local company, we start with the problem you need solved — not expensive software you do not need."
                    />
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {INDUSTRIES.map((industry) => (
                            <article key={industry.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                                <industry.icon aria-hidden="true" className="h-6 w-6 text-blue-700" />
                                <h3 className="mt-4 text-base font-bold text-slate-950">{industry.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{industry.example}</p>
                            </article>
                        ))}
                    </div>
                    <p className="mt-7 text-sm text-slate-600">
                        Need a school management system?{" "}
                        <Link href="/services#portals" className="font-semibold text-blue-700 underline-offset-4 hover:underline">
                            Explore custom portals and School ERP
                        </Link>.
                    </p>
                </div>
            </section>

            {/* 5. Pricing Preview */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
                    <SectionHeading
                        eyebrow="Straightforward starting prices"
                        title="Know the starting point before the first meeting."
                        description="These are starting prices in Indian rupees. Final scope, integrations, data migration and third-party provider charges are confirmed in a written proposal."
                    />
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {PROJECT_PRICING.map((tier) => (
                            <article key={tier.id} className={`relative flex h-full flex-col rounded-2xl border p-6 ${"highlighted" in tier && tier.highlighted ? "border-blue-600 bg-blue-50/50 shadow-md" : "border-slate-200 bg-white"}`}>
                                {"highlighted" in tier && tier.highlighted ? <span className="mb-4 inline-flex w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">Most Popular</span> : <span className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{tier.qualifier}</span>}
                                <h3 className="text-lg font-bold text-slate-950">{tier.name}</h3>
                                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{tier.price}</p>
                                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">{tier.summary}</p>
                                <ul className="mt-5 flex-1 space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                                            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />{feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/contact" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:border-blue-500 hover:text-blue-700">
                                    Discuss this scope
                                </Link>
                            </article>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                            See packages, monthly support &amp; what is included <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. FAQs */}
            <section id="faq" className="scroll-mt-28 bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
                    <SectionHeading
                        eyebrow="Frequently asked questions"
                        title="Clear answers before you get started."
                    />
                    <div className="mt-9 divide-y divide-slate-200 border-y border-slate-200">
                        {FAQS.map((item, index) => (
                            <details key={item.question} className="group py-5" open={index === 0}>
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-slate-950 marker:hidden [&::-webkit-details-marker]:hidden">
                                    {item.question}
                                    <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-300 text-lg font-normal text-slate-600 transition group-open:rotate-45">+</span>
                                </summary>
                                <p className="max-w-3xl pt-4 pr-10 text-sm leading-7 text-slate-600">{item.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Final CTA */}
            <section className="bg-slate-950 py-16 text-white sm:py-20">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">Start with a conversation</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Ready to eliminate the manual work?</h2>
                        <p className="mt-4 text-base leading-7 text-slate-300">
                            Request a free consultation and we will discuss your biggest operational bottlenecks and possible next steps.
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                        <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                            Request a Free Consultation<ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                        </Link>
                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5">
                            <MessageCircle aria-hidden="true" className="h-4 w-4" />Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
