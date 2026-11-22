import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, FileText, School, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Services",
    description: "Custom software, AI automation and business systems for schools, retailers, clinics and growing businesses.",
    path: "/services",
});

const sections = [
    {
        id: "automation", icon: MessageCircle, title: "AI and Workflow Automation",
        audience: "Schools, shops, clinics and service businesses that repeat the same admin work every day.",
        builds: ["Appointment and fee reminders","Approval requests and updates","Regular reports from business records","Repeated data entry between tools","Customer enquiry follow-ups","WhatsApp messages where they help"],
        needs: ["A few examples of the work you repeat","The tools and records you already use","Who checks or approves each step"],
        delivery: "We learn the current process, show a working sample, agree on the exact tasks in writing, then build and explain it to your team.",
    },
    {
        id: "software", icon: FileText, title: "Custom Software and Web Apps",
        audience: "Organisations that need a website, portal or app shaped around the way they work.",
        builds: ["Business websites","Customer and staff portals","Online forms and enquiry pages","Booking and request pages","Customer records and billing screens","English and Telugu pages where needed"],
        needs: ["What visitors or staff need to do","The information each page should show","Any existing forms, sheets or records to use"],
        delivery: "We agree the pages and features first, share a working demo, then build and review the result with you.",
    },
    {
        id: "systems", icon: School, title: "Business Systems",
        audience: "Schools, colleges, retailers, supermarkets, clinics and growing service businesses.",
        builds: ["School and college management","Student, parent and staff records","Fees, billing and payment records","Attendance, results and announcements","Customer details and purchase records","Business portals for daily tasks"],
        needs: ["The people who will use the system","The records and tasks you need to manage","The modules that matter first"],
        delivery: "We plan the modules with you, agree the scope in writing, build the agreed parts, and help your team learn to use them.",
    },
];

export default function ServicesPage() {
    return <div className="premium-container py-16 sm:py-20">
        <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">Services</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Useful software for the work you do every day.</h1><p className="mt-5 text-lg leading-8">We build around the way your school or business works. We explain the work in simple language and agree on the scope before starting.</p></header>
        {sections.map(({id,icon:Icon,title,audience,builds,needs,delivery})=><section id={id} key={id} className="scroll-mt-24 border-b border-[var(--border)] py-14 sm:py-16"><div className="grid gap-9 lg:grid-cols-[.85fr_1.15fr]"><div><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--tint)] text-[var(--primary)]"><Icon className="h-6 w-6"/></span><h2 className="mt-5 text-3xl font-extrabold">{title}</h2><p className="mt-4 leading-7"><strong>Who it is for:</strong> {audience}</p><p className="mt-5 leading-7"><strong>How we deliver it:</strong> {delivery}</p><Link href="/contact" className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">Talk about your project</Link></div><div className="grid gap-7 sm:grid-cols-2"><div><h3 className="text-lg font-bold">What we build</h3><ul className="mt-4 space-y-3">{builds.map(item=><li key={item} className="flex gap-3 leading-7"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--primary)]"/>{item}</li>)}</ul></div><div><h3 className="text-lg font-bold">What we need from you</h3><ul className="mt-4 list-disc space-y-3 pl-5 leading-7">{needs.map(item=><li key={item}>{item}</li>)}</ul></div></div></div></section>)}
    </div>;
}
