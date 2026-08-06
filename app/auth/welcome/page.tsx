import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Welcome",
    description: "Welcome to Arjun Automation soft launch — continue to onboarding.",
    path: ROUTES.auth.welcome,
    noIndex: true,
});

export default function WelcomePage() {
    return (
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Welcome flow</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-slate-50">You are in</h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Your soft-launch workspace is ready. Next, complete organization setup, create a workspace, invite teammates, and finish the first project checklist.
            </p>
            <ol className="mt-8 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                <li>Organization setup wizard</li>
                <li>Workspace creation</li>
                <li>Invite team members</li>
                <li>First project checklist</li>
            </ol>
            <div className="mt-10 flex flex-wrap gap-3">
                <Link href={ROUTES.onboarding} className="rounded-full bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white">
                    Start onboarding
                </Link>
                <Link href={ROUTES.dashboard} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold">
                    Skip to dashboard
                </Link>
                <Link href={MARKETING_ROUTES.features} className="rounded-full px-5 py-2.5 text-sm font-semibold underline">
                    Explore features
                </Link>
            </div>
        </main>
    );
}
