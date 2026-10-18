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
    title: "Contact",
    description:
        "Talk to Arjun Automation about automating your operations. Call, WhatsApp or send us the details — we respond within one business day.",
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
    { label: "Sales & Partnerships", value: "sales@arjunautomations.com", href: "mailto:sales@arjunautomations.com" },
    { label: "Customer Success", value: "success@arjunautomations.com", href: "mailto:success@arjunautomations.com" },
    { label: "Support (Managed Clients)", value: "support@arjunautomations.com", href: "mailto:support@arjunautomations.com" },
];

const QUALIFICATION_STEPS = [
    "Tell us what is going wrong today — the manual work, the missed enquiries, the chasing",
    "We reply within one business day, usually with questions and an honest view on fit",
    "A 30-minute call to see whether automation is genuinely the right fix",
    "A scoped recommendation with a fixed price — or an honest 'this is not what you need'",
];

/** wa.me deep link for the contact page, or null when no number is configured. */
const WHATSAPP_URL = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);

/** Single-line registered address, omitting any part not yet configured. */
const addressLine = formatAddress();

export default function ContactPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell
                title="Contact Us"
                description="Tell us what is going wrong in your operations. We reply within one business day — and we will tell you honestly if automation is not the fix."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="grid gap-12 lg:grid-cols-2">
                    <div className="space-y-10">
                        <section aria-labelledby="channels-heading">
                            <h2 id="channels-heading" className="text-xl font-semibold">
                                Talk to us
                            </h2>

                            {/* Fastest routes first. Call and WhatsApp appear only
                                once a real number is configured. */}
                            <div className="mt-6 flex flex-wrap gap-3">
                                {HAS_PHONE && COMPANY_PROFILE.phoneDisplay ? (
                                    <a
                                        href={`tel:${COMPANY_PROFILE.phoneE164}`}
                                        className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                                    >
                                        <Phone className="h-4 w-4" aria-hidden="true" />
                                        {COMPANY_PROFILE.phoneDisplay}
                                    </a>
                                ) : null}

                                {WHATSAPP_URL ? (
                                    <a
                                        href={WHATSAPP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-[#25D366] px-5 py-2.5 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                                    >
                                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                        WhatsApp us
                                    </a>
                                ) : null}

                                <a
                                    href={`mailto:${COMPANY_PROFILE.emails.sales}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-[var(--premium-border)] px-5 py-2.5 text-sm font-semibold transition hover:bg-[var(--premium-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                                >
                                    <Mail className="h-4 w-4" aria-hidden="true" />
                                    Email sales
                                </a>
                            </div>

                            <dl className="mt-8 space-y-4">
                                {CHANNELS.map((channel) => (
                                    <div key={channel.label}>
                                        <dt className="text-sm font-medium text-orange-500">{channel.label}</dt>
                                        <dd className="mt-1">
                                            <a href={channel.href} className="text-[var(--premium-fg-muted)] hover:text-orange-500">
                                                {channel.value}
                                            </a>
                                        </dd>
                                    </div>
                                ))}

                                {addressLine ? (
                                    <div>
                                        <dt className="text-sm font-medium text-orange-500">Registered office</dt>
                                        <dd className="mt-1 flex items-start gap-2 text-[var(--premium-fg-muted)]">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                            <span>{addressLine}</span>
                                        </dd>
                                    </div>
                                ) : null}

                                {COMPANY_PROFILE.gstin ? (
                                    <div>
                                        <dt className="text-sm font-medium text-orange-500">GSTIN</dt>
                                        <dd className="mt-1 text-[var(--premium-fg-muted)]">{COMPANY_PROFILE.gstin}</dd>
                                    </div>
                                ) : null}

                                <div>
                                    <dt className="text-sm font-medium text-orange-500">Office hours</dt>
                                    <dd className="mt-1 text-[var(--premium-fg-muted)]">{COMPANY_PROFILE.officeHours}</dd>
                                </div>
                            </dl>
                        </section>

                        <section aria-labelledby="booking-heading">
                            <h2 id="booking-heading" className="text-xl font-semibold">
                                What happens next
                            </h2>
                            <ol className="mt-4 space-y-3">
                                {QUALIFICATION_STEPS.map((step, index) => (
                                    <li key={step} className="flex gap-3 text-sm text-[var(--premium-fg-muted)]">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
                                            {index + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <p className="text-sm text-[var(--premium-fg-muted)]">
                            Review{" "}
                            <Link href={MARKETING_ROUTES.pricing} className="text-orange-500 hover:text-orange-600">
                                pricing
                            </Link>{" "}
                            and{" "}
                            <Link href={MARKETING_ROUTES.faq} className="text-orange-500 hover:text-orange-600">
                                FAQ
                            </Link>{" "}
                            before your call.
                        </p>
                    </div>

                    <div className="premium-glass rounded-2xl p-8">
                        <h2 className="text-lg font-semibold">Send us the details</h2>
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

