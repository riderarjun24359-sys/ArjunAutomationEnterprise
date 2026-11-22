import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "School Software",
    description: "School management software for fees, attendance, homework, student activities, results and parent updates.",
    path: "/school-erp",
});

const whatsapp = whatsappLink("Hi, I would like to request a school software demo.");
const demoVideo = process.env.NEXT_PUBLIC_SCHOOL_DEMO_VIDEO?.trim();
const modules = [
    "Fee collection and reminders",
    "Attendance with parent alerts",
    "Assignments and homework",
    "Student activity tracking (projects, culturals, sports)",
    "Results and report cards",
    "Announcements to parents",
    "Separate logins for admin, teachers and parents",
];
const steps = [
    ["1","We listen","We learn how your school manages students, fees and daily work."],
    ["2","We show a demo","You see a working sample and tell us what should change for your school."],
    ["3","We build","We build only the features agreed in writing."],
    ["4","We launch and support","We train your staff and stay reachable on WhatsApp after launch."],
];

export default function SchoolSoftwarePage() {
    return <div className="premium-container py-16 sm:py-20">
        <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">School Software</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">School management software, built around your school.</h1><p className="mt-5 text-lg leading-8">Keep everyday school work together and share important updates with parents. We plan the modules with you, based on how your school works.</p><p className="mt-4 font-semibold">Tailored to your school.</p><Link href="/contact?type=school" className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">Request a school demo</Link></header>
        <section className="mt-16"><h2 className="text-3xl font-extrabold">What your school can manage</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map(item=><div key={item} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-white p-5 leading-7"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--primary)]"/>{item}</div>)}</div><p className="mt-5 text-sm text-[var(--muted)]">Modules are agreed in writing before work begins.</p></section>
        <section className="mt-16 bg-[var(--surface-alt)] py-12"><h2 className="text-3xl font-extrabold">How we set it up</h2><ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([n,title,body])=><li key={n} className="rounded-2xl border border-[var(--border)] bg-white p-5"><p className="font-bold text-[var(--primary)]">{n}</p><h3 className="mt-3 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6">{body}</p></li>)}</ol></section>
        {demoVideo ? <section className="mt-16"><p className="text-xs font-bold uppercase text-[var(--primary)]">Demo project</p><h2 className="mt-2 text-3xl font-extrabold">School software demo</h2><video className="mt-6 w-full rounded-2xl border border-[var(--border)]" controls preload="none"><source src={demoVideo}/>Your browser does not support video playback.</video></section> : null}
        <section className="mt-16 rounded-2xl border border-[var(--border)] p-7"><h2 className="text-2xl font-extrabold">Want to see how it could work for your school?</h2><p className="mt-3 leading-7">Tell us about your school and the tasks you want to manage. We will discuss a suitable demo.</p><Link href="/contact?type=school" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">Request a school demo</Link>{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ml-4 mt-6 inline-flex min-h-12 items-center gap-2 font-semibold text-[var(--primary)]"><MessageCircle className="h-5 w-5"/>WhatsApp</a> : null}</section>
    </div>;
}
