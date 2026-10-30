import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Thank You",
    description: "Thank you for contacting Arjun Automation. Our team aims to respond within one business day.",
    path: "/thank-you",
    noIndex: true,
});

export default function ThankYouPage() {
    return (
        <PremiumPageShell
            title="Thank you for reaching out"
            description="We have received your message. A member of the Arjun Automation team aims to respond within one business day."
        >
            <div className="space-y-12">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--premium-accent-soft)]">
                        <CheckCircle2 className="h-5 w-5 text-[var(--premium-accent)]" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--premium-fg)]">
                        Your message has been sent
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href={MARKETING_ROUTES.home}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--dos-brand-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href={MARKETING_ROUTES.solutions}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--dos-border-strong)] bg-transparent px-6 py-3 text-sm font-semibold text-[var(--premium-fg)] transition hover:border-[var(--premium-accent)] hover:text-[var(--premium-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                    >
                        Explore Solutions
                    </Link>
                </div>
            </div>
        </PremiumPageShell>
    );
}
