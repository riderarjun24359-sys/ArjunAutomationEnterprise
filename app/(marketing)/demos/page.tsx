import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ShoppingBasket, ArrowUpRight, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

const PAGE = {
    title: "Demo Projects",
    description: "See sample school management and WhatsApp ordering projects built by Arjun Automation Enterprises.",
    path: "/demos",
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const supermarketUrl = process.env.NEXT_PUBLIC_DEMO_LINK_SUPERMARKET?.trim();
const schoolUrl = process.env.NEXT_PUBLIC_DEMO_LINK_SCHOOL?.trim();
const whatsapp = whatsappLink("Hi, I would like to see your demo projects.");
const testimonials: { quote: string; name: string; role: string }[] = [];

export default function DemosPage() {
    return (
        <div className="premium-container py-16 sm:py-20">
            <header className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold text-[var(--dos-brand-primary)]">Demo projects</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">See what we can build for your business.</h1>
                <p className="mt-5 text-base leading-7 text-[var(--premium-fg-muted)]">These are demo projects we built to show what is possible. Your version will be built around your needs.</p>
            </header>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
                <article className="overflow-hidden rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]">
                    <div className="flex min-h-52 items-center justify-center bg-indigo-50 text-indigo-700" aria-label="Illustrative supermarket demo preview">
                        <div className="rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-sm">
                            <ShoppingBasket className="mx-auto h-12 w-12" aria-hidden="true" />
                            <p className="mt-3 font-semibold">Online order sample</p>
                            <p className="mt-1 text-sm text-slate-500">Illustrative preview, not a customer screenshot</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <p className="text-xs font-semibold tracking-wide text-[var(--dos-brand-primary)]">Demo project</p>
                        <h2 className="mt-2 text-2xl font-semibold text-[var(--premium-fg)]">Sri Sai Supermarket ordering app</h2>
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--premium-fg-muted)]">
                            <li>Browse products and categories</li>
                            <li>Add items to a shopping list</li>
                            <li>Prepare an order to send on WhatsApp</li>
                        </ul>
                        {supermarketUrl ? <a className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--dos-brand-primary)] px-5 py-3 text-sm font-semibold text-white" href={supermarketUrl} target="_blank" rel="noopener noreferrer">Open demo <ArrowUpRight className="h-4 w-4" /></a> : null}
                    </div>
                </article>
                <article className="overflow-hidden rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]">
                    <div className="flex min-h-52 items-center justify-center bg-indigo-50 text-indigo-700" aria-label="Illustrative school management demo preview">
                        <div className="rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-sm">
                            <BookOpen className="mx-auto h-12 w-12" aria-hidden="true" />
                            <p className="mt-3 font-semibold">School records sample</p>
                            <p className="mt-1 text-sm text-slate-500">Illustrative preview, not a customer screenshot</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <p className="text-xs font-semibold tracking-wide text-[var(--dos-brand-primary)]">Demo project</p>
                        <h2 className="mt-2 text-2xl font-semibold text-[var(--premium-fg)]">School management</h2>
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--premium-fg-muted)]">
                            <li>Keep student and fee records together</li>
                            <li>Record attendance and share parent updates</li>
                            <li>View results, assignments and activities</li>
                        </ul>
                        {schoolUrl ? <a className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--dos-brand-primary)] px-5 py-3 text-sm font-semibold text-white" href={schoolUrl} target="_blank" rel="noopener noreferrer">Open demo <ArrowUpRight className="h-4 w-4" /></a> : null}
                    </div>
                </article>
            </div>
            {testimonials.length > 0 ? (
                <section className="mt-14" aria-labelledby="testimonials-heading">
                    <h2 id="testimonials-heading" className="text-2xl font-bold text-[var(--premium-fg)]">What customers say</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {testimonials.map((item) => <blockquote key={item.name} className="rounded-2xl border border-[var(--premium-border)] p-6"><p>{item.quote}</p><footer className="mt-4 text-sm text-[var(--premium-fg-muted)]">{item.name} — {item.role}</footer></blockquote>)}
                    </div>
                </section>
            ) : null}
            <div className="mt-12 text-center">
                <p className="text-base text-[var(--premium-fg-muted)]">Want to see a demo or discuss a version for your school or business?</p>
                {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-4 w-4" />Get a free demo</a> : <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--dos-brand-primary)] px-6 py-3 font-semibold text-white">Get a free demo</Link>}
            </div>
        </div>
    );
}
