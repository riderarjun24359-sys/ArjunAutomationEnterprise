import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import {
    COMPANY_PROFILE,
    formatAddress,
    HAS_PHONE,
    WHATSAPP_DEFAULT_MESSAGE,
    whatsappLink,
} from "@/src/config/company-profile";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Contact Arjun Automations",
    description:
        "Discuss an affordable business website, WhatsApp automation or custom software with Arjun Automations. We work with businesses across India, including towns and villages.",
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

const CONTACT_CHANNELS = [
    {
        label: "Project enquiries",
        value: COMPANY_PROFILE.emails.sales,
        href: `mailto:${COMPANY_PROFILE.emails.sales}`,
        description: "New websites, automation projects and business portals",
    },
    {
        label: "Existing projects",
        value: COMPANY_PROFILE.emails.success,
        href: `mailto:${COMPANY_PROFILE.emails.success}`,
        description: "Project coordination and handover questions",
    },
    {
        label: "Managed support",
        value: COMPANY_PROFILE.emails.support,
        href: `mailto:${COMPANY_PROFILE.emails.support}`,
        description: "Support enquiries from existing managed clients",
    },
];

const NEXT_STEPS = [
    "Share a short description of your business and the process you want to improve.",
    "We review your enquiry and aim to respond within one business day.",
    "If the requirement is a good fit, we can arrange a conversation to understand the workflow.",
    "You receive a clear scope and price before any project work begins.",
];

const WHATSAPP_URL = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);
const addressLine = formatAddress();

export default function ContactPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="Let’s talk about the work you want to improve."
                description="Tell us about your business and what you want to improve. Whether you run a village shop, trading business, clinic, school or service team, we will suggest a practical solution that fits your budget."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />

                <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                    <div className="space-y-9">
                        <section aria-labelledby="contact-direct-heading">
                            <h2 id="contact-direct-heading" className="text-xl font-semibold text-[var(--premium-fg)]">
                                Contact directly
                            </h2>
                            <div className="mt-5 flex flex-wrap gap-3">
                                {HAS_PHONE && COMPANY_PROFILE.phoneDisplay ? (
                                    <a
                                        href={`tel:${COMPANY_PROFILE.phoneE164}`}
                                        className="inline-flex items-center gap-2 rounded-full bg-[var(--dos-brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-brand-primary)]/50"
                                    >
                                        <Phone className="h-4 w-4" aria-hidden="true" />
                                        Call {COMPANY_PROFILE.phoneDisplay}
                                    </a>
                                ) : null}
                                {WHATSAPP_URL ? (
                                    <a
                                        href={WHATSAPP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-[var(--premium-border)] px-5 py-3 text-sm font-semibold text-[var(--premium-fg)] transition hover:bg-[var(--premium-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-brand-primary)]/50"
                                    >
                                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                        WhatsApp
                                    </a>
                                ) : null}
                            </div>
                        </section>

                        <section aria-labelledby="email-heading">
                            <h2 id="email-heading" className="text-xl font-semibold text-[var(--premium-fg)]">
                                Email
                            </h2>
                            <dl className="mt-4 divide-y divide-[var(--premium-border)]">
                                {CONTACT_CHANNELS.map((channel) => (
                                    <div key={channel.label} className="py-4 first:pt-0">
                                        <dt className="text-sm font-semibold text-[var(--premium-fg)]">
                                            {channel.label}
                                        </dt>
                                        <dd className="mt-1">
                                            <a
                                                href={channel.href}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary-hover)]"
                                            >
                                                <Mail className="h-4 w-4" aria-hidden="true" />
                                                {channel.value}
                                            </a>
                                            <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">
                                                {channel.description}
                                            </p>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        {(addressLine || COMPANY_PROFILE.officeHours) ? (
                            <section aria-labelledby="location-heading">
                                <h2 id="location-heading" className="text-xl font-semibold text-[var(--premium-fg)]">
                                    Location and hours
                                </h2>
                                <div className="mt-4 space-y-4 text-sm text-[var(--premium-fg-muted)]">
                                    {addressLine ? (
                                        <p className="flex items-start gap-3">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--dos-brand-primary)]" aria-hidden="true" />
                                            <span>{addressLine}</span>
                                        </p>
                                    ) : null}
                                    {COMPANY_PROFILE.officeHours ? (
                                        <p>
                                            <span className="font-semibold text-[var(--premium-fg)]">Office hours: </span>
                                            {COMPANY_PROFILE.officeHours}
                                        </p>
                                    ) : null}
                                </div>
                            </section>
                        ) : null}

                        <section aria-labelledby="next-steps-heading">
                            <h2 id="next-steps-heading" className="text-xl font-semibold text-[var(--premium-fg)]">
                                What happens after you enquire?
                            </h2>
                            <ol className="mt-5 space-y-4">
                                {NEXT_STEPS.map((step, index) => (
                                    <li key={step} className="flex gap-3 text-sm leading-6 text-[var(--premium-fg-muted)]">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--premium-bg)] text-xs font-semibold text-[var(--dos-brand-primary)]">
                                            {index + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <p className="text-sm leading-6 text-[var(--premium-fg-muted)]">
                            Want to understand the likely investment first? See our{" "}
                            <Link href={MARKETING_ROUTES.pricing} className="font-semibold text-[var(--dos-brand-primary)] hover:underline">
                                project pricing
                            </Link>
                            . You can also review the{" "}
                            <Link href={MARKETING_ROUTES.faq} className="font-semibold text-[var(--dos-brand-primary)] hover:underline">
                                frequently asked questions
                            </Link>
                            .
                        </p>
                    </div>

                    <section
                        aria-labelledby="enquiry-form-heading"
                        className="rounded-2xl border border-[var(--premium-border)] bg-white p-6 shadow-sm sm:p-8"
                    >
                        <h2 id="enquiry-form-heading" className="text-xl font-semibold text-[var(--premium-fg)]">
                            Send a project enquiry
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[var(--premium-fg-muted)]">
                            A few details are enough to start. We’ll follow up using the contact information you provide.
                        </p>
                        <div className="mt-7">
                            <LeadForm source="contact-page" submitLabel="Send enquiry" />
                        </div>
                        <p className="mt-5 text-xs leading-5 text-[var(--premium-fg-muted)]">
                            Please do not include passwords, payment details or private patient/medical records in this initial enquiry.
                            Your details are used to respond to your request as explained in our privacy notice.
                        </p>
                    </section>
                </div>
            </PremiumPageShell>
        </>
    );
}
