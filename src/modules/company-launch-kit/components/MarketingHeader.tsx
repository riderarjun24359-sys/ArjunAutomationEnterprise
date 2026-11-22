"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, MessageCircle, Phone } from "lucide-react";
import { LanguageToggle } from "@/src/modules/company-launch-kit/components/LanguageToggle";
import { whatsappLink } from "@/src/config/company-profile";

const links = [
    { label: "Services", href: "/services" },
    { label: "School Software", href: "/school-erp" },
    { label: "Demos", href: "/demos" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
];

export function MarketingHeader() {
    const pathname = usePathname() || "/";
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [darkSection, setDarkSection] = useState(true);
    const drawerRef = useRef<HTMLDivElement>(null);
    const wa = whatsappLink("Hi, I would like to discuss a software or automation project.");

    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const drawer = drawerRef.current;
        const focusable = drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        focusable?.[0]?.focus();

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
                return;
            }
            if (event.key !== "Tab" || !focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    useEffect(() => {
        const updateScroll = () => setScrolled(window.scrollY > 24);
        updateScroll();
        window.addEventListener("scroll", updateScroll, { passive: true });
        const sections = Array.from(document.querySelectorAll("main > section"));
        if (!sections.length) return () => window.removeEventListener("scroll", updateScroll);
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
            if (!visible) return;
            const section = visible.target as HTMLElement;
            setDarkSection(section.classList.contains("fluid-hero") || section.classList.contains("fluid-dark-section") || section.classList.contains("premium-cta-panel"));
        }, { rootMargin: "-72px 0px -55% 0px", threshold: [0.1,0.35,0.6] });
        sections.forEach(section => observer.observe(section));
        return () => { window.removeEventListener("scroll", updateScroll); observer.disconnect(); };
    }, [pathname]);

    const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
    const tone = darkSection ? "text-white border-white/10" : "text-[var(--ink)] border-[var(--light-border)]";
    const surface = scrolled ? (darkSection ? "bg-[rgba(5,6,15,.78)] backdrop-blur-xl" : "bg-[rgba(255,255,255,.9)] backdrop-blur-xl shadow-[0_6px_24px_rgba(10,13,31,.06)]") : "bg-transparent";

    return (
        <header className={`sticky top-0 z-50 h-[72px] border-b transition-colors duration-200 ${tone} ${surface}`}>
            <div className="premium-container flex h-full items-center justify-between gap-4">
                <Link href="/" className="flex shrink-0 items-center gap-2 rounded-lg" aria-label="Arjun Automation home">
                    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={`h-8 w-8 ${darkSection ? "text-white" : "text-[var(--primary-deep)]"}`}>
                        <path d="M16 104 L60 16 L104 104" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M46 78H74" stroke="#C99A2E" strokeWidth="4"/>
                        <circle cx="46" cy="78" r="7" fill="#C99A2E"/><circle cx="60" cy="78" r="7" fill="#C99A2E"/><circle cx="74" cy="78" r="7" fill="#C99A2E"/>
                    </svg>
                    <span className={`font-extrabold tracking-tight ${darkSection ? "text-white" : "text-[var(--ink)]"}`}>Arjun Automation</span>
                </Link>

                <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
                    {links.map(item => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={`border-b-2 py-2 text-sm font-semibold transition-colors ${active(item.href) ? "border-[var(--primary)] text-[var(--primary)]" : "border-transparent text-[var(--body)] hover:text-[var(--primary)]"}`}>{item.label}</Link>)}
                </nav>

                <div className="flex items-center gap-2">
                    <LanguageToggle />
                    <Link href="/contact" className="hidden min-h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] lg:inline-flex">Book a consultation</Link>
                    <button type="button" className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${darkSection ? "border-white/30 text-white" : "border-[var(--border-strong)] text-[var(--ink)]"} lg:hidden`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>{open ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}</button>
                </div>
            </div>

            {open ? <div ref={drawerRef} id="mobile-navigation" className="fixed inset-0 top-[72px] z-50 overflow-y-auto bg-[rgba(5,6,15,.97)] px-5 pb-10 pt-5 text-white backdrop-blur-xl lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
                <nav className="flex flex-col" aria-label="Mobile main navigation">
                    {links.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active(item.href) ? "page" : undefined} className="flex min-h-14 items-center border-b border-white/10 text-lg font-semibold text-white">{item.label}</Link>)}
                </nav>
                <Link href="/contact" onClick={() => setOpen(false)} className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white">Book a consultation</Link>
                {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--wa)] px-5 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>WhatsApp</a> : null}
                <a href="tel:+917337027357" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 font-semibold text-white"><Phone className="h-5 w-5"/>Call +91 73370 27357</a>
            </div> : null}
        </header>
    );
}
