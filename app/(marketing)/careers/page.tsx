import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Careers",
    description: "Join Arjun Automation — build enterprise automation, AI workers, and industry OS packs that transform how organizations operate.",
    path: "/careers",
});

/**
 * No open positions are listed right now.
 *
 * An earlier version showed four generic template roles (Senior Platform
 * Engineer, Solution Architect, Customer Success Manager, Technical Writer)
 * that were placeholders rather than real, currently-open reqs. Listing roles
 * we are not actually hiring for misleads candidates, so the section now
 * states honestly that there are no open positions and points visitors to the
 * general contact path instead. When a genuine opening exists, add it back as
 * data and render it from that list.
 */
const openings: Array<{
    title: string;
    location: string;
    type: string;
    description: string;
}> = [];

export default function CareersPage() {
    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-orange-950">Careers</h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        Join a team building the enterprise operating system for the next generation of organizations.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-3xl px-6 lg:px-8 space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-orange-950">Why Arjun Automation</h2>
                        <p className="mt-4 text-slate-600 leading-relaxed">
                            We are builders, operators, and partners — not just vendors. Our team works on meaningful enterprise automation challenges across restaurants, healthcare, education, retail, and professional services. You will ship production features used by real organizations, not slide decks.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-950">Open Positions</h2>
                        {openings.length > 0 ? (
                            <div className="mt-6 space-y-4">
                                {openings.map((job) => (
                                    <article key={job.title} className="rounded-2xl border border-slate-200 p-6">
                                        <h3 className="text-lg font-semibold text-orange-950">{job.title}</h3>
                                        <p className="mt-1 text-sm text-orange-500">{job.location} · {job.type}</p>
                                        <p className="mt-3 text-sm text-slate-600">{job.description}</p>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-slate-200 p-6">
                                <p className="text-slate-600 leading-relaxed">
                                    We don&rsquo;t have any open positions at the moment. Please check back later — we post
                                    here as soon as a role opens up.
                                </p>
                            </div>
                        )}
                        <p className="mt-6 text-sm text-slate-600">
                            Think you&rsquo;d add something exceptional to the team even without an open role? Introduce
                            yourself at{" "}
                            <a href="mailto:careers@arjunautomations.com" className="text-orange-500 hover:text-orange-600">
                                careers@arjunautomations.com
                            </a>{" "}
                            or{" "}
                            <Link href={MARKETING_ROUTES.contact} className="text-orange-500 hover:text-orange-600">
                                contact us
                            </Link>.
                        </p>
                    </div>
                </div>
            </section>

            <CtaSection title="Build with us" description="Even if you do not see a matching role, we welcome exceptional talent. Reach out and tell us what you would build." primaryLabel="Get in Touch" />
        </>
    );
}

