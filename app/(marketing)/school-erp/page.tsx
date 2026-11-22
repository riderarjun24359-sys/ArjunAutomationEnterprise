import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "School Management Software",
    description: "School management software for fees, attendance, assignments, student activities, results and parent updates.",
    path: "/school-erp",
});

const schoolWhatsApp = whatsappLink("Hi, I want a demo of the school management software.");
const demoVideo = process.env.NEXT_PUBLIC_SCHOOL_DEMO_VIDEO?.trim();

const modules = [
    "Fees and reminders",
    "Attendance with parent alerts",
    "Assignments and homework",
    "Student activity tracking for science projects, culturals and sports",
    "Results and report cards",
    "Announcements to parents",
    "Separate logins for admin, teachers and parents",
];

const steps = [
    ["1", "We listen", "We understand how your school manages students, fees and daily work."],
    ["2", "We show a demo", "You see a working sample and tell us what should change for your school."],
    ["3", "We build", "We build the features we agree on before work starts."],
    ["4", "We launch and support", "We train your staff and help on WhatsApp after launch."],
];

export default function SchoolSoftwarePage() {
    return (
        <div className="premium-container py-14 sm:py-20">
            <header className="max-w-3xl">
                <p className="text-sm font-semibold text-indigo-700">For schools and colleges</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">School management software that parents, teachers and principals actually use</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">Keep everyday school work together and share important updates with parents. We set it up around the way your school works.</p>
                {schoolWhatsApp ? <a href={schoolWhatsApp} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />Get a free school demo</a> : null}
            </header>

            <section className="mt-16" aria-labelledby="school-modules-heading">
                <h2 id="school-modules-heading" className="text-3xl font-bold text-[var(--premium-fg)]">What your school can manage</h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {modules.map((module) => <div key={module} className="flex gap-3 rounded-2xl border border-[var(--premium-border)] p-5 text-base leading-7 text-[var(--premium-fg-muted)]"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />{module}</div>)}
                </div>
            </section>

            <section className="mt-16 rounded-3xl bg-indigo-950 p-8 text-white sm:p-10" aria-labelledby="setup-heading">
                <h2 id="setup-heading" className="text-3xl font-bold">How we set it up</h2>
                <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map(([number, title, body]) => <li key={number} className="rounded-2xl border border-white/15 bg-white/5 p-5"><span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-200 font-bold text-indigo-950">{number}</span><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-indigo-100">{body}</p></li>)}
                </ol>
            </section>

            {demoVideo ? (
                <section className="mt-16" aria-labelledby="school-demo-heading">
                    <p className="text-xs font-semibold tracking-wide text-indigo-700">DEMO PROJECT</p>
                    <h2 id="school-demo-heading" className="mt-2 text-3xl font-bold text-[var(--premium-fg)]">School management demo</h2>
                    <video className="mt-6 w-full rounded-2xl border border-[var(--premium-border)]" controls preload="none">
                        <source src={demoVideo} />
                        Your browser does not support video playback.
                    </video>
                </section>
            ) : null}

            <section className="mt-16 flex flex-col gap-5 rounded-2xl border border-[var(--premium-border)] p-7 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-2xl font-bold text-[var(--premium-fg)]">Pricing depends on what your school needs.</h2><p className="mt-2 text-base text-[var(--premium-fg-muted)]">See the available plans and what is included before you decide.</p></div>
                <Link href="/pricing" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-indigo-700">View pricing <ArrowRight className="h-4 w-4" /></Link>
            </section>
        </div>
    );
}
