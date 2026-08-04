import type { Metadata } from "next";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "About Arjun Automation",
    description:
        "Arjun Automation is an enterprise automation company building Arjun Automation OS — a unified business operating system with AI workers, industry packs, and enterprise governance.",
    path: "/about",
});

export default function AboutPage() {
    return (
        <>
            <PremiumPageShell
                title="About Arjun Automation"
                description="We exist to eliminate the false choice between speed and enterprise rigor."
            >
                <div className="mx-auto max-w-3xl space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold">Our Story</h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">
                            Arjun Automation was founded on a simple conviction: every organization deserves enterprise-grade automation without enterprise-grade complexity. Born from years of delivering large-scale digital transformation programs, we saw fragmented tools, manual handoffs, and AI bolted on as an afterthought rather than woven into the operating fabric.
                        </p>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">
                            We built Arjun Automation OS to change that. Our platform unifies CRM, projects, finance, AI workers, industry operating systems, and governance into a single composable stack. From restaurant chains to hospitals, schools to retail networks, we help organizations launch faster, operate smarter, and scale with confidence.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold">Mission</h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">
                            To democratize enterprise automation by delivering an integrated operating system that empowers every organization to run like a world-class enterprise — with AI-native workflows, industry-ready foundations, and measurable outcomes from day one.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold">Vision</h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">
                            A world where every business, regardless of size or industry, operates on intelligent automation — where humans focus on strategy and creativity while AI workers handle execution, and where launching a new digital operation takes weeks, not years.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold">Core Values</h2>
                        <ul className="mt-4 space-y-3">
                            {[
                                "Outcome Over Output — We measure success by client results, not deliverable counts.",
                                "Platform Thinking — Build once, configure many; avoid bespoke dead ends.",
                                "Security First — Tenant isolation, audit trails, and governance are non-negotiable.",
                                "Radical Clarity — Plain language, transparent pricing, honest timelines.",
                                "Continuous Evolution — Ship, learn, iterate; our platform grows with our clients.",
                                "Partnership Mindset — We succeed when our clients succeed long after go-live.",
                            ].map((value) => (
                                <li key={value} className="flex items-start gap-3 text-[var(--premium-fg-muted)]">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-700" aria-hidden="true" />
                                    {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </PremiumPageShell>

            <CtaSection title="Partner with us" description="Whether you are scaling locations, consolidating internal tools, or launching a new operation — we are ready to help." />
        </>
    );
}
