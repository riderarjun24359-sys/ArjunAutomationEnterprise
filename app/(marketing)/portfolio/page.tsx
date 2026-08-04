import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Portfolio",
    description: "Explore Arjun Automation portfolio — AI automation, CRM, ERP, school management, business automation, AI agents, and integrations.",
    path: "/portfolio",
});

export default function PortfolioPage() {
    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-indigo-950">Portfolio</h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        Real enterprise automation outcomes across industries and use cases.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {PORTFOLIO_ITEMS.map((item) => (
                            <Link
                                key={item.slug}
                                href={MARKETING_ROUTES.portfolioItem(item.slug)}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-700/20"
                            >
                                <span className="text-xs font-medium uppercase tracking-wider text-indigo-700">{item.category}</span>
                                <h2 className="mt-2 text-xl font-semibold text-indigo-950 group-hover:text-indigo-700">{item.title}</h2>
                                <p className="mt-2 text-sm text-slate-600">{item.tagline}</p>
                                <p className="mt-4 text-sm text-slate-500 line-clamp-3">{item.overview}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <CtaSection />
        </>
    );
}
