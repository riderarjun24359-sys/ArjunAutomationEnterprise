import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Help Center",
    description: "Get help with Arjun Automation platform setup, billing, integrations, and account management.",
    path: MARKETING_ROUTES.help,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Help Center", path: PAGE.path },
];

const HELP_TOPICS = [
    { title: "Getting Started", description: "Set up your organization, invite team members, and configure your first module." },
    { title: "CRM & Pipeline", description: "Manage clients, leads, and deals through the unified CRM module." },
    { title: "Finance & Billing", description: "Create invoices, track expenses, and manage recurring billing." },
    { title: "Task Management", description: "Organize work with kanban boards, task lists, and team assignments." },
    { title: "AI Workers", description: "Deploy and manage AI agents for requirements, architecture, QA, DevOps, and customer success." },
    { title: "Integrations", description: "Connect payment gateways, accounting systems, and third-party SaaS tools." },
];

export default function HelpPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell title="Help Center" description="Guides and answers for setting up and using Arjun Automation OS.">
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="space-y-12">
                    <section aria-labelledby="topics-heading">
                        <h2 id="topics-heading" className="text-2xl font-semibold text-[var(--premium-fg)]">Help topics</h2>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {HELP_TOPICS.map((topic) => (
                                <article key={topic.title} className="premium-glass rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-[var(--premium-fg)]">{topic.title}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{topic.description}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="contact-heading" className="premium-glass rounded-2xl p-8">
                        <h2 id="contact-heading" className="text-xl font-semibold text-[var(--premium-fg)]">Still need help?</h2>
                        <p className="mt-2 text-[var(--premium-fg-muted)]">
                            Reach out to our support team and we will respond within one business day.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={MARKETING_ROUTES.contact}
                                className="inline-flex items-center justify-center rounded-full bg-[var(--dos-brand-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--dos-brand-primary-hover)]"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </section>
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
