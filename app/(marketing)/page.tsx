import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight, BookOpen, CheckCircle2, GraduationCap, MessageCircle,
    Phone, School, ShoppingBag, Globe2, CalendarCheck, ClipboardList,
} from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { COMPANY_PROFILE, HAS_PHONE, whatsappLink } from "@/src/config/company-profile";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";

const PAGE_TITLE = "Arjun Automation Enterprises | WhatsApp and School Management Software | Andhra Pradesh";
const PAGE_DESCRIPTION = "WhatsApp fee reminders, attendance alerts, online orders and school management software for schools, shops and clinics in Prakasam and Hyderabad.";

export const metadata: Metadata = buildMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/",
});

const mainWhatsApp = whatsappLink("Hi, I saw your website. I want to know more about your services.");
const schoolWhatsApp = whatsappLink("Hi, I want a demo of the school management software.");
const localStarterPrice = process.env.NEXT_PUBLIC_LOCAL_STARTER_PRICE?.trim();
const schoolPackPrice = process.env.NEXT_PUBLIC_SCHOOL_PACK_PRICE?.trim();
const customPlanEnabled = process.env.NEXT_PUBLIC_SHOW_CUSTOM_PROJECT_PLAN === "true";
const founderName = process.env.NEXT_PUBLIC_FOUNDER_NAME?.trim();
const founderPhoto = process.env.NEXT_PUBLIC_FOUNDER_PHOTO?.trim();

const faqs = [
    { question: "Do I need to understand technology?", answer: "No. We set everything up and train your staff in simple Telugu or English." },
    { question: "Can I see a demo first?", answer: "Yes. We show a working demo before you decide anything." },
    { question: "How long does a project take?", answer: "Timing depends on what you need. We give you a clear date after we understand your requirements." },
    { question: "What if something stops working?", answer: "Message us on WhatsApp. We reply within 24 hours on working days." },
    { question: "Is our data safe?", answer: "The details depend on how your system is set up. Before launch, we explain where information is stored, who can access it and what backups are in place." },
    { question: "Do you speak Telugu?", answer: "Yes. We work in Telugu and English." },
];

export default function HomePage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE_TITLE}
                description={PAGE_DESCRIPTION}
                path="/"
                breadcrumbs={[{ name: "Home", path: "/" }]}
            />
            <section className="bg-[var(--premium-bg)]">
                <div className="premium-container grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-24">
                    <div>
                        <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">Software and WhatsApp automation for schools, shops and clinics</p>
                        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-[var(--premium-fg)] sm:text-5xl lg:text-6xl">Stop chasing parents and customers. Let WhatsApp do it.</h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--premium-fg-muted)]">Fee reminders, attendance alerts, orders and enquiries go out automatically, so you can focus on growing your school or shop.</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {mainWhatsApp ? <a href={mainWhatsApp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"><MessageCircle className="h-5 w-5" />Chat on WhatsApp</a> : null}
                            <Link href="/demos" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--premium-border)] px-6 py-3 font-semibold text-[var(--premium-fg)] hover:bg-[var(--premium-bg-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]">See live demos <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[var(--premium-fg-muted)]">
                            <span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4 text-indigo-600" />Telugu and English support</span>
                            <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4 text-indigo-600" />WhatsApp-first</span>
                            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-600" />See a demo before you decide</span>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 sm:p-8">
                        <div className="rounded-2xl bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-100 text-indigo-700"><MessageCircle className="h-5 w-5" /></span>
                                <div><p className="font-semibold text-slate-900">WhatsApp updates</p><p className="text-sm text-slate-500">A simple example</p></div>
                            </div>
                            <div className="mt-5 space-y-3">
                                <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">Hello! This is a reminder that your school fee payment is due. Please contact the school office if you need help.</div>
                                <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">Thank you. I will check and pay today.</div>
                            </div>
                            <p className="mt-5 text-xs text-slate-500">Illustrative message only — not a live customer conversation.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]">
                <div className="premium-container py-10">
                    <div className="grid gap-4 text-base leading-7 text-[var(--premium-fg-muted)] md:grid-cols-3">
                        <p>Calling parents one by one for fees.</p>
                        <p>Customers ordering on WhatsApp and orders getting lost.</p>
                        <p>Appointments and enquiries written in notebooks.</p>
                    </div>
                    <p className="mt-6 text-lg font-semibold text-[var(--premium-fg)]">We fix this with systems that run by themselves.</p>
                </div>
            </section>

            <section className="premium-container py-16 sm:py-20" aria-labelledby="services-heading">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold text-indigo-700">What we build</p>
                    <h2 id="services-heading" className="mt-3 text-3xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-4xl">Practical software for everyday work.</h2>
                </div>
                <div className="mt-9 grid gap-5 md:grid-cols-3">
                    <article className="rounded-2xl border border-[var(--premium-border)] bg-white p-6">
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><GraduationCap className="h-6 w-6" /></span>
                        <h3 className="mt-5 text-xl font-semibold text-[var(--premium-fg)]">School and College Management</h3>
                        <p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">Fees, attendance, results and parent updates in one place. Parents get WhatsApp messages automatically.</p>
                        <Link className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-indigo-700" href="/services#school">Learn more <ArrowRight className="h-4 w-4" /></Link>
                    </article>
                    <article className="rounded-2xl border border-[var(--premium-border)] bg-white p-6">
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><ShoppingBag className="h-6 w-6" /></span>
                        <h3 className="mt-5 text-xl font-semibold text-[var(--premium-fg)]">WhatsApp Automation for Shops and Clinics</h3>
                        <p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">Take orders and appointments on WhatsApp. Send reminders and offers without typing each message.</p>
                        <Link className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-indigo-700" href="/services#whatsapp">Learn more <ArrowRight className="h-4 w-4" /></Link>
                    </article>
                    <article className="rounded-2xl border border-[var(--premium-border)] bg-white p-6">
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><Globe2 className="h-6 w-6" /></span>
                        <h3 className="mt-5 text-xl font-semibold text-[var(--premium-fg)]">Website for Your Business</h3>
                        <p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">A fast, simple website in English and Telugu that brings you enquiries on WhatsApp.</p>
                        <Link className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-indigo-700" href="/services#website">Learn more <ArrowRight className="h-4 w-4" /></Link>
                    </article>
                </div>
            </section>

            <section className="bg-indigo-950 text-white" aria-labelledby="school-heading">
                <div className="premium-container grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:items-center">
                    <div>
                        <p className="text-sm font-semibold text-indigo-200">For schools and colleges</p>
                        <h2 id="school-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Run your whole school from one place</h2>
                        <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                            {["Fee collection and reminders", "Daily attendance with WhatsApp alert to parents", "Assignments and homework", "Science projects, activities, culturals and sports tracking for every student", "Results and report cards", "Announcements to all parents", "Separate logins for admin, teachers and parents"].map((item) => <li key={item} className="flex gap-3 text-base leading-7 text-indigo-50"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />{item}</li>)}
                        </ul>
                        <p className="mt-7 text-lg font-medium">Tell us what your school needs. We build it for you.</p>
                        {schoolWhatsApp ? <a href={schoolWhatsApp} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />Get a free school demo</a> : null}
                    </div>
                    <div className="rounded-3xl border border-white/15 bg-white/10 p-7">
                        <div className="flex items-center gap-3"><School className="h-7 w-7 text-indigo-200" /><span className="text-lg font-semibold">School management software</span></div>
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between rounded-xl bg-white/10 p-4"><span className="flex items-center gap-3"><ClipboardList className="h-5 w-5" />Student records</span><span className="text-sm text-indigo-200">Example module</span></div>
                            <div className="flex items-center justify-between rounded-xl bg-white/10 p-4"><span className="flex items-center gap-3"><CalendarCheck className="h-5 w-5" />Attendance</span><span className="text-sm text-indigo-200">Example module</span></div>
                            <div className="flex items-center justify-between rounded-xl bg-white/10 p-4"><span className="flex items-center gap-3"><MessageCircle className="h-5 w-5" />Parent updates</span><span className="text-sm text-indigo-200">Example module</span></div>
                        </div>
                        <p className="mt-5 text-xs text-indigo-200">Illustrative preview, not a live school record.</p>
                    </div>
                </div>
            </section>

            <section className="premium-container py-16 sm:py-20">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div><p className="text-sm font-semibold text-indigo-700">See our work</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--premium-fg)]">Demo projects</h2></div>
                    <Link href="/demos" className="inline-flex min-h-11 items-center gap-2 font-semibold text-indigo-700">See all demos <ArrowRight className="h-4 w-4" /></Link>
                </div>
                <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <article className="rounded-2xl border border-[var(--premium-border)] p-6"><p className="text-xs font-semibold tracking-wide text-indigo-700">DEMO PROJECT</p><h3 className="mt-3 text-xl font-semibold text-[var(--premium-fg)]">Sri Sai Supermarket - online ordering on WhatsApp</h3><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">A sample shopping experience for browsing items, adding them to a cart and preparing an order on WhatsApp.</p></article>
                    <article className="rounded-2xl border border-[var(--premium-border)] p-6"><p className="text-xs font-semibold tracking-wide text-indigo-700">DEMO PROJECT</p><h3 className="mt-3 text-xl font-semibold text-[var(--premium-fg)]">School management demo</h3><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">A sample school system showing student records, fees, attendance and parent updates.</p></article>
                </div>
            </section>

            <section className="bg-[var(--premium-bg-secondary)]">
                <div className="premium-container py-16 sm:py-20">
                    <div className="max-w-2xl"><p className="text-sm font-semibold text-indigo-700">How we work</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-4xl">A clear process, step by step.</h2></div>
                    <ol className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            ["1", "We listen", "We understand what is slowing you down."],
                            ["2", "We show a demo", "You see a working sample before deciding."],
                            ["3", "We build", "We build only what you need."],
                            ["4", "We launch and support", "We train your staff and help on WhatsApp after launch."],
                        ].map(([number, title, body]) => <li key={number} className="rounded-2xl border border-[var(--premium-border)] bg-white p-6"><span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-800">{number}</span><h3 className="mt-5 text-lg font-semibold text-[var(--premium-fg)]">{title}</h3><p className="mt-2 text-base leading-7 text-[var(--premium-fg-muted)]">{body}</p></li>)}
                    </ol>
                </div>
            </section>

            {founderName && founderPhoto ? (
                <section className="premium-container py-16 sm:py-20">
                    <div className="grid gap-8 rounded-3xl bg-indigo-950 p-8 text-white sm:p-10 md:grid-cols-[220px_1fr] md:items-center">
                        <Image src={founderPhoto} alt={`Photo of ${founderName}`} width={220} height={240} className="h-60 w-full rounded-2xl object-cover md:w-[220px]" />
                        <div><p className="text-sm font-semibold text-indigo-200">Meet the founder</p><h2 className="mt-2 text-3xl font-bold">{founderName}</h2><p className="mt-5 text-base leading-7 text-indigo-50">I am a self-taught builder. I learned to create software because I wanted to solve real problems for people around me. I use modern AI tools and I personally handle every project, so you always talk to the person doing the work.</p></div>
                    </div>
                </section>
            ) : null}

            <section className="premium-container py-12">
                <div className="rounded-2xl border border-[var(--premium-border)] p-7 sm:p-9">
                    <p className="text-sm font-semibold text-indigo-700">Where we work</p>
                    <h2 className="mt-3 text-2xl font-bold text-[var(--premium-fg)]">Serving Giddalur, Markapuram, Cumbum and nearby towns.</h2>
                    <p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">Schools in Hyderabad can work with us online.</p>
                </div>
            </section>

            {(localStarterPrice && schoolPackPrice && customPlanEnabled) ? (
                <section className="bg-[var(--premium-bg-secondary)]">
                    <div className="premium-container py-16">
                        <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-indigo-700">Pricing</p><h2 className="mt-3 text-3xl font-bold text-[var(--premium-fg)]">Clear starting points.</h2></div><Link href="/pricing" className="font-semibold text-indigo-700">Full pricing <ArrowRight className="inline h-4 w-4" /></Link></div>
                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {[["Local Business Starter", `From ₹${localStarterPrice}`], ["School Management Pack", schoolPackPrice], ["Custom Project", "Custom quote after we understand your needs."]].map(([name, price]) => <article key={name} className="rounded-2xl border border-[var(--premium-border)] bg-white p-6"><h3 className="font-semibold text-[var(--premium-fg)]">{name}</h3><p className="mt-3 text-xl font-bold text-indigo-800">{price}</p><Link href="/pricing" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-indigo-700">See plan <ArrowRight className="h-4 w-4" /></Link></article>)}
                        </div>
                    </div>
                </section>
            ) : null}

            <section id="faq" className="premium-container py-16 sm:py-20">
                <div className="mx-auto max-w-3xl"><p className="text-sm font-semibold text-indigo-700">Frequently asked questions</p><h2 className="mt-3 text-3xl font-bold text-[var(--premium-fg)]">A few things you may want to know.</h2>
                    <div className="mt-8 divide-y divide-[var(--premium-border)] border-y border-[var(--premium-border)]">
                        {faqs.map((faq) => <details key={faq.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-[var(--premium-fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]">{faq.question}<span className="text-indigo-700 transition group-open:rotate-45">+</span></summary><p className="mt-3 pr-8 text-base leading-7 text-[var(--premium-fg-muted)]">{faq.answer}</p></details>)}
                    </div>
                </div>
            </section>

            <section className="bg-indigo-950 text-white">
                <div className="premium-container flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between sm:py-16">
                    <div><h2 className="max-w-2xl text-3xl font-bold leading-tight">Tell us what takes most of your time. We will show you how to fix it.</h2><p className="mt-3 text-indigo-200">Talk directly with the person who builds your project.</p></div>
                    <div className="flex shrink-0 flex-wrap gap-3">
                        {mainWhatsApp ? <a href={mainWhatsApp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />WhatsApp</a> : null}
                        {HAS_PHONE ? <a href={`tel:${COMPANY_PROFILE.phoneE164}`} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-5 py-3 font-semibold text-white"><Phone className="h-5 w-5" />Call {COMPANY_PROFILE.phoneDisplay}</a> : null}
                    </div>
                </div>
            </section>
        </>
    );
}
