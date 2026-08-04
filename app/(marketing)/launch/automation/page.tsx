import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Enterprise Automation Guide",
    description: "Free guide: How mid-market organizations deploy AI-first enterprise automation without integration debt.",
    path: "/launch/automation",
});

export default function LaunchAutomationPage() {
    return (
        <>
            <section className="bg-indigo-700 py-20 text-white">
                <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-200">Free Guide</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                        AI-First Enterprise Automation
                    </h1>
                    <p className="mt-6 text-lg text-indigo-100">
                        How mid-market organizations escape tool sprawl, deploy AI workers, and reach production on a unified platform — with AI-generated first versions within hours.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-2">
                    <div className="space-y-6 text-slate-600">
                        <h2 className="text-2xl font-semibold text-indigo-950">What you will learn</h2>
                        <ul className="space-y-3">
                            {[
                                "Why 50%+ of automation projects fail — and the four patterns to avoid",
                                "Platform vs. point solution: calculating true total cost of ownership",
                                "The AI-First Delivery Policy: Requirement Analysis → Solution Generation → Expert Review → Customer Validation → Secure Production Deployment",
                                "AI workers vs. chatbots: why execution beats conversation",
                                "Industry OS packs: Restaurant, Hospital, School, and Retail acceleration",
                                "Security checklist: RLS, tenant isolation, and audit trails before go-live",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-700" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p>
                            Written by the Arjun Automation delivery team based on real enterprise implementations across restaurants, healthcare, education, retail, and professional services.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-8">
                        <h2 className="text-lg font-semibold text-indigo-950">Download the guide</h2>
                        <p className="mt-2 text-sm text-slate-600">Enter your details and our team will send the guide within one business day.</p>
                        <div className="mt-6">
                            <LeadForm source="launch-automation" compact submitLabel="Get the Guide" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-200 py-8 text-center">
                <Link href={MARKETING_ROUTES.solutions} className="text-sm font-medium text-indigo-700 hover:text-indigo-600">
                    Explore our solutions &rarr;
                </Link>
            </section>
        </>
    );
}
