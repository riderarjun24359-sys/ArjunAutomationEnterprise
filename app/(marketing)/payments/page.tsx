import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

/**
 * Payments — how clients pay us, in plain honest terms.
 *
 * WHY: our commercial ledger rules (src/lib/commercial-ledger.ts) forbid
 * advertising a payment method that is not actually configured. No gateway
 * account is published on this page: settlement accounts are issued per
 * invoice through regulated partners, and every payment is verified by a
 * human against provider evidence before revenue is recorded.
 */

const PAGE = {
    title: "Payments",
    description: "How to pay Arjun Automation Enterprise — INR and international bank/settlement transfer options issued per invoice.",
    path: MARKETING_ROUTES.payments,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Payments", path: PAGE.path },
];

const methods = [
    {
        title: "Indian clients — INR",
        body: [
            "UPI or direct bank transfer in Indian Rupees. Account details are issued on your proforma invoice; never through pop-ups or unverified pages.",
        ],
    },
    {
        title: "International clients — USD / EUR / GBP",
        body: [
            "We receive international transfers through RBI-authorised settlement partners (virtual account details in your currency are printed on the proforma invoice). Funds settle to our Indian bank account with an e-FIRA proof issued per transfer.",
            "Export of software and IT services is zero-rated under GST (Letter of Undertaking); nothing extra is added to your invoice for GST when the LUT pathway applies.",
        ],
    },
] as const;

export default function PaymentsPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell
                title={PAGE.title}
                description="Straightforward, invoice-first billing for Indian and international clients. No hidden markups, no card-storage surprises."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="mx-auto mt-10 max-w-3xl space-y-8 text-[var(--premium-fg-muted)] leading-relaxed">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {methods.map((m) => (
                            <div key={m.title} className="rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] p-6">
                                <h2 className="text-sm font-semibold text-[var(--premium-fg)]">{m.title}</h2>
                                {m.body.map((paragraph: string) => (
                                    <p key={paragraph.slice(0, 24)} className="mt-3 text-sm">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-[var(--premium-fg)]">How billing works</h2>
                        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
                            <li>
                                We issue a <strong>proforma invoice</strong> (reference <code>AAE-YYYYMM-###</code>) after scope is agreed. It lists amount, currency, due date and the exact payment instructions for your region.
                            </li>
                            <li>
                                You pay by bank/UPI/settlement transfer, quoting the invoice reference.
                            </li>
                            <li>
                                Our team verifies the credit against the provider statement before recording it. An invoice counts as paid only when amount, currency and reference all match.
                            </li>
                        </ol>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-[var(--premium-fg)]">Honest billing notes</h2>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>One currency per invoice — we never mix ₹ and foreign currency on the same document.</li>
                            <li>Bank/settlement charges, where they apply to the sender&apos;s side, are shown on the invoice — never hidden inside the price.</li>
                            <li>A payment link is only issued when a verified provider is actually configured; today payments are confirmed manually on credit.</li>
                        </ul>
                    </div>

                    <p>
                        Need a proforma? <Link className="underline" href={MARKETING_ROUTES.contact}>Contact sales</Link> or see our <Link className="underline" href={MARKETING_ROUTES.refund}>Refund Policy</Link> and <Link className="underline" href={MARKETING_ROUTES.terms}>Terms of Service</Link>.
                    </p>
                </div>
            </PremiumPageShell>
            <CtaSection title="Ready to start?" description="Request a proforma invoice with the exact payment instructions for your country." />
        </>
    );
}
