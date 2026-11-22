import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ClipboardList, Clock3, FileText, MessageCircle, Phone, School, ShoppingBag, Stethoscope } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { COMPANY_PROFILE, whatsappLink } from "@/src/config/company-profile";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";

const title = "Arjun Automation Enterprises | Custom Software and AI Automation | Andhra Pradesh";
const description = "Custom software, AI automation and business systems for schools, colleges, retailers, clinics and growing businesses in Andhra Pradesh and Telangana.";
export const metadata: Metadata = buildMetadata({ title, description, path: "/" });

const wa = whatsappLink("Hi, I would like to discuss a software or automation project.");
const schoolWa = whatsappLink("Hi, I would like to request a school software demo.");
const supermarketDemo = process.env.NEXT_PUBLIC_DEMO_LINK_SUPERMARKET?.trim();
const schoolDemo = process.env.NEXT_PUBLIC_DEMO_LINK_SCHOOL?.trim();
const founderName = process.env.NEXT_PUBLIC_FOUNDER_NAME?.trim();
const founderPhoto = process.env.NEXT_PUBLIC_FOUNDER_PHOTO?.trim();
const founderStory = process.env.NEXT_PUBLIC_FOUNDER_STORY?.trim();
const founderVisible = Boolean(founderName && founderPhoto && founderStory);
const screenshot = process.env.NEXT_PUBLIC_DEMO_SCREENSHOT?.trim();

const faqs = [
    ["Do I need to understand technology?", "No. We explain everything in simple Telugu or English and train your team."],
    ["Can I see a demo first?", "Yes. We show a working demo before you decide."],
    ["What can you build?", "Websites, web apps, portals, school and business management systems, and automations that connect the tools you already use. Tell us your process and we will advise what to build first."],
    ["How long does a project take?", "It depends on scope. We give you a date in writing after we understand your needs."],
    ["What if something stops working?", "Message us on WhatsApp or call. We will discuss the issue with you."],
    ["Do you work in Telugu?", "Yes, in Telugu and English."],
];

function SectionHeading({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
    return <header className="max-w-3xl">{eyebrow ? <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">{eyebrow}</p> : null}<h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>{text ? <p className="mt-4 text-lg leading-8">{text}</p> : null}</header>;
}

export default function HomePage() {
    return (
        <>
            <MarketingStructuredData title={title} description={description} path="/" breadcrumbs={[{ name: "Home", path: "/" }]} />
            <section className="bg-white">
                <div className="premium-container grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-24">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">Software · AI Automation · Business Systems</p>
                        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[56px]">Software that runs your business, so you can grow it.</h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8">We design and build custom software, AI automation and business systems for schools, retailers, clinics and growing companies.</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/contact" className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-hover)]">Book a consultation</Link>
                            <Link href="#what-we-build" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] px-6 py-3 font-semibold text-[var(--ink)] hover:bg-[var(--surface-alt)]">See what we build <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                        <p className="mt-6 text-sm leading-6 text-[var(--muted)]">Telugu and English · Demo before you decide · Talk directly to the person who builds it</p>
                    </div>
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] p-6 sm:p-8">
                        <svg viewBox="0 0 560 300" role="img" aria-label="Illustrative workflow connecting enquiry, records, approval, payment and report" className="h-auto w-full">
                            <path d="M64 145H496" stroke="#C9CCE0" strokeWidth="4" strokeLinecap="round" />
                            {[64,172,280,388,496].map((x,i)=><g key={x}><circle cx={x} cy="145" r="26" fill="#EEF0FF" stroke="#4338CA" strokeWidth="2"/><circle cx={x} cy="145" r="7" fill="#C99A2E"/><text x={x} y="205" textAnchor="middle" fontSize="15" fill="#0F1226">{["Enquiry","Records","Approval","Payment","Report"][i]}</text></g>)}
                        </svg>
                        <p className="mt-3 text-center text-xs text-[var(--muted)]">Illustrative workflow</p>
                    </div>
                </div>
            </section>

            <section className="bg-[var(--surface-alt)] py-16 sm:py-20">
                <div className="premium-container">
                    <SectionHeading title="Where business time quietly disappears" />
                    <div className="mt-9 grid gap-5 md:grid-cols-3">
                        {[
                            [Clock3,"Manual work repeated every day"],
                            [ClipboardList,"Information scattered across notebooks, chats and tools"],
                            [MessageCircle,"Follow-ups and enquiries that slip through"],
                        ].map(([Icon,label]) => <article key={String(label)} className="rounded-2xl border border-[var(--border)] bg-white p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--tint)] text-[var(--primary)]"><Icon className="h-6 w-6" /></span><h3 className="mt-5 text-xl font-bold">{String(label)}</h3></article>)}
                    </div>
                    <p className="mt-8 text-lg font-semibold">We replace this with systems that do the repeat work for you.</p>
                </div>
            </section>

            <section id="what-we-build" className="premium-container py-16 sm:py-20">
                <SectionHeading eyebrow="What we build" title="Three things we do well" />
                <div className="mt-9 grid gap-5 md:grid-cols-3">
                    {[
                        ["AI and Task Automation","Automate repeat work such as reminders, approvals, reports and data entry across the tools you already use.","/services#automation",MessageCircle],
                        ["Custom Software and Web Apps","Websites, portals and applications designed around your process, not a template.","/services#software",FileText],
                        ["Business Systems","School and college management, customer records, billing and portals in one organised system.","/services#systems",School],
                    ].map(([name,body,href,Icon])=><Link key={String(name)} href={String(href)} className="rounded-2xl border border-[var(--border)] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,18,38,.06)]"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--tint)] text-[var(--primary)]"><Icon className="h-6 w-6"/></span><h3 className="mt-5 text-xl font-bold">{String(name)}</h3><p className="mt-3 leading-7">{String(body)}</p><span className="mt-5 inline-flex items-center gap-2 font-semibold text-[var(--primary)]">Learn more <ArrowRight className="h-4 w-4"/></span></Link>)}
                </div>
            </section>

            <section className="bg-[var(--surface-alt)] py-16 sm:py-20">
                <div className={`premium-container grid gap-10 ${screenshot ? "lg:grid-cols-[1fr_.8fr] lg:items-center" : ""}`}>
                    <div>
                        <SectionHeading eyebrow="Flagship product" title="School management software, built around your school" text="Every school works differently, so we plan the modules with you. Typical areas include:" />
                        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                            {["Fee collection and reminders","Attendance with parent alerts","Assignments and homework","Student activity tracking (projects, culturals, sports)","Results and report cards","Announcements to parents","Separate logins for admin, teachers and parents"].map(item=><li key={item} className="flex gap-3 rounded-xl border border-[var(--border)] bg-white p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]"/><span>{item}</span></li>)}
                        </ul>
                        <p className="mt-5 text-sm text-[var(--muted)]">Modules are agreed in writing before work begins.</p>
                        <Link href="/contact?type=school" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-hover)]">Request a school demo</Link>
                    </div>
                    {screenshot ? <figure className="rounded-2xl border border-[var(--border)] bg-white p-4"><Image src={screenshot} alt="School software demo project screen" width={900} height={650} className="h-auto w-full rounded-xl" /><figcaption className="mt-3 text-sm font-semibold">Demo project</figcaption></figure> : null}
                </div>
            </section>

            <section className="premium-container py-16 sm:py-20">
                <SectionHeading title="Built for organisations like yours" />
                <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[[School,"Schools and colleges","Keep student, fee, attendance and parent updates together."],[ShoppingBag,"Retail and supermarkets","Keep customer orders, records and billing organised."],[Stethoscope,"Clinics and healthcare practices","Manage patient enquiries, appointments and follow-ups."],[FileText,"Growing service businesses","Keep customer details, approvals and repeat tasks in one place."]].map(([Icon,name,body])=><article key={String(name)} className="rounded-2xl border border-[var(--border)] p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--tint)] text-[var(--primary)]"><Icon className="h-6 w-6"/></span><h3 className="mt-4 text-lg font-bold">{String(name)}</h3><p className="mt-2 text-sm leading-6">{String(body)}</p></article>)}
                </div>
            </section>

            <section className="bg-[var(--surface-alt)] py-16 sm:py-20">
                <div className="premium-container">
                    <SectionHeading title="A clear process, no surprises" />
                    <ol className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[["1","We listen","We learn how your work runs today."],["2","We show a demo","You see a working sample before deciding."],["3","We build","We build only what is agreed in writing."],["4","We launch and support","We train your team and stay reachable on WhatsApp after launch."]].map(([n,h,b])=><li key={n} className="rounded-2xl border border-[var(--border)] bg-white p-6"><p className="text-sm font-bold text-[var(--primary)]">{n}</p><h3 className="mt-3 text-xl font-bold">{h}</h3><p className="mt-2 leading-7">{b}</p></li>)}
                    </ol>
                </div>
            </section>

            {(supermarketDemo || schoolDemo) ? <section className="premium-container py-16 sm:py-20"><SectionHeading title="Demo projects" text="Open a working demo to see how a project can work."/><div className="mt-8 grid gap-5 sm:grid-cols-2">{supermarketDemo ? <article className="rounded-2xl border border-[var(--border)] p-6"><p className="text-xs font-semibold uppercase text-[var(--primary)]">Demo project</p><h3 className="mt-3 text-xl font-bold">Sri Sai Supermarket ordering demo</h3><a className="mt-5 inline-flex min-h-11 items-center font-semibold text-[var(--primary)]" href={supermarketDemo} target="_blank" rel="noopener noreferrer">Open demo <ArrowRight className="ml-2 h-4 w-4"/></a></article> : null}{schoolDemo ? <article className="rounded-2xl border border-[var(--border)] p-6"><p className="text-xs font-semibold uppercase text-[var(--primary)]">Demo project</p><h3 className="mt-3 text-xl font-bold">School management demo</h3><a className="mt-5 inline-flex min-h-11 items-center font-semibold text-[var(--primary)]" href={schoolDemo} target="_blank" rel="noopener noreferrer">Open demo <ArrowRight className="ml-2 h-4 w-4"/></a></article> : null}</div></section> : null}

            {founderVisible ? <section className="bg-[var(--surface-alt)] py-16 sm:py-20"><div className="premium-container grid gap-8 md:grid-cols-[220px_1fr] md:items-center"><Image src={founderPhoto!} alt={`Photo of ${founderName}`} width={220} height={240} className="h-60 w-full rounded-2xl object-cover md:w-[220px]"/><div><h2 className="text-3xl font-extrabold">Meet {founderName}</h2><p className="mt-4 leading-8">{founderStory}</p></div></div></section> : null}

            <section id="faq" className="premium-container py-16 sm:py-20">
                <SectionHeading title="Frequently asked questions" />
                <div className="mt-8 max-w-3xl divide-y divide-[var(--border)] border-y border-[var(--border)]">{faqs.map(([q,a])=><details key={q} className="py-5"><summary className="cursor-pointer text-lg font-semibold">{q}</summary><p className="mt-3 leading-7">{a}</p></details>)}</div>
            </section>

            <section className="bg-[var(--dark)] py-16 text-white sm:py-20" style={{borderTop:"4px solid var(--gold)"}}>
                <div className="premium-container">
                    <h2 className="max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">Tell us what takes most of your time.</h2>
                    <p className="mt-4 text-lg text-white">We will suggest where to start.</p>
                    <div className="mt-8 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex min-h-12 items-center rounded-xl bg-white px-6 py-3 font-semibold text-[var(--dark)]">Book a consultation</Link>{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>Chat on WhatsApp</a> : null}</div>
                </div>
            </section>
        </>
    );
}
