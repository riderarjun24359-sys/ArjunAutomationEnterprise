import Link from "next/link";
import { COMPANY_PROFILE, whatsappLink } from "@/src/config/company-profile";

const whatsapp = whatsappLink("Hi, I would like to know more about your services.");

export function MarketingFooterStatic() {
    return (
        <footer id="site-footer" className="bg-[var(--dark)] text-white">
            <div className="premium-container grid gap-10 py-12 md:grid-cols-4">
                <div>
                    <Link href="/" className="flex items-center gap-3" aria-label="Arjun Automation Enterprises home">
                        <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className="h-9 w-9 text-white">
                            <path d="M16 104 L60 16 L104 104" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M46 78H74" stroke="#C99A2E" strokeWidth="4"/>
                            <circle cx="46" cy="78" r="7" fill="#C99A2E"/><circle cx="60" cy="78" r="7" fill="#C99A2E"/><circle cx="74" cy="78" r="7" fill="#C99A2E"/>
                        </svg>
                        <span className="font-extrabold text-white">Arjun Automation Enterprises</span>
                    </Link>
                    <p className="mt-5 max-w-xs text-sm leading-6 text-white">Custom software, AI automation and business systems.</p>
                    <p className="mt-3 text-sm text-white">Serving Andhra Pradesh and Telangana</p>
                </div>
                <nav aria-label="Company">
                    <h2 className="font-bold text-white">Company</h2>
                    <ul className="mt-4 space-y-4 text-sm text-white"><li><Link href="/about">About</Link></li><li><Link href="/contact">Contact</Link></li></ul>
                </nav>
                <nav aria-label="Services">
                    <h2 className="font-bold text-white">Services</h2>
                    <ul className="mt-4 space-y-4 text-sm text-white"><li><Link href="/services">Services</Link></li><li><Link href="/school-erp">School Software</Link></li><li><Link href="/demos">Demos</Link></li><li><Link href="/pricing">Pricing</Link></li></ul>
                </nav>
                <div>
                    <h2 className="font-bold text-white">Contact</h2>
                    <div className="mt-4 flex flex-col gap-4 text-sm text-white">
                        <a href={`tel:${COMPANY_PROFILE.phoneE164}`}>{COMPANY_PROFILE.phoneDisplay}</a>
                        <a href={`mailto:${COMPANY_PROFILE.emails.sales}`}>{COMPANY_PROFILE.emails.sales}</a>
                        {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
                    </div>
                </div>
            </div>
            <div className="border-t border-white/20">
                <div className="premium-container flex flex-wrap items-center justify-between gap-4 py-5 text-sm text-white">
                    <p className="text-white">© 2026 Arjun Automation Enterprises</p>
                    <div className="flex gap-5"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
                </div>
            </div>
        </footer>
    );
}
