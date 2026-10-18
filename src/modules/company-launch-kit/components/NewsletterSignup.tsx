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
        <div className="rounded-2xl border border-orange-200 bg-indigo-50 p-6">
            <h3 className="text-lg font-semibold text-orange-950">Stay ahead on enterprise automation</h3>
            <p className="mt-1 text-sm text-orange-500">
                Insights on AI workers, industry OS packs, and platform best practices.
            </p>
            <p className="mt-4 text-sm text-orange-500">
                We don&rsquo;t run an automated mailing list yet. Get in touch and a person will follow up.
            </p>
            <Link
                href={MARKETING_ROUTES.contact}
                className="mt-4 inline-flex rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
            >
                Contact us
            </Link>
        </div>
    );
}
