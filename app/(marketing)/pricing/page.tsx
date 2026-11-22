import type { Metadata } from "next";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "Pricing",
    description: "Straightforward starting prices for business websites, with custom quotes for school software and automation projects.",
    path: "/pricing",
});

const whatsapp = whatsappLink("Hi, I would like to discuss a website or software project and get a written quote.");

const plans = [
    {
        name: "Starter Website",
        price: "₹25,000",
        description: "For a small business that needs a professional online presence.",
        points: ["Mobile-friendly business website", "Core business information and service pages", "WhatsApp contact path", "Project scope confirmed before work starts"],
    },
    {
        name: "Growth Website",
        price: "₹45,000",
        description: "For a business that needs a larger website and more detailed customer journeys.",
        points: ["Expanded multi-page website", "More detailed service and enquiry sections", "Mobile-friendly layout and clear navigation", "Project scope confirmed before work starts"],
        featured: true,
    },
    {
        name: "Custom Software",
        price: "Custom quote",
        description: "For school management, dashboards, workflow automation and other custom systems.",
        points: ["Requirements review and demo discussion", "Written feature list and delivery scope", "One-time or recurring model where suitable", "Third-party and ongoing costs explained separately"],
    },
];

export default function PricingPage() {
    return (
        <div className="premium-container py-16 sm:py-20">
            <header className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold text-indigo-300">Pricing</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">Know the starting price before we talk.</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">These are starting prices for website projects. Every project gets a written scope and final quote before work begins.</p>
            </header>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
                {plans.map((plan) => (
                    <article key={plan.name} className={`flex flex-col rounded-2xl border p-6 ${plan.featured ? "border-blue-400 bg-[var(--premium-bg-elevated)] shadow-[var(--premium-accent-glow)]" : "border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]"}`}>
                        {plan.featured ? <p className="text-xs font-bold uppercase tracking-wider text-violet-300">For growing businesses</p> : null}
                        <h2 className="mt-2 text-xl font-bold text-[var(--premium-fg)]">{plan.name}</h2>
                        <p className="mt-4 text-3xl font-bold text-blue-300">{plan.price}</p>
                        <p className="mt-3 min-h-14 text-sm leading-6 text-[var(--premium-fg-muted)]">{plan.description}</p>
                        <ul className="mt-6 flex-1 space-y-3">
                            {plan.points.map((point) => <li key={point} className="flex gap-3 text-sm leading-6 text-[var(--premium-fg-muted)]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-300" />{point}</li>)}
                        </ul>
                        {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#073b1e]"><MessageCircle className="h-4 w-4" />Discuss this plan</a> : null}
                    </article>
                ))}
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--premium-fg-muted)]">Domain, hosting, paid third-party services, WhatsApp/API usage and ongoing maintenance are quoted separately where applicable. Final inclusions, exclusions, timeline and payment milestones are confirmed in writing.</p>
            <div className="mt-10 text-center">{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--premium-border)] px-6 py-3 font-semibold text-[var(--premium-fg)]">Get a project quote <MessageCircle className="h-4 w-4" /></a> : null}</div>
        </div>
    );
}
