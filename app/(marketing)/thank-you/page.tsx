import type { Metadata } from "next";
import Link from "next/link";
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
        <section className="py-24">
            <div className="mx-auto max-w-xl px-6 text-center lg:px-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                    <span className="text-2xl text-indigo-700" aria-hidden="true">✓</span>
                </div>
                <h1 className="mt-6 text-3xl font-semibold text-indigo-950">Thank you for reaching out</h1>
                <p className="mt-4 text-slate-600">
                    We have received your message. A member of the Arjun Automation team aims to respond within one business day.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link href={MARKETING_ROUTES.home} className="rounded-lg bg-indigo-700 px-6 py-3 font-medium text-white hover:bg-indigo-600">
                        Back to Home
                    </Link>
                    <Link href={MARKETING_ROUTES.solutions} className="rounded-lg border border-indigo-200 px-6 py-3 font-medium text-indigo-700 hover:bg-indigo-50">
                        Explore Solutions
                    </Link>
                </div>
            </div>
        </section>
    );
}
