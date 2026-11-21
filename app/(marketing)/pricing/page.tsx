import type { Metadata } from "next";
import { CheckCircle2, MinusCircle, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "Pricing",
    description: "See pricing options for local business websites, school management software and custom projects.",
    path: "/pricing",
});

function listFromEnv(key: string): string[] {
    return (process.env[key] ?? "").split("|").map((value) => value.trim()).filter(Boolean);
}

const localPrice = process.env.NEXT_PUBLIC_LOCAL_STARTER_PRICE?.trim();
const localIncludes = listFromEnv("NEXT_PUBLIC_LOCAL_STARTER_INCLUDES");
const localExcludes = listFromEnv("NEXT_PUBLIC_LOCAL_STARTER_EXCLUDES");
const schoolPrice = process.env.NEXT_PUBLIC_SCHOOL_PACK_PRICE?.trim();
const schoolIncludes = listFromEnv("NEXT_PUBLIC_SCHOOL_PACK_INCLUDES");
const schoolExcludes = listFromEnv("NEXT_PUBLIC_SCHOOL_PACK_EXCLUDES");
const showStarter = Boolean(localPrice && localIncludes.length && localExcludes.length);
const showSchool = Boolean(schoolPrice && schoolIncludes.length && schoolExcludes.length);
const whatsapp = whatsappLink("Hi, I would like to discuss pricing for my school or business.");

function PlanCard({ title, price, includes, excludes }: { title: string; price: string; includes: string[]; excludes: string[] }) {
    return (
        <article className="flex flex-col rounded-2xl border border-[var(--premium-border)] bg-white p-6">
            <h2 className="text-xl font-bold text-[var(--premium-fg)]">{title}</h2>
            <p className="mt-3 text-2xl font-bold text-indigo-800">{price}</p>
            <div className="mt-7"><h3 className="text-sm font-semibold text-[var(--premium-fg)]">Includes</h3><ul className="mt-3 space-y-2">{includes.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--premium-fg-muted)]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-indigo-600" />{item}</li>)}</ul></div>
            <div className="mt-6"><h3 className="text-sm font-semibold text-[var(--premium-fg)]">Not included</h3><ul className="mt-3 space-y-2">{excludes.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--premium-fg-muted)]"><MinusCircle className="mt-1 h-4 w-4 shrink-0 text-slate-400" />{item}</li>)}</ul></div>
        </article>
    );
}

export default function PricingPage() {
    return (
        <div className="premium-container py-16 sm:py-20">
            <header className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold text-indigo-700">Pricing</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">Clear prices. Clear work. No surprises.</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">Tell us what you need. We will explain the work, what is included and what is not before you decide.</p>
            </header>
            <div className={showStarter && showSchool ? "mt-12 grid gap-5 lg:grid-cols-3" : "mt-12 grid gap-5 md:grid-cols-2"}>
                {showStarter ? <PlanCard title="Local Business Starter" price={`From ₹${localPrice}`} includes={localIncludes} excludes={localExcludes} /> : null}
                {showSchool ? <PlanCard title="School Management Pack" price={schoolPrice!} includes={schoolIncludes} excludes={schoolExcludes} /> : null}
                <PlanCard title="Custom Project" price="Custom quote after we understand your needs." includes={["The work listed in your written quote."]} excludes={["Any work not listed in your written quote."]} />
            </div>
            {(!showStarter || !showSchool) ? <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-[var(--premium-fg-muted)]">For a local business website or school management package, contact us for a quote. We will agree the price and the full list of included work in writing before starting.</p> : <p className="mt-8 text-center text-sm text-[var(--premium-fg-muted)]">Prices are starting points. Final price is agreed in writing before work begins.</p>}
            <div className="mt-10 text-center">{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />Ask for a quote</a> : null}</div>
        </div>
    );
}
