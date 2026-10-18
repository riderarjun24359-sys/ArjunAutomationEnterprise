import type { Metadata } from "next";
import { COMPANY_PROFILE, formatAddress } from "@/src/config/company-profile";
import { buildMetadata } from "@/src/lib/seo";

const addressLine = formatAddress();

export const metadata: Metadata = buildMetadata({
    title: "Terms of Service",
    description: "Arjun Automation terms of service governing use of our website and platform services.",
    path: "/terms",
});

export default function TermsPage() {
    return (
        <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
            <h1 className="text-3xl font-semibold text-indigo-950">Terms of Service</h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: March 1, 2026</p>

            {/* Contracting party. Terms signed by an unidentifiable entity are
                unenforceable, and this is the first section a customer's
                counsel reads. Renders only configured fields. */}
            <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contracting party</h2>
                <dl className="mt-3 space-y-1.5">
                    <div className="flex flex-wrap gap-x-2">
                        <dt className="font-medium">Entity:</dt>
                        <dd>{COMPANY_PROFILE.legalName}</dd>
                    </div>
                    {addressLine ? (
                        <div className="flex flex-wrap gap-x-2">
                            <dt className="font-medium">Registered office:</dt>
                            <dd>{addressLine}</dd>
                        </div>
                    ) : null}
                    {COMPANY_PROFILE.cin ? (
                        <div className="flex flex-wrap gap-x-2">
                            <dt className="font-medium">CIN:</dt>
                            <dd>{COMPANY_PROFILE.cin}</dd>
                        </div>
                    ) : null}
                    {COMPANY_PROFILE.gstin ? (
                        <div className="flex flex-wrap gap-x-2">
                            <dt className="font-medium">GSTIN:</dt>
                            <dd>{COMPANY_PROFILE.gstin}</dd>
                        </div>
                    ) : null}
                </dl>
            </section>

            <section className="mt-8 space-y-6 text-slate-600">
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">1. Agreement</h2>
                    <p className="mt-2 leading-relaxed">
                        By accessing the {COMPANY_PROFILE.legalName} website or using our services, you agree to these
                        Terms of Service. If you do not agree, do not use our services.
                    </p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">2. Services</h2>
                    <p className="mt-2 leading-relaxed">Arjun Automation provides enterprise automation platform implementation, consulting, and managed support services. Specific scope, timelines, and pricing are defined in individual client agreements.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">3. Intellectual Property</h2>
                    <p className="mt-2 leading-relaxed">Arjun Automation OS, its modules, AI workers, industry packs, documentation, and branding are proprietary to Arjun Automation. Client-specific configurations and data remain the property of the client.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">4. Acceptable Use</h2>
                    <p className="mt-2 leading-relaxed">You may not use our platform or services for unlawful purposes, to transmit malware, to attempt unauthorized access, or to interfere with platform operations.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">5. Limitation of Liability</h2>
                    <p className="mt-2 leading-relaxed">To the maximum extent permitted by law, Arjun Automation shall not be liable for indirect, incidental, or consequential damages. Our total liability is limited to fees paid in the twelve months preceding the claim.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">6. Governing Law</h2>
                    <p className="mt-2 leading-relaxed">These terms are governed by the laws of India. Disputes shall be resolved through good-faith negotiation, followed by binding arbitration if necessary.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">7. Contact</h2>
                    <p className="mt-2 leading-relaxed">Questions about these terms: sales@arjunautomations.com</p>
                </div>
            </section>
        </article>
    );
}

