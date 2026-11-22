import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Terms",
    description: "Terms for using the Arjun Automation Enterprises website and requesting custom software services.",
    path: "/terms",
});

export default function TermsPage() {
    return <article className="premium-container max-w-3xl py-16 sm:py-20">
        <h1 className="text-4xl font-extrabold">Terms</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Last updated: 22 November 2026</p>
        <section className="mt-8 space-y-4 leading-7">
            <h2 className="text-2xl font-bold">Website information</h2>
            <p>This website describes custom software, AI automation and business systems offered by Arjun Automation Enterprises. Information on the site is general and is not a project proposal.</p>
            <h2 className="text-2xl font-bold">Project scope and payment</h2>
            <p>Before work begins, the project features, price, payment stages, delivery plan and any ongoing service costs must be agreed in writing. A discussion or demo does not by itself create a project agreement.</p>
            <h2 className="text-2xl font-bold">Your materials</h2>
            <p>You are responsible for having permission to share the text, images, records and other materials you provide for a project.</p>
            <h2 className="text-2xl font-bold">Contact</h2>
            <p>For questions about these terms, email sales@arjunautomations.com or call +91 73370 27357.</p>
        </section>
    </article>;
}
