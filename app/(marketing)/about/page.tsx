import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "About",
    description: "Learn how Arjun Automation Enterprises works with schools and growing businesses.",
    path: "/about",
});

const founderName = process.env.NEXT_PUBLIC_FOUNDER_NAME?.trim();
const founderPhoto = process.env.NEXT_PUBLIC_FOUNDER_PHOTO?.trim();
const founderStory = process.env.NEXT_PUBLIC_FOUNDER_STORY?.trim();

export default function AboutPage() {
    const founderVisible = Boolean(founderName && founderPhoto && founderStory);
    return <div className="premium-container py-16 sm:py-20">
        <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">About</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">A real person, doing the work with you.</h1><p className="mt-5 text-lg leading-8">Arjun Automation Enterprises is a solo-founder company building custom software, AI automation and business systems for organisations in Andhra Pradesh and Telangana.</p></header>
        {founderVisible ? <section className="mt-12 grid gap-8 rounded-2xl border border-[var(--border)] p-7 sm:grid-cols-[220px_1fr] sm:items-center"><Image src={founderPhoto!} alt={`Photo of ${founderName}`} width={220} height={240} className="h-60 w-full rounded-2xl object-cover sm:w-[220px]"/><div><p className="text-sm font-semibold text-[var(--primary)]">Meet the founder</p><h2 className="mt-2 text-3xl font-extrabold">{founderName}</h2><p className="mt-4 leading-7">{founderStory}</p></div></section> : null}
        <section className="mt-16"><h2 className="text-3xl font-extrabold">How I work</h2><div className="mt-7 grid gap-5 md:grid-cols-3">{[["I show a demo first","You can see a working sample before you decide."],["I explain in simple language","I explain the work in simple Telugu or English."],["I stay reachable on WhatsApp","You can contact the person building your project directly."]].map(([title,body])=><article key={title} className="rounded-2xl border border-[var(--border)] p-6"><CheckCircle2 className="h-6 w-6 text-[var(--primary)]"/><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-2 leading-7">{body}</p></article>)}</div></section>
        <section className="mt-14 rounded-2xl bg-[var(--surface-alt)] p-7"><h2 className="text-2xl font-extrabold">Where we work</h2><p className="mt-3 leading-7">Serving Andhra Pradesh and Telangana.</p></section>
        <Link href="/contact" className="mt-9 inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">Talk about your project</Link>
    </div>;
}
