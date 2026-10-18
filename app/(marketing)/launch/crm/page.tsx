import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "CRM Transformation Guide",
    description: "Free guide: Unified CRM implementation — from pipeline chaos to quote-to-cash with AI-first delivery.",
    path: "/launch/crm",
});

export default function LaunchCrmPage() {
    return (
        <>
            <section className="bg-orange-500 py-20 text-white">
                <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-200">Free Guide</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                        Unified CRM: Pipeline to Quote-to-Cash
                    </h1>
                    <p className="mt-6 text-lg text-orange-100">
                        Stop losing deals to inconsistent follow-up. Learn how growth-stage companies deploy enterprise CRM integrated with delivery, billing, and customer success.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-2">
                    <div className="space-y-6 text-slate-600">
                        <h2 className="text-2xl font-semibold text-orange-950">What you will learn</h2>
                        <ul className="space-y-3">
                            {[
                                "The hidden cost of CRM + project + billing tool sprawl",
                                "Pipeline management that sales teams actually adopt",
                                "Connecting CRM to delivery and finance for quote-to-cash visibility",
                                "Client portals: self-service document sharing and status tracking",
                                "Revenue forecasting boards can trust",
                                "Customer health scores that predict renewal risk",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p>
                            Based on Arjun Automation CRM deployments achieving 35% pipeline growth and 40% faster quote-to-cash cycles.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-orange-200 bg-indigo-50 p-8">
                        <h2 className="text-lg font-semibold text-orange-950">Download the guide</h2>
                        <p className="mt-2 text-sm text-slate-600">Enter your details and our team aims to send the guide within one business day.</p>
                        <div className="mt-6">
                            <LeadForm source="launch-crm" compact submitLabel="Get the Guide" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-200 py-8 text-center">
                <Link href={MARKETING_ROUTES.portfolio} className="text-sm font-medium text-orange-500 hover:text-orange-600">
                    See CRM portfolio work &rarr;
                </Link>
            </section>
        </>
    );
}
