"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, [string,string]> = {
    "/services": ["Services","సేవలు"],
    "/school-erp": ["School Software","స్కూల్ సాఫ్ట్‌వేర్"],
    "/demos": ["Demos","డెమోలు"],
    "/pricing": ["Pricing","ధరలు"],
    "/about": ["About","మా గురించి"],
    "/contact": ["Contact","సంప్రదించండి"],
    "/privacy": ["Privacy","గోప్యత"],
    "/terms": ["Terms","నిబంధనలు"],
    "/thank-you": ["Thank You","ధన్యవాదాలు"],
    "/styleguide": ["Style Guide","డిజైన్ గైడ్"],
};

export function MarketingBreadcrumbs() {
    const pathname = usePathname() || "/";
    if (pathname === "/" || pathname === "/te") return null;
    const telugu = pathname.startsWith("/te/");
    const path = telugu ? (pathname.replace(/^\/te(?=\/|$)/, "") || "/") : pathname;
    const label = labels[path]?.[telugu ? 1 : 0] ?? (telugu ? "పేజీ" : "Page");
    const home = telugu ? "/te" : "/";
    const homeLabel = telugu ? "హోమ్" : "Home";

    return <nav aria-label={telugu ? "మీరు ఉన్న పేజీ" : "Breadcrumb"} className="premium-container py-3 text-sm text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={home} className="rounded underline-offset-4 hover:underline">{homeLabel}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-[var(--ink)]">{label}</li>
        </ol>
    </nav>;
}
