import Link from "next/link";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
import { COMPANY_PROFILE, HAS_PHONE, whatsappLink, WHATSAPP_DEFAULT_MESSAGE } from "@/src/config/company-profile";

const GROUPS = [
    {
        title: "Company",
        links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }],
    },
    {
        title: "Services",
        links: [
            { label: "School and College Management", href: "/services#school" },
            { label: "WhatsApp Automation", href: "/services#whatsapp" },
            { label: "Business Websites", href: "/services#website" },
            { label: "School Software", href: "/school-erp" },
            { label: "Demos", href: "/demos" },
            { label: "Pricing", href: "/pricing" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Cookies", href: "/cookies" },
            { label: "Refund", href: "/refund" },
        ],
    },
];

export function MarketingFooterStatic() {
    const wa = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);
    return (
        <footer className="border-t border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] text-[var(--premium-fg-muted)]">
            <div className="premium-container grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1.6fr_1fr]">
                <div>
                    <Link href="/" aria-label="Arjun Automation Enterprises — Home"><BrandLogo variant="blue" className="h-8" /></Link>
                    <p className="mt-4 max-w-xs text-sm leading-6">School software, WhatsApp automation and websites for local businesses.</p>
                    <p className="mt-3 text-sm">Serving Andhra Pradesh and Telangana.</p>
                    {HAS_PHONE ? <a className="mt-3 inline-block text-sm font-semibold" href={`tel:${COMPANY_PROFILE.phoneE164}`}>{COMPANY_PROFILE.phoneDisplay}</a> : null}
                    {COMPANY_PROFILE.emails.sales ? <a className="mt-2 block text-sm" href={`mailto:${COMPANY_PROFILE.emails.sales}`}>{COMPANY_PROFILE.emails.sales}</a> : null}
                    {wa ? <a className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-[#073b1e]" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
                </div>
                {GROUPS.map((group) => (
                    <nav key={group.title} aria-label={`Footer — ${group.title}`}>
                        <h2 className="text-sm font-semibold text-[var(--premium-fg)]">{group.title}</h2>
                        <ul className="mt-4 space-y-2 text-sm">
                            {group.links.map((item) => <li key={item.href}><Link className="rounded py-1 hover:text-[var(--premium-fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]" href={item.href}>{item.label}</Link></li>)}
                        </ul>
                    </nav>
                ))}
            </div>
            <div className="border-t border-[var(--premium-border)]">
                <div className="premium-container py-6 text-sm">© 2026 Arjun Automation Enterprises. All rights reserved.</div>
            </div>
        </footer>
    );
}
