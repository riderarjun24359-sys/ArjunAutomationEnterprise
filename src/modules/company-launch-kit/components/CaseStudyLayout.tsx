import type { ReactNode } from "react";

export interface CaseStudyLayoutProps {
    title: string;
    industry: string;
    client: string;
    challenge: string;
    solution: string;
    results: string[];
    children?: ReactNode;
}

export function CaseStudyLayout({ title, industry, client, challenge, solution, results, children }: CaseStudyLayoutProps) {
    return (
        <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
            <header>
                <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{industry}</span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-indigo-950 sm:text-4xl">{title}</h1>
                <p className="mt-2 text-lg text-slate-600">{client}</p>
            </header>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
                <section className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold text-indigo-950">The Challenge</h2>
                        <p className="mt-3 text-slate-600 leading-relaxed">{challenge}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-indigo-950">Our Solution</h2>
                        <p className="mt-3 text-slate-600 leading-relaxed">{solution}</p>
                    </div>
                    {children}
                </section>
                <aside className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 h-fit">
                    <h2 className="text-lg font-semibold text-indigo-950">Results</h2>
                    <ul className="mt-4 space-y-3">
                        {results.map((result) => (
                            <li key={result} className="flex items-start gap-2 text-sm text-indigo-900">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-700" aria-hidden="true" />
                                {result}
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </article>
    );
}
