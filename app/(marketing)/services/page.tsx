import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { SERVICE_ITEMS } from "@/src/modules/company-launch-kit/data/services";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Services",
    description:
        "Platform implementation, industry pack deployment, AI worker integration, enterprise consulting, and managed support from Arjun Automation.",
    path: MARKETING_ROUTES.services,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Services", path: PAGE.path },
];

export default function ServicesPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell
                title="Services"
                description="AI-first delivery from requirement analysis to secure production deployment — milestone-based billing after validation."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="grid gap-8 lg:grid-cols-2">
                    {SERVICE_ITEMS.map((service) => (
                        <article key={service.slug} className="premium-glass rounded-2xl p-8">
                            <h2 className="text-xl font-semibold">
                                <Link href={MARKETING_ROUTES.serviceItem(service.slug)} className="hover:text-orange-500">
                                    {service.title}
                                </Link>
                            </h2>
                            <p className="mt-3 text-[var(--premium-fg-muted)] leading-relaxed">{service.description}</p>
                            <p className="mt-4 text-sm font-medium text-orange-500">Delivery: {service.timeline}</p>
                            <h3 className="mt-4 text-sm font-semibold">Key Deliverables</h3>
                            <ul className="mt-2 space-y-1">
                                {service.deliverables.slice(0, 4).map((d) => (
                                    <li key={d} className="flex items-center gap-2 text-sm text-[var(--premium-fg-muted)]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                                        {d}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={MARKETING_ROUTES.serviceItem(service.slug)}
                                className="mt-4 inline-block text-sm font-medium text-orange-500 hover:text-orange-600"
                            >
                                Learn more →
                            </Link>
                        </article>
                    ))}
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
