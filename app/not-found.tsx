import Link from "next/link";
import { MarketingLayout } from "@/src/modules/company-launch-kit/components/MarketingLayout";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

export default function NotFound() {
    return (
        <MarketingLayout>
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-700">404</p>
                <h1 className="mt-4 text-4xl font-semibold text-indigo-950">Page not found</h1>
                <p className="mt-4 max-w-md text-slate-600">
                    The page you are looking for does not exist or has been moved. Let us help you find what you need.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                        href={MARKETING_ROUTES.home}
                        className="rounded-lg bg-indigo-700 px-6 py-3 font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700/20"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href={MARKETING_ROUTES.contact}
                        className="rounded-lg border border-indigo-200 px-6 py-3 font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-700/20"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </MarketingLayout>
    );
}
