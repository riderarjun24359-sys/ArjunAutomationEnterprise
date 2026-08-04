import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { PORTFOLIO_ITEMS, getPortfolioItem } from "@/src/modules/company-launch-kit/data/portfolio";
import { buildMetadata } from "@/src/lib/seo";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return PORTFOLIO_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const item = getPortfolioItem(slug);
    if (!item) return {};
    return buildMetadata({
        title: item.title,
        description: item.overview,
        path: `/portfolio/${slug}`,
    });
}

export default async function PortfolioDetailPage({ params }: Props) {
    const { slug } = await params;
    const item = getPortfolioItem(slug);
    if (!item) notFound();

    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <Link href={MARKETING_ROUTES.portfolio} className="text-sm font-medium text-indigo-700 hover:text-indigo-600">
                        &larr; Back to Portfolio
                    </Link>
                    <span className="mt-4 block text-xs font-medium uppercase tracking-wider text-indigo-700">{item.category}</span>
                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-indigo-950">{item.title}</h1>
                    <p className="mt-4 text-lg text-slate-600">{item.tagline}</p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-12">
                    <div>
                        <h2 className="text-xl font-semibold text-indigo-950">Overview</h2>
                        <p className="mt-3 text-slate-600 leading-relaxed">{item.overview}</p>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-950">Challenge</h2>
                            <p className="mt-3 text-slate-600 leading-relaxed">{item.challenge}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-950">Solution</h2>
                            <p className="mt-3 text-slate-600 leading-relaxed">{item.solution}</p>
                        </div>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-950">Features</h2>
                            <ul className="mt-3 space-y-2">
                                {item.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-700" aria-hidden="true" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-950">Benefits</h2>
                            <ul className="mt-3 space-y-2">
                                {item.benefits.map((b) => (
                                    <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-700" aria-hidden="true" />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-indigo-950">Results</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {item.results.map((r) => (
                                <div key={r} className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-900">
                                    {r}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-indigo-950">Screenshots</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                            {item.screenshotSlots.map((slot) => (
                                <div key={slot.path} className="rounded-xl border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center p-4">
                                    <p className="text-xs text-center text-slate-500">{slot.alt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <CtaSection />
        </>
    );
}
