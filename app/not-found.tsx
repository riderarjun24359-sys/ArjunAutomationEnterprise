import Link from "next/link";
import { MarketingLayout } from "@/src/modules/company-launch-kit/components/MarketingLayout";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

export default function NotFound() {
    return (
        <MarketingLayout>
            <div className="premium-container flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-500">404</p>
                <h1 className="mt-4 font-display text-4xl font-bold">Page not found</h1>
                <p className="mt-4 max-w-md text-[var(--premium-fg-muted)]">
                    The page you are looking for does not exist or has been moved. Let us help you find what you need.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                        href={MARKETING_ROUTES.home}
                        className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href={MARKETING_ROUTES.search}
                        className="rounded-xl border border-[var(--premium-border)] px-6 py-3 font-medium hover:bg-[var(--premium-glass)] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                    >
                        Search Site
                    </Link>
                    <Link
                        href={MARKETING_ROUTES.contact}
                        className="rounded-xl border border-[var(--premium-border)] px-6 py-3 font-medium hover:bg-[var(--premium-glass)] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </MarketingLayout>
    );
}
