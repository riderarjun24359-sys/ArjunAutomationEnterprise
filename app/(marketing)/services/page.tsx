import type { Metadata } from "next";
import { MessageCircle, GraduationCap, ShoppingBag, Globe2, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "Services",
    description: "School and college management software, WhatsApp ordering and appointment reminders, and simple websites for local businesses.",
    path: "/services",
});

const schoolWhatsApp = whatsappLink("Hi, I want to discuss school and college management software.");
const shopWhatsApp = whatsappLink("Hi, I want to discuss WhatsApp automation for my shop or clinic.");
const websiteWhatsApp = whatsappLink("Hi, I want to discuss a website for my business.");

function WhatsAppButton({ href, children }: { href: string | null; children: React.ReactNode }) {
    if (!href) return null;
    return <a href={href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"><MessageCircle className="h-5 w-5" />{children}</a>;
}

function ServiceSection({ id, icon, title, audience, outcomes, needs, whatsapp, button }: {
    id: string;
    icon: React.ReactNode;
    title: string;
    audience: string;
    outcomes: string[];
    needs: string[];
    whatsapp: string | null;
    button: string;
}) {
    return (
        <section id={id} className="scroll-mt-24 border-b border-[var(--premium-border)] py-14 sm:py-16">
            <div className="grid gap-9 lg:grid-cols-[.9fr_1.1fr]">
                <div>
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-700">{icon}</span>
                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--premium-fg)]">{title}</h2>
                    <p className="mt-4 text-base leading-7 text-[var(--premium-fg-muted)]"><strong className="text-[var(--premium-fg)]">Who it is for:</strong> {audience}</p>
                    <WhatsAppButton href={whatsapp}>{button}</WhatsAppButton>
                </div>
                <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--premium-fg)]">What it helps you do</h3>
                        <ul className="mt-4 space-y-3">
                            {outcomes.map((item) => <li key={item} className="flex gap-3 text-base leading-7 text-[var(--premium-fg-muted)]"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--premium-fg)]">What we need from you</h3>
                        <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-7 text-[var(--premium-fg-muted)]">
                            {needs.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function ServicesPage() {
    return (
        <div className="premium-container py-14 sm:py-18">
            <header className="max-w-3xl">
                <p className="text-sm font-semibold text-indigo-700">Our services</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">Simple software that makes daily work easier.</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">We build around the way your school or business works today. You can see a demo and agree on the work before we start.</p>
            </header>
            <ServiceSection
                id="school"
                icon={<GraduationCap className="h-6 w-6" />}
                title="School and College Management"
                audience="school owners, principals, office staff and colleges that want student, fee and attendance details in one place."
                outcomes={["Keep student and parent details together", "Record fees and follow up on pending payments", "Mark daily attendance and send parent updates", "Share assignments, homework, results and report cards", "Send school announcements to parents"]}
                needs={["Your class and student details", "Your fee structure and payment process", "How attendance is recorded today", "What updates you want parents to receive"]}
                whatsapp={schoolWhatsApp}
                button="Get a free school demo"
            />
            <ServiceSection
                id="whatsapp"
                icon={<ShoppingBag className="h-6 w-6" />}
                title="WhatsApp Automation for Shops and Clinics"
                audience="shops, supermarkets and clinics that already speak to customers on WhatsApp."
                outcomes={["Ordering on WhatsApp", "Appointment booking", "Reminders", "Offers broadcast", "Simple replies to common questions"]}
                needs={["Your business hours", "Your products or services and prices", "Appointment times, if applicable", "Common questions customers ask"]}
                whatsapp={shopWhatsApp}
                button="Talk about WhatsApp"
            />
            <ServiceSection
                id="website"
                icon={<Globe2 className="h-6 w-6" />}
                title="Website for Your Business"
                audience="local businesses that need a clear website customers can open easily on a phone."
                outcomes={["Show your services, products and opening hours", "Let visitors call or message you on WhatsApp", "Share your location and service area", "Give customers a simple way to send an enquiry", "Present your business in English and Telugu"]}
                needs={["Your business name and logo, if available", "Photos and a list of your services", "Your phone number and location", "Any prices or details you want customers to see"]}
                whatsapp={websiteWhatsApp}
                button="Discuss a website"
            />
        </div>
    );
}
