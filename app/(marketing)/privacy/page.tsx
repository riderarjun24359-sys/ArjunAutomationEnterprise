import type { Metadata } from "next";
import { COMPANY_PROFILE, formatAddress, HAS_PHONE } from "@/src/config/company-profile";
import { buildMetadata } from "@/src/lib/seo";

const addressLine = formatAddress();

export const metadata: Metadata = buildMetadata({
    title: "Privacy Policy",
    description: "Arjun Automation privacy policy — how we collect, use, and protect your personal information.",
    path: "/privacy",
});

export default function PrivacyPage() {
    return (
        <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8 prose prose-slate">
            <h1 className="text-3xl font-semibold text-indigo-950">Privacy Policy</h1>
            <p className="text-sm text-slate-500">Last updated: March 1, 2026</p>

            {/* Data-controller identification.
                A privacy policy that does not name a legal entity, address or
                contact is not compliant with India's DPDP Act 2023, and it is
                the first thing a customer's procurement team checks. Renders
                only the fields that are genuinely configured. */}
            <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 not-prose">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Data controller</h2>
                <dl className="mt-3 space-y-1.5">
                    <div className="flex flex-wrap gap-x-2">
                        <dt className="font-medium">Registered entity:</dt>
                        <dd>{COMPANY_PROFILE.legalName}</dd>
                    </div>
                    {HAS_PHONE ? (
                        <div className="flex flex-wrap gap-x-2">
                            <dt className="font-medium">Phone:</dt>
                            <dd>{COMPANY_PROFILE.phoneDisplay}</dd>
                        </div>
                    ) : null}
                    {addressLine ? (
                        <div className="flex flex-wrap gap-x-2">
                            <dt className="font-medium">Address:</dt>
                            <dd>{addressLine}</dd>
                        </div>
                    ) : null}
                    {COMPANY_PROFILE.gstin ? (
                        <div className="flex flex-wrap gap-x-2">
                            <dt className="font-medium">GSTIN:</dt>
                            <dd>{COMPANY_PROFILE.gstin}</dd>
                        </div>
                    ) : null}
                    <div className="flex flex-wrap gap-x-2">
                        <dt className="font-medium">Privacy contact:</dt>
                        <dd>{COMPANY_PROFILE.emails.sales}</dd>
                    </div>
                </dl>
            </section>

            <section className="mt-8 space-y-4 text-slate-600">
                <h2 className="text-xl font-semibold text-indigo-950">1. Introduction</h2>
                <p>{COMPANY_PROFILE.legalName} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our platform, or engage our services.</p>

                <h2 className="text-xl font-semibold text-indigo-950">2. Information We Collect</h2>
                <p>We may collect personal information you provide directly, including name, email address, company name, phone number, and messages submitted through contact forms. We also collect usage data through analytics tools when you visit our website.</p>

                <h2 className="text-xl font-semibold text-indigo-950">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Respond to inquiries and provide requested information</li>
                    <li>Deliver and improve our services and platform</li>
                    <li>Send relevant communications about our products and services</li>
                    <li>Analyze website usage to improve user experience</li>
                    <li>Comply with legal obligations</li>
                </ul>

                <h2 className="text-xl font-semibold text-indigo-950">4. Data Security</h2>
                <p>We implement industry-standard security measures including encryption, access controls, and tenant isolation on our platform. Row Level Security (RLS) protects data at the database level.</p>

                <h2 className="text-xl font-semibold text-indigo-950">5. Third-Party Services</h2>
                <p>We may use third-party analytics providers (Google Analytics, Meta Pixel, LinkedIn Insight Tag) subject to their respective privacy policies. These services may collect anonymized usage data.</p>

                <h2 className="text-xl font-semibold text-indigo-950">6. Your Rights</h2>
                <p>You may request access to, correction of, or deletion of your personal data by contacting sales@arjunautomations.com. We will respond within 30 days.</p>

                <h2 className="text-xl font-semibold text-indigo-950">7. Contact</h2>
                <p>For privacy-related inquiries: sales@arjunautomations.com</p>
            </section>
        </article>
    );
}

