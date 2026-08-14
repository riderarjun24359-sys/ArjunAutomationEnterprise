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

const openings = [
    {
        title: "Senior Platform Engineer",
        location: "Remote (India)",
        type: "Full-time",
        description: "Build and extend Arjun Automation OS modules — CRM, workflow engine, integration platform, and AI worker infrastructure.",
    },
    {
        title: "Solution Architect",
        location: "Remote (Global)",
        type: "Full-time",
        description: "Lead enterprise client engagements — discovery, architecture design, integration mapping, and go-live planning.",
    },
    {
        title: "Customer Success Manager",
        location: "Remote (India)",
        type: "Full-time",
        description: "Own client onboarding, adoption, health scores, and renewal for managed support accounts.",
    },
    {
        title: "Technical Writer",
        location: "Remote",
        type: "Contract",
        description: "Create documentation, sales collateral, and training materials for platform modules and industry packs.",
    },
];

export default function CareersPage() {
    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-indigo-950">Careers</h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        Join a team building the enterprise operating system for the next generation of organizations.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-3xl px-6 lg:px-8 space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-950">Why Arjun Automation</h2>
                        <p className="mt-4 text-slate-600 leading-relaxed">
                            We are builders, operators, and partners — not just vendors. Our team works on meaningful enterprise automation challenges across restaurants, healthcare, education, retail, and professional services. You will ship production features used by real organizations, not slide decks.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-950">Open Positions</h2>
                        <div className="mt-6 space-y-4">
                            {openings.map((job) => (
                                <article key={job.title} className="rounded-2xl border border-slate-200 p-6">
                                    <h3 className="text-lg font-semibold text-indigo-950">{job.title}</h3>
                                    <p className="mt-1 text-sm text-indigo-700">{job.location} · {job.type}</p>
                                    <p className="mt-3 text-sm text-slate-600">{job.description}</p>
                                </article>
                            ))}
                        </div>
                        <p className="mt-6 text-sm text-slate-600">
                            Interested? Send your resume to{" "}
                            <a href="mailto:careers@arjunautomations.com" className="text-indigo-700 hover:text-indigo-600">
                                careers@arjunautomations.com
                            </a>{" "}
                            or{" "}
                            <Link href={MARKETING_ROUTES.contact} className="text-indigo-700 hover:text-indigo-600">
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

