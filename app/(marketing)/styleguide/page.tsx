import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo";
import { ArrowRight, CheckCircle2, MessageCircle, School } from "lucide-react";

export const metadata: Metadata = {
    ...buildMetadata({ title: "Style Guide", description: "Private design reference for the Arjun Automation Enterprises website.", path: "/styleguide", noIndex: true }),
    robots: { index: false, follow: false },
};

const colors = [
    ["Ink","#0F1226"],["Body","#3D4260"],["Muted","#6A6F8A"],["Primary","#4338CA"],
    ["Tint","#EEF0FF"],["Surface","#FFFFFF"],["Surface alt","#F5F6FA"],["Border","#E3E5EE"],
    ["Dark","#14124F"],["Gold","#C99A2E"],["WhatsApp","#128C4A"],["Error","#B3261E"],["Success","#15803D"],
];

export default function StyleguidePage() {
    return <div className="premium-container py-16 sm:py-20">
        <header><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">Private reference · noindex</p><h1 className="mt-3 text-4xl font-extrabold">Design system</h1><p className="mt-4 max-w-2xl leading-7">The visual tokens and reusable patterns used on the public website.</p></header>
        <section className="mt-12"><h2 className="text-2xl font-bold">Colour tokens</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{colors.map(([name,value])=><div key={name} className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3"><span className="h-12 w-12 rounded-lg border border-black/10" style={{background:value}}/><span><strong className="block">{name}</strong><small className="text-[var(--muted)]">{value}</small></span></div>)}</div></section>
        <section className="mt-12"><h2 className="text-2xl font-bold">Type styles</h2><div className="mt-5 space-y-5 rounded-2xl border border-[var(--border)] p-6"><h1 className="text-4xl font-extrabold">Heading one</h1><h2 className="text-3xl font-extrabold">Heading two</h2><h3 className="text-2xl font-bold">Heading three</h3><p className="text-lg leading-8">Body text — clear and comfortable to read.</p><p className="text-sm leading-6 text-[var(--muted)]">Small supporting text</p></div></section>
        <section className="mt-12"><h2 className="text-2xl font-bold">Buttons</h2><div className="mt-5 flex flex-wrap gap-3"><button className="min-h-12 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">Primary</button><button className="min-h-12 rounded-xl border border-[var(--border-strong)] px-6 py-3 font-semibold">Secondary</button><button className="min-h-12 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="mr-2 inline h-5 w-5"/>WhatsApp</button><button disabled className="min-h-12 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white opacity-50">Disabled</button><a href="/contact" className="inline-flex min-h-12 items-center gap-2 px-4 font-semibold text-[var(--primary)]">Link <ArrowRight className="h-4 w-4"/></a></div></section>
        <section className="mt-12"><h2 className="text-2xl font-bold">Card and icon</h2><article className="mt-5 max-w-sm rounded-2xl border border-[var(--border)] p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--tint)] text-[var(--primary)]"><School className="h-6 w-6"/></span><h3 className="mt-4 text-xl font-bold">School software</h3><p className="mt-2 leading-7">An example card layout used to present a service.</p><CheckCircle2 className="mt-4 h-5 w-5 text-[var(--success)]"/></article></section>
        <section className="mt-12"><h2 className="text-2xl font-bold">Form fields</h2><div className="mt-5 grid max-w-xl gap-4 rounded-2xl border border-[var(--border)] p-6"><label className="text-sm font-semibold">Name<input className="mt-2 min-h-12 w-full rounded-[10px] border-[1.5px] border-[var(--border-strong)] px-4" placeholder="Your name"/></label><label className="text-sm font-semibold">Message<textarea className="mt-2 w-full rounded-[10px] border-[1.5px] border-[var(--border-strong)] px-4 py-3" rows={3} placeholder="Tell us what you need"/></label></div></section>
        <section className="mt-12"><h2 className="text-2xl font-bold">Accordion</h2><details className="mt-5 max-w-xl border-y border-[var(--border)] py-5"><summary className="cursor-pointer font-semibold">How does the accordion look?</summary><p className="mt-3 leading-7">This is the expanded content.</p></details></section>
    </div>;
}
