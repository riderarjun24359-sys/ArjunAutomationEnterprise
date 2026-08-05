import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Contact",
    description: "Contact Arjun Automation for sales, partnerships, and customer success. We respond within one business day.",
    path: MARKETING_ROUTES.contact,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Contact", path: PAGE.path },
];

const CHANNELS = [
    { label: "Sales & Partnerships", value: "sales@arjunautomation.com", href: "mailto:sales@arjunautomation.com" },
    { label: "Customer Success", value: "success@arjunautomation.com", href: "mailto:success@arjunautomation.com" },
    { label: "Support (Managed Clients)", value: "support@arjunautomation.com", href: "mailto:support@arjunautomation.com" },
];

const QUALIFICATION_STEPS = [
    "Share your industry, team size, and primary operational challenge",
    "We schedule a 30-minute discovery call within one business day",
    "Receive a scoped recommendation — platform, industry pack, or consulting engagement",
    "Optional: technical discovery workshop before formal proposal",
];

export default function ContactPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell
                title="Contact Us"
                description="Schedule a discovery call or send us a message. Our team responds within one business day."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="grid gap-12 lg:grid-cols-2">
                    <div className="space-y-10">
                        <section aria-labelledby="channels-heading">
                            <h2 id="channels-heading" className="text-xl font-semibold">
                                Communication channels
                            </h2>
                            <dl className="mt-6 space-y-4">
                                {CHANNELS.map((channel) => (
                                    <div key={channel.label}>
                                        <dt className="text-sm font-medium text-indigo-700">{channel.label}</dt>
                                        <dd className="mt-1">
                                            <a href={channel.href} className="text-[var(--premium-fg-muted)] hover:text-indigo-700">
                                                {channel.value}
                                            </a>
                                        </dd>
                                    </div>
                                ))}
                                <div>
                                    <dt className="text-sm font-medium text-indigo-700">Office Hours</dt>
                                    <dd className="mt-1 text-[var(--premium-fg-muted)]">Monday – Friday, 9:00 AM – 6:00 PM IST</dd>
                                </div>
                            </dl>
                        </section>

                        <section aria-labelledby="booking-heading">
                            <h2 id="booking-heading" className="text-xl font-semibold">
                                Booking workflow
                            </h2>
                            <ol className="mt-4 space-y-3">
                                {QUALIFICATION_STEPS.map((step, index) => (
                                    <li key={step} className="flex gap-3 text-sm text-[var(--premium-fg-muted)]">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-xs font-semibold text-white">
                                            {index + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <p className="text-sm text-[var(--premium-fg-muted)]">
                            Review{" "}
                            <Link href={MARKETING_ROUTES.pricing} className="text-indigo-700 hover:text-indigo-600">
                                pricing
                            </Link>{" "}
                            and{" "}
                            <Link href={MARKETING_ROUTES.faq} className="text-indigo-700 hover:text-indigo-600">
                                FAQ
                            </Link>{" "}
                            before your call.
                        </p>
                    </div>

                    <div className="premium-glass rounded-2xl p-8">
                        <h2 className="text-lg font-semibold">Start requirement analysis</h2>
                        <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">
                            Complete the form for lead qualification. Required fields help us route your inquiry to the right team.
                        </p>
                        <div className="mt-6">
                            <LeadForm source="contact-page" />
                        </div>
                    </div>
                </div>
            </PremiumPageShell>
        </>
    );
}
