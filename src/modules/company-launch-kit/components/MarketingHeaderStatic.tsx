import Link from "next/link";
import { ArrowUpRight, Menu, Phone } from "lucide-react";
import { COMPANY_PROFILE } from "@/src/config/company-profile";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

const NAV_ITEMS = [
    { label: "Services", href: MARKETING_ROUTES.services },
    { label: "Blueprints", href: "/blueprints" },
    { label: "Pricing", href: MARKETING_ROUTES.pricing },
    { label: "About", href: MARKETING_ROUTES.about },
    { label: "Contact", href: MARKETING_ROUTES.contact },
] as const;

const phoneHref = COMPANY_PROFILE.phoneE164 ? `tel:${COMPANY_PROFILE.phoneE164}` : undefined;

export function MarketingHeaderStatic() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
                <Link href="/" aria-label="Arjun Automation home" className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                    <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold tracking-tight text-white">AA</span>
                    <span className="text-base font-bold tracking-tight text-slate-950 sm:text-lg">Arjun Automation</span>
                </Link>

                <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden shrink-0 items-center gap-4 xl:flex">
                    {phoneHref ? (
                        <a href={phoneHref} className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-700 transition hover:text-blue-700">
                            <Phone aria-hidden="true" className="h-4 w-4" />
                            {COMPANY_PROFILE.phoneDisplay}
                        </a>
                    ) : null}
                    <Link href={MARKETING_ROUTES.contact} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                        Book a Free Call
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                </div>

                <details className="group relative xl:hidden">
                    <summary aria-label="Open navigation menu" className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-lg border border-slate-200 text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden">
                        <Menu aria-hidden="true" className="h-5 w-5 group-open:hidden" />
                        <span aria-hidden="true" className="hidden text-2xl leading-none group-open:block">×</span>
                    </summary>
                    <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute right-0 top-full mt-3 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                        <div className="flex flex-col gap-1">
                            {NAV_ITEMS.map((item) => (
                                <Link key={item.href} href={item.href} className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-700">
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-3 border-t border-slate-100 pt-3">
                            {phoneHref ? <a href={phoneHref} className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700"><Phone className="h-4 w-4" />{COMPANY_PROFILE.phoneDisplay}</a> : null}
                            <Link href={MARKETING_ROUTES.contact} className="mt-1 flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">Book a Free Call</Link>
                        </div>
                    </nav>
                </details>
            </div>
        </header>
    );
}
