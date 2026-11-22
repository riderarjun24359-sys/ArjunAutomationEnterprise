import type { Metadata } from "next";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "Demo Projects",
    description: "Explore working demo projects from Arjun Automation Enterprises.",
    path: "/demos",
});

const supermarket = process.env.NEXT_PUBLIC_DEMO_LINK_SUPERMARKET?.trim();
const school = process.env.NEXT_PUBLIC_DEMO_LINK_SCHOOL?.trim();
const whatsapp = whatsappLink("Hi, I would like to see a working demo.");

export default function DemosPage() {
    const hasDemos = Boolean(supermarket || school);
    return <div className="premium-container py-16 sm:py-20">
        <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">Demo projects</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">See what we can build.</h1>
            <p className="mt-5 text-lg leading-8">These are demo projects built to show what is possible. Yours is built around your needs.</p>
        </header>
        {hasDemos ? <div className="mt-10 grid gap-5 md:grid-cols-2">
            {supermarket ? <article className="rounded-2xl border border-[var(--border)] bg-white p-7"><p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Demo project</p><h2 className="mt-3 text-2xl font-bold">Sri Sai Supermarket ordering demo</h2><p className="mt-3 leading-7">A working demo showing an online ordering experience for a supermarket.</p><a href={supermarket} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--primary)]">Open demo <ArrowUpRight className="h-4 w-4"/></a></article> : null}
            {school ? <article className="rounded-2xl border border-[var(--border)] bg-white p-7"><p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Demo project</p><h2 className="mt-3 text-2xl font-bold">School management demo</h2><p className="mt-3 leading-7">A working demo showing how school records and daily tasks can be organised.</p><a href={school} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--primary)]">Open demo <ArrowUpRight className="h-4 w-4"/></a></article> : null}
        </div> : <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-8"><h2 className="text-2xl font-bold">Demos are being prepared.</h2><p className="mt-3 leading-7">Message us and we will show you a working sample.</p>{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>Chat on WhatsApp</a> : null}</div>}
    </div>;
}
