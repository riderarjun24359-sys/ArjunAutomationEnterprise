import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    Factory,
    Globe,
    GraduationCap,
    HeartPulse,
    ShoppingBag,
    Workflow,
} from "lucide-react";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { FaqAccordionStatic } from "@/src/modules/company-launch-kit/components/FaqAccordionStatic";
import { HeroSection } from "@/src/modules/company-launch-kit/components/premium/sections/HeroSection";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Arjun Automations — Smart Automations & Custom Software",
    description:
        "Scale your business with smart automations and custom software. Eliminate manual work, accelerate revenue, and run your operations on one secure, intelligent platform.",
    path: "/",
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const services = [
    {
        icon: Workflow,
        title: "AI & Workflow Automations",
        body: "Eliminate manual work and connect the tools you already run. Triggers, approvals, and AI agents move work forward — so nothing stalls in someone's inbox.",
        href: MARKETING_ROUTES.services,
    },
    {
        icon: Globe,
        title: "Custom Enterprise Websites",
        body: "Fast, secure, and built to convert. Marketing sites and web apps engineered around your brand, your funnels, and your customers.",
        href: MARKETING_ROUTES.services,
    },
    {
        icon: Building2,
        title: "Business Portals & CRM",
        body: "One home for customers, projects, and billing. Give your team and your clients a single, secure source of truth — no more scattered spreadsheets.",
        href: MARKETING_ROUTES.services,
    },
];

const processSteps = [
    {
        step: "01",
        title: "Discover & Plan",
        body: "We map your biggest bottlenecks and manual work, then agree on the outcomes that matter before a line of code is written.",
    },
    {
        step: "02",
        title: "Build & Automate",
        body: "We deploy tailored tech solutions — automations, portals, and custom software — configured around how your business actually runs.",
    },
    {
        step: "03",
        title: "Launch & Scale",
        body: "We handle go-live and stay on as your partner, with ongoing support and new capabilities as you grow.",
    },
];

const industries = [
    { icon: Factory, name: "Manufacturing" },
    { icon: HeartPulse, name: "Healthcare" },
    { icon: ShoppingBag, name: "Retail" },
    { icon: GraduationCap, name: "Education" },
];

const pricingTiers = [
    {
        name: "Starter",
        price: "Starts from ₹25,000",
        tagline: "Basic web presence",
        features: ["Custom marketing website", "Mobile-responsive design", "SEO foundations", "Contact & lead capture"],
        cta: "Request a Quote",
        highlighted: false,
    },
    {
        name: "Growth",
        price: "Starts from ₹45,000",
        tagline: "AI & automations",
        features: [
            "Everything in Starter",
            "Workflow automations",
            "AI agents & integrations",
            "CRM & customer portal",
        ],
        cta: "Request a Quote",
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "Custom quote",
        tagline: "Full ERP/CRM & dedicated support",
        features: [
            "Full ERP/CRM platform",
            "Dedicated delivery team",
            "Advanced security & governance",
            "Priority support & SLAs",
        ],
        cta: "Talk to Sales",
        highlighted: false,
    },
];

const primaryButton =
    "inline-flex w-full items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--premium-accent-glow)] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--premium-bg)] sm:w-auto bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#8b5cf6]";

/**
 * Enterprise SaaS & agency homepage.
 *
 * Every CTA points at a real public destination, the process and services
 * describe work that genuinely exists in this codebase, and no metrics,
 * client logos, or outcomes are published that cannot be verified. The
 * pricing tiers carry the indicative "starts from" ranges supplied by the
 * business owner; final quotes are always custom.
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
                {/* Hero — server-rendered with honest interface concept visual */}
                <HeroSection />

                {/* Services — 3 focused cards */}
                <section
                    className="premium-section border-b border-[var(--premium-border)]"
                    aria-labelledby="services-heading"
                >
                    <div className="premium-container">
                        <p className="premium-eyebrow">What we build</p>
                        <h2
                            id="services-heading"
                            className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            Three ways we move your business forward
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg text-[var(--premium-fg-muted)]">
                            Focused, production-grade delivery — not a bloated service menu. Pick the outcome you
                            need and we build around it.
                        </p>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="premium-card group block p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                                >
                                    <span className="premium-card-icon" aria-hidden="true">
                                        <item.icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--premium-fg-muted)]">
                                        {item.body}
                                    </p>
                                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--premium-accent)]">
                                        Learn more
                                        <ArrowRight
                                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process — 3-step timeline */}
                <section
                    className="premium-section border-b border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]"
                    aria-labelledby="process-heading"
                >
                    <div className="premium-container">
                        <p className="premium-eyebrow">How we work</p>
                        <h2
                            id="process-heading"
                            className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            From first call to launch in three steps
                        </h2>

                        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {processSteps.map((item) => (
                                <li key={item.step} className="premium-card relative p-8">
                                    <span
                                        className="premium-gradient-text font-display text-4xl font-bold tracking-tight"
                                        aria-hidden="true"
                                    >
                                        {item.step}
                                    </span>
                                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--premium-fg-muted)]">
                                        {item.body}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Industries */}
                <section
                    className="premium-section border-b border-[var(--premium-border)]"
                    aria-labelledby="industries-heading"
                >
                    <div className="premium-container">
                        <p className="premium-eyebrow">Built for modern industries</p>
                        <h2
                            id="industries-heading"
                            className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            Trusted across the sectors that keep the world running
                        </h2>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {industries.map((item) => (
                                <Link
                                    key={item.name}
                                    href={MARKETING_ROUTES.industries}
                                    className="premium-card group flex flex-col items-start gap-4 p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                                >
                                    <span className="premium-card-icon" aria-hidden="true">
                                        <item.icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="text-base font-semibold group-hover:text-[var(--premium-accent)]">
                                        {item.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>

                        <p className="mt-8 text-sm text-[var(--premium-fg-muted)]">
                            Running a school or trust?{" "}
                            <Link href={MARKETING_ROUTES.schoolErp} className="font-medium text-[var(--premium-accent)] hover:underline">
                                See the School ERP pack
                            </Link>{" "}
                            for attendance, fees, and parent communication.
                        </p>
                    </div>
                </section>

                {/* Pricing — 3 tiers */}
                <section
                    className="premium-section border-b border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]"
                    aria-labelledby="pricing-heading"
                >
                    <div className="premium-container">
                        <p className="premium-eyebrow">Pricing</p>
                        <h2
                            id="pricing-heading"
                            className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            Simple, transparent starting points
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg text-[var(--premium-fg-muted)]">
                            Every engagement is scoped to your goals, so final quotes are always custom. These
                            ranges help you know where you&rsquo;d start.
                        </p>

                        <div className="mt-12 grid gap-6 lg:grid-cols-3">
                            {pricingTiers.map((tier) => (
                                <div
                                    key={tier.name}
                                    className={`premium-card flex flex-col p-8 ${
                                        tier.highlighted ? "ring-1 ring-[var(--premium-accent)]" : ""
                                    }`}
                                >
                                    {tier.highlighted ? (
                                        <span className="mb-3 inline-flex w-fit rounded-full bg-[var(--premium-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--premium-accent)]">
                                            Most popular
                                        </span>
                                    ) : null}
                                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                                    <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">{tier.tagline}</p>
                                    <p className="mt-5 font-display text-2xl font-bold tracking-tight">
                                        {tier.price}
                                    </p>

                                    <ul className="mt-6 flex-1 space-y-3">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2.5 text-sm">
                                                <CheckCircle2
                                                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--premium-accent)]"
                                                    aria-hidden="true"
                                                />
                                                <span className="text-[var(--premium-fg-muted)]">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={MARKETING_ROUTES.contact}
                                        className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--premium-bg)] ${
                                            tier.highlighted
                                                ? "bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#8b5cf6] text-white shadow-[var(--premium-accent-glow)] hover:-translate-y-0.5"
                                                : "border border-[var(--dos-border-strong)] text-[var(--premium-fg)] hover:border-[var(--premium-accent)] hover:text-[var(--premium-accent)]"
                                        }`}
                                    >
                                        {tier.cta}
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-center text-sm text-[var(--premium-fg-muted)]">
                            Prices are indicative starting points and vary with scope.{" "}
                            <Link href={MARKETING_ROUTES.pricing} className="font-medium text-[var(--premium-accent)] hover:underline">
                                See full pricing details
                            </Link>
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section
                    className="premium-section border-b border-[var(--premium-border)]"
                    aria-label="Frequently asked questions"
                >
                    <div className="premium-container max-w-3xl">
                        <FaqAccordionStatic />
                    </div>
                </section>

                {/* Final CTA */}
                <CtaSection
                    title="Ready to eliminate the manual work?"
                    description="Book a free consultation and we will map your biggest bottlenecks together — no slideware, just a clear plan."
                    primaryLabel="Book a Free Consultation"
                    primaryHref={MARKETING_ROUTES.contact}
                    secondaryLabel="Explore Services"
                    secondaryHref={MARKETING_ROUTES.services}
                />
            </div>
        </>
    );
}
