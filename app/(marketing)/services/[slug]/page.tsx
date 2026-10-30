import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { FaqAccordionStatic } from "@/src/modules/company-launch-kit/components/FaqAccordionStatic";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { SERVICE_ITEMS, getServiceItem } from "@/src/modules/company-launch-kit/data/services";
import { buildMetadata, buildServiceJsonLd } from "@/src/lib/seo";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return SERVICE_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const service = getServiceItem(slug);
    if (!service) return {};
    return buildMetadata({
        title: service.title,
        description: service.tagline,
        path: MARKETING_ROUTES.serviceItem(slug),
    });
}

export default async function ServiceDetailPage({ params }: Props) {
    const { slug } = await params;
    const service = getServiceItem(slug);
    if (!service) notFound();

    const path = MARKETING_ROUTES.serviceItem(slug);
    const breadcrumbs = [
        { name: "Home", path: MARKETING_ROUTES.home },
        { name: "Services", path: MARKETING_ROUTES.services },
        { name: service.title, path },
    ];

    return (
        <>
            <MarketingStructuredData
                title={service.title}
                description={service.tagline}
                path={path}
                breadcrumbs={breadcrumbs}
                extra={[buildServiceJsonLd({ name: service.title, description: service.description, path })]}
            />
            <PremiumPageShell title={service.title} description={service.tagline}>
                <MarketingBreadcrumbs items={breadcrumbs} />

                <div className="space-y-12">
                    <p className="max-w-3xl text-[var(--premium-fg-muted)] leading-relaxed">{service.description}</p>

                    <section aria-labelledby="problems-heading">
                        <h2 id="problems-heading" className="text-xl font-semibold">
                            Business problems we solve
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {service.problems.map((problem) => (
                                <li key={problem} className="flex items-start gap-3 text-[var(--premium-fg-muted)]">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--dos-brand-primary)]" aria-hidden="true" />
                                    {problem}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="solutions-heading">
                        <h2 id="solutions-heading" className="text-xl font-semibold">
                            Our solution
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {service.solutions.map((solution) => (
                                <li key={solution} className="flex items-start gap-3 text-[var(--premium-fg-muted)]">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--dos-brand-primary)]" aria-hidden="true" />
                                    {solution}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="benefits-heading">
                        <h2 id="benefits-heading" className="text-xl font-semibold">
                            Benefits
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {service.benefits.map((benefit) => (
                                <div key={benefit} className="premium-glass rounded-xl p-4 text-sm text-[var(--premium-fg-muted)]">
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="process-heading">
                        <h2 id="process-heading" className="text-xl font-semibold">
                            Delivery process
                        </h2>
                        <p className="mt-2 text-sm text-[var(--dos-brand-primary)]">Timeline: {service.timeline}</p>
                        <ol className="mt-6 space-y-4">
                            {service.process.map((step, index) => (
                                <li key={step.phase} className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--dos-brand-primary)] text-sm font-semibold text-white">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold">{step.phase}</h3>
                                        <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section aria-labelledby="tech-heading">
                        <h2 id="tech-heading" className="text-xl font-semibold">
                            Technologies
                        </h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {service.technologies.map((tech) => (
                                <span key={tech} className="rounded-full border border-[var(--premium-border)] px-3 py-1 text-sm">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="deliverables-heading">
                        <h2 id="deliverables-heading" className="text-xl font-semibold">
                            Key deliverables
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {service.deliverables.map((item) => (
                                <li key={item} className="text-sm text-[var(--premium-fg-muted)]">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <FaqAccordionStatic title="Service FAQs" items={service.faqs} />

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={MARKETING_ROUTES.contact}
                            className="rounded-xl bg-[var(--dos-brand-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--dos-brand-primary-hover)]"
                        >
                            Book Consultation
                        </Link>
                        <Link
                            href={MARKETING_ROUTES.pricing}
                            className="rounded-xl border border-[var(--premium-border)] px-6 py-3 text-sm font-semibold hover:bg-[var(--premium-glass)]"
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>
            </PremiumPageShell>
            <CtaSection title={`Ready for ${service.title}?`} primaryLabel="Start Requirement Analysis" />
        </>
    );
}
