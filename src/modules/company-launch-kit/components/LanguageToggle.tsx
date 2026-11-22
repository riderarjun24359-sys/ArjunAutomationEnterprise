"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TRANSLATED_PATHS = ["/", "/services", "/school-erp", "/demos", "/pricing", "/about", "/contact"];

export function LanguageToggle() {
    const pathname = usePathname() || "/";
    const isTelugu = pathname === "/te" || pathname.startsWith("/te/");

    useEffect(() => {
        try {
            window.localStorage.setItem("arjun-site-language", isTelugu ? "te" : "en");
        } catch {
            // Storage may be unavailable; the current route still sets the language.
        }
    }, [isTelugu]);

    const englishPath = isTelugu ? (pathname.replace(/^\/te(?=\/|$)/, "") || "/") : pathname;
    const hasTeluguPage = TRANSLATED_PATHS.includes(englishPath);
    const teluguPath = isTelugu ? pathname : (hasTeluguPage ? `/te${englishPath === "/" ? "" : englishPath}` : "/te");

    return <nav aria-label="Choose language" className="flex items-center rounded-xl border border-[var(--border)] p-1 text-sm">
        <Link href={englishPath} aria-current={!isTelugu ? "page" : undefined} className={`rounded-lg px-3 py-1.5 font-semibold ${!isTelugu ? "bg-[var(--tint)] text-[var(--primary)]" : "text-[var(--muted)]"}`}>EN</Link>
        <Link href={teluguPath} aria-current={isTelugu ? "page" : undefined} className={`rounded-lg px-3 py-1.5 font-semibold ${isTelugu ? "bg-[var(--tint)] text-[var(--primary)]" : "text-[var(--muted)]"}`}>తెలుగు</Link>
    </nav>;
}
