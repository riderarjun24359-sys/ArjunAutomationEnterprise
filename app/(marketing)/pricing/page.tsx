import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "How Pricing Works",
    description: "Every software project receives a written scope and quote before work begins.",
    path: "/pricing",
});

const whatsapp = whatsappLink("Hi, I would like to discuss a project and get a written quote.");

export default function PricingPage() {
    return <div className="premium-container py-16 sm:py-20">
        <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">Pricing</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Clear pricing, based on the work you need.</h1><p className="mt-5 text-lg leading-8">We understand your needs first. You receive a written quote before any work starts.</p></header>
        <section className="mt-10 grid gap-5 md:grid-cols-3">
            {[["1","Tell us","Share what you want your software or website to do."],["2","Get a written quote","We explain the work, cost and any ongoing third-party charges."],["3","Decide","Review the scope and quote. Work starts only after you agree."]].map(([n,title,body])=><article key={n} className="rounded-2xl border border-[var(--border)] bg-white p-6"><p className="text-sm font-bold text-[var(--primary)]">{n}</p><h2 className="mt-3 text-xl font-bold">{title}</h2><p className="mt-3 leading-7">{body}</p></article>)}
        </section>
        <section className="mt-14 max-w-3xl"><h2 className="text-2xl font-bold">What affects the price?</h2><ul className="mt-5 list-disc space-y-3 pl-6 leading-7"><li>Number of users and modules</li><li>Connections to other services</li><li>Moving existing records into the new system</li><li>Support needed after launch</li></ul><p className="mt-6 leading-7">You receive a written quote before any work starts. Any domain, hosting, paid service, messaging usage or ongoing support cost is explained separately where it applies.</p></section>
        <div className="mt-10 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">Talk about your project</Link>{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>WhatsApp</a> : null}</div>
    </div>;
}
