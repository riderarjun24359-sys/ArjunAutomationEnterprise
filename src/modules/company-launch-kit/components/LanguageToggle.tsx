"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TRANSLATED_PATHS = ["/", "/services", "/school-erp", "/demos", "/pricing", "/about", "/contact"];

export function LanguageToggle() {
    const pathname = usePathname() || "/";
    const isTelugu = pathname === "/te" || pathname.startsWith("/te/");
    const englishPath = isTelugu ? (pathname.replace(/^\/te(?=\/|$)/, "") || "/") : pathname;
    const hasTeluguPage = TRANSLATED_PATHS.includes(englishPath);
    const teluguPath = isTelugu ? pathname : (hasTeluguPage ? `/te${englishPath === "/" ? "" : englishPath}` : "/te");

    return (
        <nav aria-label="Choose language" className="flex items-center rounded-full border border-[var(--premium-border)] p-1 text-sm">
            <Link href={englishPath} aria-current={!isTelugu ? "page" : undefined} className={`rounded-full px-3 py-1.5 font-semibold ${!isTelugu ? "bg-indigo-700 text-white" : "text-[var(--premium-fg-muted)]"}`}>EN</Link>
            <Link href={teluguPath} aria-current={isTelugu ? "page" : undefined} className={`rounded-full px-3 py-1.5 font-semibold ${isTelugu ? "bg-indigo-700 text-white" : "text-[var(--premium-fg-muted)]"}`}>తెలుగు</Link>
        </nav>
    );
}
