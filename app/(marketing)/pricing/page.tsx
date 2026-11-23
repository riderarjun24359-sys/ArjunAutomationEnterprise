import type { Metadata } from "next";
import Link from "next/link";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import {
    MANAGED_SUPPORT_PRICING,
    PROJECT_PRICING,
} from "@/src/modules/company-launch-kit/data/pricing";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Pricing",
    description:
        "Affordable starting prices for websites, WhatsApp automation and practical business software for small businesses across India.",
    path: MARKETING_ROUTES.pricing,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Pricing", path: PAGE.path },
];

export default function PricingPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="Technology that fits your business and budget."
                description="Simple starting packages for shops, traders, clinics, schools, service providers and growing businesses in cities, towns and villages. Every price is shown in Indian rupees."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />

                <div className="space-y-16">
                    <section aria-labelledby="project-pricing-heading">
                        <div className="max-w-2xl">
                            <h2 id="project-pricing-heading" className="text-2xl font-semibold text-slate-900">
                                One-time project pricing
                            </h2>
                            <p className="mt-3 text-slate-600">
                                These are affordable starting packages with a limited, clearly listed scope. Tell us what your business needs and we will suggest only what is useful — no unnecessary modules.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            {PROJECT_PRICING.map((item) => (
                                <article
                                    key={item.id}
                                    className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm sm:p-8 ${("highlighted" in item && item.highlighted) ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"}`}
                                >
                                    {("highlighted" in item && item.highlighted) ? (
                                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                                            For connected business systems
                                        </p>
                                    ) : null}
                                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.name}</h3>
                                    <p className="mt-4 text-sm text-slate-600">{item.summary}</p>
                                    <p className="mt-6 text-sm text-slate-500">{item.qualifier}</p>
                                    <p className="text-3xl font-bold tracking-tight text-slate-900">{item.price}</p>
                                    <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
                                        {item.features.map((feature) => (
                                            <li key={feature} className="flex gap-3">
                                                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={MARKETING_ROUTES.contact}
                                        className="mt-8 inline-flex w-fit items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                                    >
                                        Discuss this project
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="support-pricing-heading" className="border-t border-slate-200 pt-12">
                        <div className="max-w-2xl">
                            <h2 id="support-pricing-heading" className="text-2xl font-semibold text-slate-900">
                                Optional monthly support
                            </h2>
                            <p className="mt-3 text-slate-600">
                                Monthly support is optional. Choose it if you want help with routine updates and keeping your website or agreed workflows running.
                            </p>
                        </div>
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            {MANAGED_SUPPORT_PRICING.map((plan) => (
                                <article key={plan.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                                    <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                                    <p className="mt-4 flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                                        <span className="text-sm text-slate-500">{plan.period}</span>
                                    </p>
                                    <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex gap-3">
                                                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                        <p className="mt-5 text-sm leading-6 text-slate-500">
                            Support covers the items listed for the selected plan. New features, major changes, large content updates and work outside the agreed scope are estimated separately. Any response target or service commitment will be written into the support agreement.
                        </p>
                    </section>

                    <section aria-labelledby="included-heading" className="grid gap-8 rounded-2xl bg-slate-50 p-6 sm:p-8 lg:grid-cols-2">
                        <div>
                            <h2 id="included-heading" className="text-xl font-semibold text-slate-900">
                                What is included in a project
                            </h2>
                            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                                <li>Agreed features and deliverables documented before development</li>
                                <li>Responsive implementation for the agreed screens and devices</li>
                                <li>Review on a staging version before handover</li>
                                <li>Deployment and handover steps included in the agreed scope</li>
                                <li>30-day bug-fix warranty for delivered, in-scope functionality</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Third-party costs, if needed
                            </h2>
                            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                                <li>Domain registration, hosting, cloud infrastructure and backups</li>
                                <li>WhatsApp Business provider, SMS, email and messaging charges</li>
                                <li>AI model/API usage, storage and other usage-based services</li>
                                <li>Payment gateway charges, paid software licences and third-party subscriptions</li>
                                <li>Large data migration, new integrations and changes beyond the agreed scope</li>
                            </ul>
                        </div>
                        <p className="text-sm leading-6 text-slate-600 lg:col-span-2">
                            We will explain any domain, hosting, WhatsApp provider or usage-based charges before work begins. You can start with a simple website or workflow without paying for services your business does not need.
                        </p>
                    </section>

                    <section aria-labelledby="payment-heading" className="border-t border-slate-200 pt-12">
                        <h2 id="payment-heading" className="text-2xl font-semibold text-slate-900">
                            How project payments work
                        </h2>
                        <p className="mt-3 max-w-3xl text-slate-600">
                            A typical project can be billed in milestones: 40% to schedule and start the work, 40% after the agreed staging review, and 20% at final handover. The exact schedule is confirmed in your quotation before the project starts.
                        </p>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                            If the scope changes, we will explain the cost and timeline impact and get approval before doing the additional work.
                        </p>
                    </section>

                    <section className="rounded-2xl bg-slate-900 p-7 text-white sm:p-10">
                        <h2 className="text-2xl font-semibold">Not sure which option fits?</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                            Tell us what takes time in your business today. We can review the workflow, suggest a practical starting scope and provide a written INR quotation. There is no obligation to proceed.
                        </p>
                        <Link
                            href={MARKETING_ROUTES.contact}
                            className="mt-7 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                            Discuss your requirements
                        </Link>
                    </section>
                </div>
            </PremiumPageShell>
        </>
    );
}
