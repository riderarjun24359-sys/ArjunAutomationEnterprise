import type { Metadata } from "next";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Contact",
    description: "Contact Arjun Automation for sales, partnerships, and customer success. We respond within one business day.",
    path: "/contact",
});

export default function ContactPage() {
    return (
        <PremiumPageShell
            title="Contact Us"
            description="Schedule a discovery call or send us a message. Our team responds within one business day."
        >
            <div className="grid gap-12 lg:grid-cols-2">
                <div>
                    <h2 className="text-xl font-semibold">Get in touch</h2>
                    <dl className="mt-6 space-y-4">
                        <div>
                            <dt className="text-sm font-medium text-indigo-700 dark:text-indigo-400">Sales & Partnerships</dt>
                            <dd className="mt-1 text-[var(--premium-fg-muted)]">sales@arjunautomation.com</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-indigo-700 dark:text-indigo-400">Customer Success</dt>
                            <dd className="mt-1 text-[var(--premium-fg-muted)]">success@arjunautomation.com</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-indigo-700 dark:text-indigo-400">Support (Managed Clients)</dt>
                            <dd className="mt-1 text-[var(--premium-fg-muted)]">support@arjunautomation.com</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-indigo-700 dark:text-indigo-400">Office Hours</dt>
                            <dd className="mt-1 text-[var(--premium-fg-muted)]">Monday – Friday, 9:00 AM – 6:00 PM IST</dd>
                        </div>
                    </dl>
                </div>
                <div className="premium-glass rounded-2xl p-8">
                    <LeadForm source="contact-page" />
                </div>
            </div>
        </PremiumPageShell>
    );
}
