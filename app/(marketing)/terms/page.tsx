import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo";

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

            <section className="mt-8 space-y-6 text-slate-600">
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">1. Agreement</h2>
                    <p className="mt-2 leading-relaxed">By accessing the Arjun Automation website or using our services, you agree to these Terms of Service. If you do not agree, do not use our services.</p>
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

