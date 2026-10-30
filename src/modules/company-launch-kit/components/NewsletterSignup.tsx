import Link from "next/link";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

/**
 * Blog sidebar call to action.
 *
 * There is no newsletter backend in this repository, so this block must not
 * imply that an address was subscribed or that a confirmation email is on its
 * way. It previously rendered a client-only form that displayed a false
 * subscription-confirmation while discarding the input — that false success
 * message has been removed and replaced with a real, working path (the
 * contact form).
 */
export function NewsletterSignup() {
    return (
        <div className="rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] p-6">
            <h3 className="text-lg font-semibold text-[var(--premium-fg)]">Stay ahead on enterprise automation</h3>
            <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">
                Insights on AI workers, industry OS packs, and platform best practices.
            </p>
            <p className="mt-4 text-sm text-[var(--premium-fg-muted)]">
                We don&rsquo;t run an automated mailing list yet. Get in touch and a person will follow up.
            </p>
            <Link
                href={MARKETING_ROUTES.contact}
                className="mt-4 inline-flex rounded-lg bg-[var(--dos-brand-primary)] px-5 py-2.5 font-medium text-white transition hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-brand-primary)]/50"
            >
                Contact us
            </Link>
        </div>
    );
}
