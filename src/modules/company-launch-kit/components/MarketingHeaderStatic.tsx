import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
import { LanguageToggle } from "@/src/modules/company-launch-kit/components/LanguageToggle";
import { whatsappLink } from "@/src/config/company-profile";

const LINKS = [
    { label: "Services", href: "/services" },
    { label: "School Software", href: "/school-erp" },
    { label: "Demos", href: "/demos" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
];

const WA_URL = whatsappLink("Hi, I saw your website. I want to know more about your services.");

export function MarketingHeaderStatic() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--premium-border)] bg-[var(--premium-bg)]/95 backdrop-blur-xl">
            <div className="premium-container flex min-h-16 items-center justify-between gap-4 py-3">
                <Link href="/" className="shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]" aria-label="Arjun Automation Enterprises — Home">
                    <BrandLogo variant="blue" priority className="h-8" />
                </Link>
                <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
                    {LINKS.map((item) => (
                        <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm font-medium text-[var(--dos-text-secondary)] transition hover:bg-[var(--dos-surface-secondary)] hover:text-[var(--dos-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]">
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    <LanguageToggle />
                    {WA_URL ? (
                        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-[#073b1e] transition hover:bg-[#20bd5a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2">
                            <MessageCircle className="h-4 w-4" aria-hidden="true" />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                    ) : null}
                    <details className="group relative lg:hidden">
                        <summary className="flex min-h-11 min-w-11 list-none cursor-pointer items-center justify-center rounded-lg border border-[var(--premium-border)] text-[var(--dos-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] [&::-webkit-details-marker]:hidden">
                            <span className="sr-only">Open navigation</span>
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
                        </summary>
                        <nav className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] p-3 shadow-xl" aria-label="Mobile navigation">
                            {LINKS.map((item) => (
                                <Link key={item.href} href={item.href} className="block min-h-11 rounded-lg px-4 py-3 text-sm font-medium text-[var(--dos-text-primary)] hover:bg-[var(--dos-surface-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]">
                                    {item.label}
                                </Link>
                            ))}
                            {WA_URL ? <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#073b1e]"><MessageCircle className="h-4 w-4" />WhatsApp</a> : null}
                        </nav>
                    </details>
                </div>
            </div>
        </header>
    );
}
