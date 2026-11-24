import Link from "next/link";
import { COMPANY_PROFILE, formatAddress } from "@/src/config/company-profile";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";

const NAV_LINKS = [
    { label: "Services", href: "/services" },
    { label: "Blueprints", href: "/blueprints" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
] as const;

const LEGAL_LINKS = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "Refund Policy", href: "/refund" },
] as const;

export function MarketingFooterStatic() {
    const address = formatAddress() ?? "Balanagar, Secunderabad, Telangana 500042, India";

    return (
        <footer className="border-t border-slate-800 bg-slate-950 pb-16 text-slate-300 sm:pb-0">
            <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16 lg:py-16">
                <div>
                    <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                        <BrandLogo variant="horizontal" className="h-10 w-auto max-w-[15rem] brightness-0 invert" />
                    </Link>
                    <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                        Practical websites, AI and WhatsApp automation, and custom business software for shops, traders, clinics, schools and growing teams across India.
                    </p>
                    <address className="mt-5 flex flex-col gap-3 text-sm not-italic text-slate-400">
                        <a className="w-fit transition hover:text-white" href={`mailto:${COMPANY_PROFILE.emails.sales}`}>{COMPANY_PROFILE.emails.sales}</a>
                        <a className="w-fit transition hover:text-white" href={`tel:${COMPANY_PROFILE.phoneE164 ?? "+917337027357"}`}>{COMPANY_PROFILE.phoneDisplay ?? "+91 73370 27357"}</a>
                        <span>{address}</span>
                    </address>
                </div>

                <nav aria-label="Footer navigation">
                    <h2 className="text-sm font-semibold text-white">Navigation</h2>
                    <ul className="mt-5 space-y-3">
                        {NAV_LINKS.map((item) => <li key={item.href}><Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">{item.label}</Link></li>)}
                    </ul>
                </nav>

                <nav aria-label="Legal links">
                    <h2 className="text-sm font-semibold text-white">Legal</h2>
                    <ul className="mt-5 space-y-3">
                        {LEGAL_LINKS.map((item) => <li key={item.href}><Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">{item.label}</Link></li>)}
                    </ul>
                </nav>
            </div>
            <div className="border-t border-slate-800">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Arjun Automations. All rights reserved.</p>
                    <p>Balanagar, Secunderabad, Telangana, India</p>
                </div>
            </div>
        </footer>
    );
}
